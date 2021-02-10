import {ipcRenderer} from "electron"
import fs from "fs"
import path from "path"

const images = [".png", ".jpg", ".jpeg", ".webp", ".tiff"]
const gifs = [".gif"]
const videos = [".mp4", ".ogv", ".webm", ".avi", ".mov", ".mkv", ".flv"]
let timer = null as any

let mouseDown = false
if (typeof window !== "undefined") {
    document.onmousedown = () => {
        mouseDown = true
    }
    document.onmouseup = () => {
        mouseDown = false
    }
}

export default class Functions {
    public static arrayIncludes = (str: string, arr: string[]) => {
        for (let i = 0; i < arr.length; i++) {
            if (str.includes(arr[i])) return true
        }
        return false
    }

    public static cleanTitle = (str: string) => {
        const ext = path.extname(str)
        const split = str.match(/.{1,30}/g)?.join(" ").replace(ext, "")!
        return `${split.slice(0, 70)}${ext}`
    }

    public static getType = (str: string) => {
        if (Functions.arrayIncludes(path.extname(str), images)) return "image"
        if (Functions.arrayIncludes(path.extname(str), gifs)) return "gif"
        if (Functions.arrayIncludes(path.extname(str), videos)) return "video"
    }

    public static arrayRemove = <T>(arr: T[], val: T) => {
        return arr.filter((item) => item !== val)
    }

    public static timeout = async (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    public static removeDirectory = (dir: string) => {
        if (dir === "/" || dir === "./") return
        if (fs.existsSync(dir)) {
            fs.readdirSync(dir).forEach(function(entry) {
                const entryPath = path.join(dir, entry)
                if (fs.lstatSync(entryPath).isDirectory()) {
                    Functions.removeDirectory(entryPath)
                } else {
                    fs.unlinkSync(entryPath)
                }
            })
            try {
                fs.rmdirSync(dir)
            } catch (e) {
                console.log(e)
            }
        }
    }

    public static logoDrag = (enable?: boolean) => {
        if (enable) {
            // @ts-expect-error
            document.querySelector(".logo-bar-drag")?.style["-webkit-app-region"] = "drag"
        } else {
            // @ts-expect-error
            document.querySelector(".logo-bar-drag")?.style["-webkit-app-region"] = "no-drag"
        }
    }

    public static newDest = (dest: string, active: any[]) => {
        let duplicate = active.find((a) => a.dest === dest)
        let i = 1
        let newDest = dest
        while (fs.existsSync(newDest) || duplicate) {
            newDest = `${path.dirname(dest)}\\${path.basename(dest, path.extname(dest))}_${i}${path.extname(dest)}`
            duplicate = active.find((a) => a.dest === newDest)
            i++
        }
        return newDest
    }

    public static autoScroll = (event: MouseEvent) => {
        if (!mouseDown) return
        const edgeSize = 100
        const edgeTop = edgeSize
        const edgeBottom = (document.documentElement.clientHeight - edgeSize)
        const isInTopEdge = (event.clientY < edgeTop)
        const isInBottomEdge = (event.clientY > edgeBottom)
        if (!isInTopEdge && !isInBottomEdge) {
            clearTimeout(timer)
            return
        }
        const maxScrollY = (document.body.scrollHeight - document.documentElement.clientHeight)
        const adjustScroll = () => {
            const currentScrollY = window.pageYOffset
            const canScrollUp = (currentScrollY > 0)
            const canScrollDown = (currentScrollY < maxScrollY)
            let nextScrollY = currentScrollY
            const maxStep = 50
            if (isInTopEdge && canScrollUp) {
                const intensity = ((edgeTop - event.clientY) / edgeSize)
                nextScrollY = (nextScrollY - (maxStep * intensity))
            } else if (isInBottomEdge && canScrollDown) {
                const intensity = ((event.clientY - edgeBottom) / edgeSize)
                nextScrollY = (nextScrollY + (maxStep * intensity))
            }
            nextScrollY = Math.max(0, Math.min(maxScrollY, nextScrollY))
            if (nextScrollY !== currentScrollY) {
                window.scrollTo(window.pageXOffset, nextScrollY)
                return true
            } else {
                return false
            }
        }
        const checkScroll = () => {
            clearTimeout(timer)
            if (!mouseDown) return
            if (adjustScroll()) {
                timer = setTimeout(checkScroll, 30)
            }
        }
        checkScroll()
    }
}
