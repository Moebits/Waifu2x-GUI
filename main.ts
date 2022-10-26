import {app, BrowserWindow, dialog, globalShortcut, ipcMain, shell} from "electron"
import Store from "electron-store"
import {autoUpdater} from "electron-updater"
import fs from "fs"
import imageSize from "image-size"
import path from "path"
import process from "process"
import waifu2x from "waifu2x"
import "./dev-app-update.yml"
import pack from "./package.json"
import functions from "./structures/functions"

require("@electron/remote/main").initialize()
process.setMaxListeners(0)
let window: Electron.BrowserWindow | null
let ffmpegPath = undefined as any
if (process.platform === "linux") ffmpegPath = path.join(app.getAppPath(), "../../ffmpeg/ffmpeg")
if (process.platform === "darwin") ffmpegPath = path.join(app.getAppPath(), "../../ffmpeg/ffmpeg.app")
if (process.platform === "win32") ffmpegPath = path.join(app.getAppPath(), "../../ffmpeg/ffmpeg.exe") 
let waifu2xPath = path.join(app.getAppPath(), "../app.asar.unpacked/node_modules/waifu2x/waifu2x")
let esrganPath = path.join(app.getAppPath(), "../app.asar.unpacked/node_modules/waifu2x/real-esrgan")
let webpPath = path.join(app.getAppPath(), "../app.asar.unpacked/node_modules/waifu2x/webp")
if (!fs.existsSync(ffmpegPath)) ffmpegPath = undefined
if (!fs.existsSync(waifu2xPath)) waifu2xPath = path.join(__dirname, "../waifu2x")
if (!fs.existsSync(esrganPath)) esrganPath = path.join(__dirname, "../real-esrgan")
if (!fs.existsSync(webpPath)) webpPath = path.join(__dirname, "../webp")
autoUpdater.autoDownload = false
const store = new Store()

const history: Array<{id: number, source: string, dest: string, type: "image" | "gif" | "video"}> = []
const active: Array<{id: number, source: string, dest: string, type: "image" | "gif" | "video", action: null | "stop"}> = []
const queue: Array<{started: boolean, info: any}> = []

ipcMain.handle("update-color", (event, color: string) => {
  window?.webContents.send("update-color", color)
})

ipcMain.handle("preview", (event, image: string, type: string) => {
  window?.webContents.send("preview", image, type)
})

ipcMain.handle("init-settings", () => {
  return store.get("settings", null)
})

ipcMain.handle("store-settings", (event, settings) => {
  const prev = store.get("settings", {}) as object
  store.set("settings", {...prev, ...settings})
})

ipcMain.handle("advanced-settings", () => {
  window?.webContents.send("close-all-dialogs", "settings")
  window?.webContents.send("show-settings-dialog")
})

ipcMain.handle("get-theme", () => {
  return store.get("theme", "light")
})

ipcMain.handle("save-theme", (event, theme: string) => {
  store.set("theme", theme)
})

ipcMain.handle("install-update", async (event) => {
  if (process.platform === "darwin") {
    const update = await autoUpdater.checkForUpdates()
    const url = `${pack.repository.url}/releases/download/v${update.updateInfo.version}/${update.updateInfo.files[0].url}`
    await shell.openExternal(url)
    app.quit()
  } else {
    await autoUpdater.downloadUpdate()
    autoUpdater.quitAndInstall()
  }
})

ipcMain.handle("check-for-updates", async (event, startup: boolean) => {
  window?.webContents.send("close-all-dialogs", "version")
  const update = await autoUpdater.checkForUpdates()
  const newVersion = update.updateInfo.version
  if (pack.version === newVersion) {
    if (!startup) window?.webContents.send("show-version-dialog", null)
  } else {
    window?.webContents.send("show-version-dialog", newVersion)
  }
})

ipcMain.handle("open-location", async (event, location: string) => {
  if (!fs.existsSync(location)) return
  if (fs.statSync(location).isDirectory()) {
    shell.openPath(path.normalize(location))
  } else {
    shell.showItemInFolder(path.normalize(location))
  }
})

ipcMain.handle("delete-conversion", async (event, id: number, frames: boolean) => {
  let dest = ""
  let source = ""
  let type = ""
  let index = active.findIndex((a) => a.id === id)
  if (index !== -1) {
    active[index].action = "stop"
    dest = active[index].dest
    source = active[index].source
    type = active[index].type
  } else {
    index = history.findIndex((a) => a.id === id)
    if (index !== -1) {
      dest = history[index].dest
      source = history[index].source
      type = history[index].type
    }
  }
  if (dest) {
    if (type === "image") {
      if (fs.existsSync(dest)) fs.unlinkSync(dest)
    } else {
      if (frames) {
        const frameDest = `${path.dirname(source)}/${path.basename(source, path.extname(source))}Frames`
        const match = dest.match(/_\d+(?=\.)/)?.[0]
        if (match) {
          const newFrameDest = `${path.dirname(source)}/${path.basename(source, path.extname(source))}Frames${match}`
          fs.existsSync(newFrameDest) ? functions.removeDirectory(newFrameDest) : (fs.existsSync(frameDest) ? functions.removeDirectory(frameDest) : null)
        } else {
          if (fs.existsSync(frameDest)) functions.removeDirectory(frameDest)
        }
      }
      let counter = 1
      let error = true
      while (error && counter < 20) {
        await functions.timeout(1000)
        try {
          fs.unlinkSync(dest)
          error = false
        } catch {
          // ignore
        }
        counter++
      }
    }
    return true
  }
  return false
})

ipcMain.handle("stop-conversion", async (event, id: number) => {
  const index = active.findIndex((a) => a.id === id)
  if (index !== -1) {
    active[index].action = "stop"
    return true
  }
  return false
})

ipcMain.handle("start-all", () => {
  window?.webContents.send("start-all")
})

ipcMain.handle("clear-all", () => {
  window?.webContents.send("clear-all")
})

const nextQueue = async (info: any) => {
  const index = active.findIndex((a) => a.id === info.id)
  if (index !== -1) active.splice(index, 1)
  const settings = store.get("settings", {}) as any
  let qIndex = queue.findIndex((q) => q.info.id === info.id)
  if (qIndex !== -1) {
    queue.splice(qIndex, 1)
    let concurrent = Number(settings?.queue)
    if (Number.isNaN(concurrent) || concurrent < 1) concurrent = 1
    if (active.length < concurrent) {
      const next = queue.find((q) => !q.started)
      if (next) {
        await upscale(next.info)
      }
    }
  }
}

const upscale = async (info: any) => {
  let qIndex = queue.findIndex((q) => q.info.id === info.id)
  if (qIndex !== -1) queue[qIndex].started = true
  const options = {
    noise: Number(info.noise) as any,
    scale: Number(info.scale),
    mode: info.mode,
    quality: Number(info.quality),
    speed: Number(info.speed),
    reverse: info.reverse,
    framerate: Number(info.framerate),
    jpgWebpQuality: Number(info.jpgQuality),
    pngCompression: Number(info.pngCompression),
    threads: Number(info.threads),
    disableGPU: info.disableGPU,
    forceOpenCL: info.forceOpenCL,
    rename: info.rename,
    blockSize: Number(info.blockSize),
    parallelFrames: Number(info.parallelFrames),
    transparentColor: info.gifTransparency ? "#000000" : undefined,
    pitch: info.pitch,
    sdColorSpace: info.sdColorSpace,
    upscaler: info.upscaler,
    ffmpegPath,
    waifu2xPath,
    esrganPath,
    webpPath
  }
  if (process.platform !== "win32") {
    info.source = info.source.replace("file://", "")
  }
  let overwrite = false
  if (info.dest.startsWith("{source}")) {
    if (!options.rename) overwrite = true
    info.dest = info.dest.replace("{source}", path.dirname(info.source))
  }
  let dest = waifu2x.parseDest(info.source, info.dest, options)
  const duplicate = active.find((a) => a.dest === dest)
  if (!overwrite && (fs.existsSync(dest) || duplicate)) dest = functions.newDest(dest, active)
  dest = dest.replace(/\\/g, "/")
  const action = (percent?: number) => {
    const index = active.findIndex((e) => e.id === info.id)
    if (index !== -1) {
      const action = active[index].action
      if (action === "stop") return true
    }
    if (percent !== undefined) window?.webContents.send("conversion-progress", {id: info.id, percent})
  }
  const progress = (current: number, total: number) => {
    const index = active.findIndex((e) => e.id === info.id)
    let frame = null
    if (index !== -1) {
      const action = active[index].action
      const frameDest = `${path.dirname(dest)}/${path.basename(info.source, path.extname(info.source))}Frames`
      if (fs.existsSync(frameDest)) {
        let frameArray = fs.readdirSync(frameDest).map((f) => `${frameDest}/${f}`).filter((f) => path.extname(f) === ".png")
        frameArray = frameArray.sort(new Intl.Collator(undefined, {numeric: true, sensitivity: "base"}).compare)
        frame = frameArray[current]
      }
      if (action === "stop") return true
    }
    window?.webContents.send("conversion-progress", {id: info.id, current, total, frame})
  }
  history.push({id: info.id, source: info.source, dest, type: info.type})
  active.push({id: info.id, source: info.source, dest, type: info.type, action: null})
  window?.webContents.send("conversion-started", {id: info.id})
  let output = ""
  try {
    if (info.type === "image") {
      output = await waifu2x.upscaleImage(info.source, dest, options, action)
    } else if (info.type === "gif") {
      output = await waifu2x.upscaleGIF(info.source, dest, options, progress)
    } else if (info.type === "animated webp") {
      output = await waifu2x.upscaleAnimatedWebp(info.source, dest, options, progress)
    } else if (info.type === "video") {
      output = await waifu2x.upscaleVideo(info.source, dest, options, progress)
    }
  } catch (error) {
      window?.webContents.send("debug", error)
      console.log(error)
      output = dest
  }
  window?.webContents.send("conversion-finished", {id: info.id, output})
  nextQueue(info)
}

ipcMain.handle("upscale", async (event, info: any, startAll: boolean) => {
  const qIndex = queue.findIndex((q) => q.info.id === info.id)
  if (qIndex === -1) queue.push({info, started: false})
  if (startAll) {
    const settings = store.get("settings", {}) as any
    let concurrent = Number(settings?.queue)
    if (Number.isNaN(concurrent) || concurrent < 1) concurrent = 1
    if (active.length < concurrent) {
      await upscale(info)
    }
  } else {
    await upscale(info)
  }
})

ipcMain.handle("update-concurrency", async (event, concurrent) => {
  if (Number.isNaN(concurrent) || concurrent < 1) concurrent = 1
  let counter = active.length
  while (counter < concurrent) {
    const next = queue.find((q) => !q.started)
    if (next) {
      counter++
      await upscale(next.info)
    } else {
      break
    }
  }
})


ipcMain.handle("move-queue", async (event, id: number) => {
  const settings = store.get("settings", {}) as any
  let concurrent = Number(settings?.queue)
  if (Number.isNaN(concurrent) || concurrent < 1) concurrent = 1
  if (id) {
    let qIndex = queue.findIndex((q) => q.info.id === id)
    if (qIndex !== -1) queue.splice(qIndex, 1)
  }
  if (active.length < concurrent) {
    const next = queue.find((q) => !q.started)
    if (next) {
      await upscale(next.info)
    }
  }
})

ipcMain.handle("get-dimensions", async (event, path: string, type: string) => {
  if (type === "video") {
    const dimensions = await waifu2x.parseResolution(path, ffmpegPath)
    const framerate = await waifu2x.parseFramerate(path, ffmpegPath)
    return {width: dimensions.width, height: dimensions.height, framerate}
  } else {
    const dimensions = imageSize(path)
    return {width: dimensions.width, height: dimensions.height}
  }
})

ipcMain.handle("add-files", (event, files: string[], identifers: number[]) => {
  window?.webContents.send("add-files", files, identifers)
})

ipcMain.handle("add-file-id", (event, file: string, pos: number, id: number) => {
    window?.webContents.send("add-file-id", file, pos, id)
})

ipcMain.handle("add-file", (event, file: string, pos: number) => {
    window?.webContents.send("add-file", file, pos)
})

ipcMain.handle("select-files", async () => {
  if (!window) return
  const files = await dialog.showOpenDialog(window, {
    filters: [
      {name: "All Files", extensions: ["*"]},
      {name: "Images", extensions: ["png", "jpg", "jpeg", "webp", "tiff"]},
      {name: "GIF", extensions: ["gif"]},
      {name: "Videos", extensions: ["mp4", "ogv", "webm", "avi", "mov", "mkv", "flv"]}
    ],
    properties: ["multiSelections", "openFile"]
  })
  return files.filePaths
})

ipcMain.handle("get-downloads-folder", async (event, force: boolean) => {
  if (store.has("downloads") && !force) {
    return store.get("downloads")
  } else {
    const downloads = app.getPath("downloads")
    store.set("downloads", downloads)
    return downloads
  }
})

ipcMain.handle("select-directory", async (event, dir: string) => {
  if (!window) return
  if (dir === undefined) {
    const result = await dialog.showOpenDialog(window, {
      properties: ["openDirectory"]
    })
    dir = result.filePaths[0]
  }
  if (dir) {
    store.set("downloads", dir)
    return dir
  }
})

const singleLock = app.requestSingleInstanceLock()

if (!singleLock) {
  app.quit()
} else {
  app.on("second-instance", () => {
    if (window) {
      if (window.isMinimized()) window.restore()
      window.focus()
    }
  })

  app.on("ready", () => {
    window = new BrowserWindow({width: 800, height: 600, minWidth: 720, minHeight: 450, frame: false, backgroundColor: "#5ea8da", center: true, webPreferences: {nodeIntegration: true, contextIsolation: false}})
    window.loadFile(path.join(__dirname, "index.html"))
    window.removeMenu()
    if (process.platform !== "win32") {
      if (ffmpegPath) fs.chmodSync(ffmpegPath, "777")
      waifu2x.chmod777(waifu2xPath, webpPath, esrganPath)
    }
    require("@electron/remote/main").enable(window.webContents)
    window.on("closed", () => {
      window = null
    })
    globalShortcut.register("Control+Shift+I", () => {
      window?.webContents.toggleDevTools()
    })
  })
}
