import {ipcRenderer} from "electron"
import React, {useContext, useEffect, useRef, useState} from "react"
import checkboxChecked from "../assets/checkbox2-checked.png"
import checkbox from "../assets/checkbox2.png"
import {BlockSizeContext, DisableGPUContext, ForceOpenCLContext, FramerateContext, GIFQualityContext, SDColorSpaceContext,
GIFTransparencyContext, JPGQualityContext, ModeContext, NoiseContext, OriginalFramerateContext, ParallelFramesContext,
PitchContext, PNGCompressionContext, RenameContext, ReverseContext, ScaleContext, SpeedContext, ThreadsContext, VideoQualityContext, QueueContext} from "../renderer"
import functions from "../structures/functions"
import "../styles/advancedsettings.less"

const AdvancedSettings: React.FunctionComponent = (props) => {
    const {originalFramerate, setOriginalFramerate} = useContext(OriginalFramerateContext)
    const {framerate, setFramerate} = useContext(FramerateContext)
    const {videoQuality, setVideoQuality} = useContext(VideoQualityContext)
    const {gifQuality, setGIFQuality} = useContext(GIFQualityContext)
    const {pngCompression, setPNGCompression} = useContext(PNGCompressionContext)
    const {jpgQuality, setJPGQuality} = useContext(JPGQualityContext)
    const {parallelFrames, setParallelFrames} = useContext(ParallelFramesContext)
    const {disableGPU, setDisableGPU} = useContext(DisableGPUContext)
    const {forceOpenCL, setForceOpenCL} = useContext(ForceOpenCLContext)
    const {blockSize, setBlockSize} = useContext(BlockSizeContext)
    const {threads, setThreads} = useContext(ThreadsContext)
    const {rename, setRename} = useContext(RenameContext)
    const {pitch, setPitch} = useContext(PitchContext)
    const {sdColorSpace, setSDColorSpace} = useContext(SDColorSpaceContext)
    const {noise, setNoise} = useContext(NoiseContext)
    const {scale, setScale} = useContext(ScaleContext)
    const {speed, setSpeed} = useContext(SpeedContext)
    const {reverse, setReverse} = useContext(ReverseContext)
    const {mode, setMode} = useContext(ModeContext)
    const {gifTransparency, setGIFTransparency} = useContext(GIFTransparencyContext)
    const {queue, setQueue} = useContext(QueueContext)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const showSettingsDialog = (event: any, update: any) => {
            setVisible((prev) => !prev)
        }
        const closeAllDialogs = (event: any, ignore: any) => {
            if (ignore !== "settings") setVisible(false)
        }
        ipcRenderer.on("show-settings-dialog", showSettingsDialog)
        ipcRenderer.on("close-all-dialogs", closeAllDialogs)
        initSettings()
        return () => {
            ipcRenderer.removeListener("show-settings-dialog", showSettingsDialog)
            ipcRenderer.removeListener("close-all-dialogs", closeAllDialogs)
        }
    }, [])

    const initSettings = async () => {
        const settings = await ipcRenderer.invoke("init-settings")
        if (settings) {
            setRename(settings.rename)
            setOriginalFramerate(settings.originalFramerate)
            setFramerate(settings.framerate)
            setVideoQuality(settings.videoQuality)
            setGIFQuality(settings.gifQuality)
            setGIFTransparency(settings.gifTransparency)
            setPNGCompression(settings.pngCompression)
            setJPGQuality(settings.jpgQuality)
            setParallelFrames(settings.parallelFrames)
            setDisableGPU(settings.disableGPU)
            setForceOpenCL(settings.forceOpenCL)
            setBlockSize(settings.blockSize)
            setThreads(settings.threads)
            setNoise(settings.noise)
            setScale(settings.scale)
            setSpeed(settings.speed)
            setReverse(settings.reverse)
            setMode(settings.mode)
            setPitch(settings.pitch)
            setQueue(settings.queue)
            setSDColorSpace(settings.sdColorSpace)
        }
    }

    useEffect(() => {
        ipcRenderer.invoke("store-settings", {framerate, pitch, rename, originalFramerate, videoQuality, gifQuality, gifTransparency, pngCompression, jpgQuality, parallelFrames, disableGPU, forceOpenCL, blockSize, threads, queue, sdColorSpace})
        functions.logoDrag(!visible)
    })

    const ok = () => {
        functions.logoDrag(true)
        setVisible(false)
    }

    const revert = () => {
        setRename("2x")
        setOriginalFramerate(true)
        setFramerate(24)
        setVideoQuality(16)
        setGIFTransparency(true)
        setGIFQuality(10)
        setPNGCompression(3)
        setJPGQuality(100)
        setParallelFrames(2)
        setDisableGPU(false)
        setForceOpenCL(false)
        setBlockSize(1024)
        setThreads(4)
        setNoise(2)
        setScale(2)
        setSpeed(1)
        setReverse(false)
        setMode("noise-scale")
        setPitch(true)
        setQueue(1)
        setSDColorSpace(false)
    }

    const changeRename = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value.length > 10) return
        setRename(value)
    }

    const changeFramerate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value.replace(".", "").length > 4) return
        if (Number.isNaN(Number(value))) return
        setFramerate(value)
    }

    const changeFramerateKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowUp") {
            setFramerate((prev: any) => {
                if (Number(prev) + 1 > 9999) return Number(prev)
                if (String(prev).includes(".")) return (Number(prev) + 1).toFixed(functions.countDecimals(Number(prev), 2))
                return Number(prev) + 1
            })
        } else if (event.key === "ArrowDown") {
            setFramerate((prev: any) => {
                if (Number(prev) - 1 < 0) return Number(prev)
                if (String(prev).includes(".")) return (Number(prev) - 1).toFixed(functions.countDecimals(Number(prev), 2))
                return Number(prev) - 1
            })
        }
    }

    const changeVideoQuality = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value
        if (value.includes(".")) return
        if (value.length > 2) return
        if (Number.isNaN(Number(value))) return
        if (Number(value) > 51) value = "51"
        setVideoQuality(value)
    }

    const changeVideoQualityKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowUp") {
            setVideoQuality((prev: any) => {
                if (Number(prev) + 1 > 51) return Number(prev)
                return Number(prev) + 1
            })
        } else if (event.key === "ArrowDown") {
            setVideoQuality((prev: any) => {
                if (Number(prev) - 1 < 0) return Number(prev)
                return Number(prev) - 1
            })
        }
    }

    const changeGIFQuality = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value.includes(".")) return
        if (value.length > 3) return
        if (Number.isNaN(Number(value))) return
        setGIFQuality(value)
    }

    const changeGIFQualityKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowUp") {
            setGIFQuality((prev: any) => {
                if (Number(prev) + 1 > 999) return Number(prev)
                return Number(prev) + 1
            })
        } else if (event.key === "ArrowDown") {
            setGIFQuality((prev: any) => {
                if (Number(prev) - 1 < 0) return Number(prev)
                return Number(prev) - 1
            })
        }
    }

    const changePNGCompression = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value
        if (value.includes(".")) return
        if (value.length > 1) return
        if (Number.isNaN(Number(value))) return
        if (Number(value) > 9) value = "9"
        setPNGCompression(value)
    }

    const changePNGCompressionKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowUp") {
            setPNGCompression((prev: any) => {
                if (Number(prev) + 1 > 9) return Number(prev)
                return Number(prev) + 1
            })
        } else if (event.key === "ArrowDown") {
            setPNGCompression((prev: any) => {
                if (Number(prev) - 1 < 0) return Number(prev)
                return Number(prev) - 1
            })
        }
    }

    const changeJPGQuality = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value
        if (value.includes(".")) return
        if (value.length > 3) return
        if (Number.isNaN(Number(value))) return
        if (Number(value) > 101) value = "101"
        setJPGQuality(value)
    }

    const changeJPGQualityKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowUp") {
            setJPGQuality((prev: any) => {
                if (Number(prev) + 1 > 101) return Number(prev)
                return Number(prev) + 1
            })
        } else if (event.key === "ArrowDown") {
            setJPGQuality((prev: any) => {
                if (Number(prev) - 1 < 0) return Number(prev)
                return Number(prev) - 1
            })
        }
    }

    const changeParallelFrames = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value.includes(".")) return
        if (value.length > 3) return
        if (Number.isNaN(Number(value))) return
        setParallelFrames(value)
    }

    const changeParallelFramesKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowUp") {
            setParallelFrames((prev: any) => {
                if (Number(prev) + 1 > 999) return Number(prev)
                return Number(prev) + 1
            })
        } else if (event.key === "ArrowDown") {
            setParallelFrames((prev: any) => {
                if (Number(prev) - 1 < 0) return Number(prev)
                return Number(prev) - 1
            })
        }
    }

    const changeBlockSize = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value.includes(".")) return
        if (value.length > 5) return
        if (Number.isNaN(Number(value))) return
        setBlockSize(value)
    }

    const changeBlockSizeKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowUp") {
            setBlockSize((prev: any) => {
                if (Number(prev) * 2 > 9999) return Number(prev)
                if (Number(prev) === 0) return 1
                return Number(prev) * 2
            })
        } else if (event.key === "ArrowDown") {
            setBlockSize((prev: any) => {
                if (Number(prev) === 1) return 0
                return Math.round(Number(prev) / 2)
            })
        }
    }

    const changeThreads = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value.includes(".")) return
        if (value.length > 2) return
        if (Number.isNaN(Number(value))) return
        setThreads(value)
    }

    const changeThreadsKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowUp") {
            setThreads((prev: any) => {
                if (Number(prev) + 1 > 99) return Number(prev)
                return Number(prev) + 1
            })
        } else if (event.key === "ArrowDown") {
            setThreads((prev: any) => {
                if (Number(prev) - 1 < 0) return Number(prev)
                return Number(prev) - 1
            })
        }
    }

    const changeQueue = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value
        if (value.includes(".")) return
        if (value.length > 3) return
        if (Number.isNaN(Number(value))) return
        setQueue(value)
        ipcRenderer.invoke("update-concurrency", Number(value))
    }

    const changeQueueKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        let value = queue
        if (event.key === "ArrowUp") {
            setQueue((prev: any) => {
                if (Number(prev) + 1 > 999) return Number(prev)
                value = Number(prev) + 1
                return value
            })
        } else if (event.key === "ArrowDown") {
            setQueue((prev: any) => {
                if (Number(prev) - 1 < 1) return Number(prev)
                value = Number(prev) - 1
                return value
            })
        }
        ipcRenderer.invoke("update-concurrency", Number(value))
    }

    if (visible) {
        return (
            <section className="settings-dialog">
                <div className="settings-dialog-box">
                    <div className="settings-container">
                        <div className="settings-title-container">
                            <p className="settings-title">Advanced Settings</p>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">Rename: </p>
                            <input className="settings-input" type="text" spellCheck="false" value={rename} onChange={changeRename}/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">Framerate: </p>
                            <input className="settings-input" type="text" spellCheck="false" value={framerate} onChange={changeFramerate} onKeyDown={changeFramerateKey}/>
                            <p className="settings-text">Original?</p>
                            <img src={originalFramerate ? checkboxChecked : checkbox} onClick={() => setOriginalFramerate((prev: boolean) => !prev)} className="settings-checkbox"/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">Pitch Audio? </p>
                            <img src={pitch ? checkboxChecked : checkbox} onClick={() => setPitch((prev: boolean) => !prev)} className="settings-checkbox"/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">SD Colorspace? </p>
                            <img src={sdColorSpace ? checkboxChecked : checkbox} onClick={() => setSDColorSpace((prev: boolean) => !prev)} className="settings-checkbox"/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">Video Quality: </p>
                            <input className="settings-input" type="text" spellCheck="false" value={videoQuality} onChange={changeVideoQuality} onKeyDown={changeVideoQualityKey}/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">GIF Transparency? </p>
                            <img src={gifTransparency ? checkboxChecked : checkbox} onClick={() => setGIFTransparency((prev: boolean) => !prev)} className="settings-checkbox"/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">GIF Quality: </p>
                            <input className="settings-input" type="text" spellCheck="false" value={gifQuality} onChange={changeGIFQuality} onKeyDown={changeGIFQualityKey}/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">PNG Compression: </p>
                            <input className="settings-input" type="text" spellCheck="false" value={pngCompression} onChange={changePNGCompression} onKeyDown={changePNGCompressionKey}/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">JPG/WEBP Quality: </p>
                            <input className="settings-input" type="text" spellCheck="false" value={jpgQuality} onChange={changeJPGQuality} onKeyDown={changeJPGQualityKey}/>
                        </div>
                        <div className="settings-row">
                                <p className="settings-text">Concurrent Upscales: </p>
                                <input className="settings-input" type="text" spellCheck="false" value={queue} onChange={changeQueue} onKeyDown={changeQueueKey}/>
                            </div>
                        <div className="settings-row">
                            <p className="settings-text">Parallel Frames: </p>
                            <input className="settings-input" type="text" spellCheck="false" value={parallelFrames} onChange={changeParallelFrames} onKeyDown={changeParallelFramesKey}/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">Disable GPU? </p>
                            <img src={disableGPU ? checkboxChecked : checkbox} onClick={() => setDisableGPU((prev: boolean) => !prev)} className="settings-checkbox"/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">Force OpenCL? </p>
                            <img src={forceOpenCL ? checkboxChecked : checkbox} onClick={() => setForceOpenCL((prev: boolean) => !prev)} className="settings-checkbox"/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">Block Size: </p>
                            <input className="settings-input" type="text" spellCheck="false" value={blockSize} onChange={changeBlockSize} onKeyDown={changeBlockSizeKey}/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">Threads: </p>
                            <input className="settings-input" type="text" spellCheck="false" value={threads} onChange={changeThreads} onKeyDown={changeThreadsKey}/>
                        </div>
                        <div className="settings-button-container">
                         <button onClick={revert} className="revert-button">Revert</button>
                            <button onClick={ok} className="ok-button">Ok</button>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
    return null
}

export default AdvancedSettings
