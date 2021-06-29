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

process.setMaxListeners(0)
let window: Electron.BrowserWindow | null
let ffmpegPath = path.join(app.getAppPath(), "../../ffmpeg/ffmpeg.exe") as any
let waifu2xPath = path.join(app.getAppPath(), "../app.asar.unpacked/node_modules/waifu2x/waifu2x")
if (!fs.existsSync(ffmpegPath)) ffmpegPath = undefined
if (!fs.existsSync(waifu2xPath)) waifu2xPath = path.join(__dirname, "../waifu2x")
autoUpdater.autoDownload = false
const store = new Store()

const active: Array<{id: number, source: string, dest: string, type: "image" | "gif" | "video", action: null | "stop"}> = []

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

ipcMain.handle("install-update", async (event) => {
  await autoUpdater.downloadUpdate()
  autoUpdater.quitAndInstall()
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
  const index = active.findIndex((a) => a.id === id)
  if (index !== -1) {
    active[index].action = "stop"
    const dest = active[index].dest
    const source = active[index].source
    if (active[index].type === "image") {
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

ipcMain.handle("upscale", async (event, info: any) => {
  const options = {
    noise: Number(info.noise) as any,
    scale: Number(info.scale),
    mode: info.mode,
    quality: Number(info.quality),
    speed: Number(info.speed),
    reverse: info.reverse,
    cumulative: info.gifCumulative,
    framerate: Number(info.framerate),
    jpgWebpQuality: Number(info.jpgQuality),
    pngCompression: Number(info.pngCompression),
    threads: Number(info.threads),
    disableGPU: info.disableGPU,
    forceOpenCL: info.forceOpenCL,
    rename: info.rename,
    blockSize: Number(info.blockSize),
    parallelFrames: Number(info.parallelFrames),
    transparency: info.gifTransparency,
    pitch: info.pitch,
    ffmpegPath,
    waifu2xPath
  }
  const action = () => {
    const index = active.findIndex((e) => e.id === info.id)
    if (index !== -1) {
      const action = active[index].action
      if (action === "stop") return "stop"
    }
  }
  const progress = (current: number, total: number) => {
    window?.webContents.send("conversion-progress", {id: info.id, current, total})
    const index = active.findIndex((e) => e.id === info.id)
    if (index !== -1) {
      const action = active[index].action
      if (action === "stop") return true
    }
  }
  let dest = waifu2x.parseDest(info.source, info.dest, options)
  const duplicate = active.find((a) => a.dest === dest)
  if (fs.existsSync(dest) || duplicate) dest = functions.newDest(dest, active)
  active.push({id: info.id, source: info.source, dest, type: info.type, action: null})
  let output = ""
  try {
    if (info.type === "image") {
      output = await waifu2x.upscaleImage(info.source, dest, options, action)
    } else if (info.type === "gif") {
      output = await waifu2x.upscaleGIF(info.source, dest, options, progress)
    } else if (info.type === "video") {
      output = await waifu2x.upscaleVideo(info.source, dest, options, progress)
    }
  } catch {
    output = dest
  }
  window?.webContents.send("conversion-finished", {id: info.id, output})
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

ipcMain.handle("get-downloads-folder", async (event, location: string) => {
  if (store.has("downloads")) {
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
    window = new BrowserWindow({width: 800, height: 600, minWidth: 720, minHeight: 450, frame: false, backgroundColor: "#5ea8da", center: true, webPreferences: {nodeIntegration: true, contextIsolation: false, enableRemoteModule: true}})
    window.loadFile(path.join(__dirname, "index.html"))
    window.removeMenu()
    window.on("closed", () => {
      window = null
    })
    globalShortcut.register("Control+Shift+I", () => {
      window?.webContents.toggleDevTools()
    })
  })
}

app.allowRendererProcessReuse = false
