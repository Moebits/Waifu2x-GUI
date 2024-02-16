import {ipcRenderer} from "electron"
import React, {useContext, useEffect, useRef, useState} from "react"
import checkboxChecked from "../assets/checkbox2-checked.png"
import checkbox from "../assets/checkbox2.png"
import {Dropdown, DropdownButton} from "react-bootstrap"
import {FramerateContext, GIFQualityContext, SDColorSpaceContext, CompressContext, FPSMultiplierContext,
GIFTransparencyContext, JPGQualityContext, ModeContext, NoiseContext, OriginalFramerateContext, ParallelFramesContext, UpscalerContext,
PitchContext, PNGCompressionContext, RenameContext, ReverseContext, ScaleContext, SpeedContext, ThreadsContext, VideoQualityContext, QueueContext,
AdvSettingsContext, PNGFramesContext, PDFDownscaleContext, PythonDownscaleContext} from "../renderer"
import functions from "../structures/functions"
import path from "path"
import "../styles/advancedsettings.less"

const AdvancedSettings: React.FunctionComponent = (props) => {
    const {originalFramerate, setOriginalFramerate} = useContext(OriginalFramerateContext)
    const {framerate, setFramerate} = useContext(FramerateContext)
    const {videoQuality, setVideoQuality} = useContext(VideoQualityContext)
    const {gifQuality, setGIFQuality} = useContext(GIFQualityContext)
    const {pngCompression, setPNGCompression} = useContext(PNGCompressionContext)
    const {jpgQuality, setJPGQuality} = useContext(JPGQualityContext)
    const {parallelFrames, setParallelFrames} = useContext(ParallelFramesContext)
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
    const {upscaler, setUpscaler} = useContext(UpscalerContext)
    const {compress, setCompress} = useContext(CompressContext)
    const {advSettings, setAdvSettings} = useContext(AdvSettingsContext)
    const {fpsMultiplier, setFPSMultiplier} = useContext(FPSMultiplierContext)
    const {pngFrames, setPNGFrames} = useContext(PNGFramesContext)
    const {pdfDownscale, setPDFDownscale} = useContext(PDFDownscaleContext)
    const {pythonDownscale, setPythonDownscale} = useContext(PythonDownscaleContext)
    const [pythonModels, setPythonModels] = useState([])

    useEffect(() => {
        const showSettingsDialog = (event: any, update: any) => {
            setAdvSettings((prev: any) => !prev)
        }
        const closeAllDialogs = (event: any, ignore: any) => {
            if (ignore !== "settings") setAdvSettings(false)
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
            setThreads(settings.threads)
            setNoise(settings.noise)
            setScale(settings.scale)
            setSpeed(settings.speed)
            setReverse(settings.reverse)
            setMode(settings.mode)
            setFPSMultiplier(settings.fpsMultiplier)
            setPitch(settings.pitch)
            setQueue(settings.queue)
            setSDColorSpace(settings.sdColorSpace)
            setUpscaler(settings.upscaler)
            setCompress(settings.compress)
            setPNGFrames(settings.pngFrames)
            setPDFDownscale(settings.pdfDownscale)
            setPythonDownscale(settings.pythonDownscale)
        }
        const pythonModels = await ipcRenderer.invoke("get-python-models")
        if (pythonModels.length) setPythonModels(pythonModels)
    }

    useEffect(() => {
        ipcRenderer.invoke("store-settings", {framerate, pitch, rename, originalFramerate, videoQuality, gifQuality, gifTransparency, 
        pngCompression, jpgQuality, parallelFrames, threads, queue, sdColorSpace, upscaler, compress, pngFrames, pdfDownscale, pythonDownscale})
        functions.logoDrag(!advSettings)
    })

    const ok = () => {
        functions.logoDrag(true)
        setAdvSettings(false)
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
        setThreads(4)
        setNoise(2)
        setScale(2)
        setSpeed(1)
        setReverse(false)
        setMode("noise-scale")
        setFPSMultiplier(1)
        setPitch(true)
        setQueue(1)
        setSDColorSpace(true)
        setUpscaler("waifu2x")
        setCompress(true)
        setPNGFrames(false)
        setPDFDownscale(0)
        setPythonDownscale(0)
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

    const changePDFDownscale = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value.includes(".")) return
        if (Number.isNaN(Number(value))) return
        setPDFDownscale(value)
    }

    const changePDFDownscaleKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowUp") {
            setPDFDownscale((prev: any) => {
                return Number(prev) + 100
            })
        } else if (event.key === "ArrowDown") {
            setPDFDownscale((prev: any) => {
                if (Number(prev) - 100 < 0) return Number(prev)
                return Number(prev) - 100
            })
        }
    }

    const changePythonDownscale = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value.includes(".")) return
        if (Number.isNaN(Number(value))) return
        setPythonDownscale(value)
    }

    const changePythonDownscaleKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowUp") {
            setPythonDownscale((prev: any) => {
                return Number(prev) + 100
            })
        } else if (event.key === "ArrowDown") {
            setPythonDownscale((prev: any) => {
                if (Number(prev) - 100 < 0) return Number(prev)
                return Number(prev) - 100
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

    const getUpscaler = () => {
        if (upscaler === "waifu2x") return "waifu2x"
        if (upscaler === "real-esrgan") return "Real-ESRGAN"
        if (upscaler === "real-cugan") return "Real-CUGAN"
        if (upscaler === "anime4k") return "Anime4K"
        return path.basename(upscaler, path.extname(upscaler))
    }

    const pythonModelsJSX = () => {
        let jsx = [] as any
        for (let i = 0; i < pythonModels.length; i++) {
            jsx.push(<Dropdown.Item active={upscaler === pythonModels[i]} onClick={() => setUpscaler(pythonModels[i])}>{path.basename(pythonModels[i], path.extname(pythonModels[i]))}</Dropdown.Item>)
        }
        return jsx
    }

    if (advSettings) {
        return (
            <section className="settings-dialog">
                <div className="settings-dialog-box">
                    <div className="settings-container">
                        <div className="settings-title-container">
                            <p className="settings-title">Advanced Settings</p>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">Upscaler: </p>
                            <DropdownButton className="btn-filter" title={getUpscaler()} drop="down">
                                <Dropdown.Item active={upscaler === "waifu2x"} onClick={() => setUpscaler("waifu2x")}>waifu2x</Dropdown.Item>
                                <Dropdown.Item active={upscaler === "real-esrgan"} onClick={() => setUpscaler("real-esrgan")}>Real-ESRGAN</Dropdown.Item>
                                <Dropdown.Item active={upscaler === "real-cugan"} onClick={() => setUpscaler("real-cugan")}>Real-CUGAN</Dropdown.Item>
                                <Dropdown.Item active={upscaler === "anime4k"} onClick={() => setUpscaler("anime4k")}>Anime4K</Dropdown.Item>
                                {pythonModelsJSX()}
                            </DropdownButton>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">Rename: </p>
                            <input className="settings-input" type="text" spellCheck="false" value={rename} onChange={changeRename}/>
                        </div>
                        {/* <div className="settings-row">
                            <p className="settings-text">Framerate: </p>
                            <input className="settings-input" type="text" spellCheck="false" value={framerate} onChange={changeFramerate} onKeyDown={changeFramerateKey}/>
                            <p className="settings-text">Original?</p>
                            <img src={originalFramerate ? checkboxChecked : checkbox} onClick={() => setOriginalFramerate((prev: boolean) => !prev)} className="settings-checkbox"/>
                        </div> */}
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
                            <p className="settings-text">Compress to JPG? </p>
                            <img src={compress ? checkboxChecked : checkbox} onClick={() => setCompress((prev: boolean) => !prev)} className="settings-checkbox"/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">PNG Frames? </p>
                            <img src={pngFrames ? checkboxChecked : checkbox} onClick={() => setPNGFrames((prev: boolean) => !prev)} className="settings-checkbox"/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">PDF Downscale: </p>
                            <input className="settings-input" type="text" spellCheck="false" value={pdfDownscale} onChange={changePDFDownscale} onKeyDown={changePDFDownscaleKey}/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">Python Downscale: </p>
                            <input className="settings-input" type="text" spellCheck="false" value={pythonDownscale} onChange={changePythonDownscale} onKeyDown={changePythonDownscaleKey}/>
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
