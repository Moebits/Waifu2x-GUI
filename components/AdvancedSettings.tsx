import {ipcRenderer} from "electron"
import React, {useContext, useEffect, useRef, useState} from "react"
import checkboxChecked from "../assets/checkbox2-checked.png"
import checkbox from "../assets/checkbox2.png"
import {BlockSizeContext, DisableGPUContext, ForceOpenCLContext, FramerateContext, GIFCumulativeContext, GIFQualityContext,
JPGQualityContext, ModeContext, NoiseContext, OriginalFramerateContext, ParallelFramesContext, PNGCompressionContext,
RenameContext, ReverseContext, ScaleContext, SpeedContext, ThreadsContext, VideoQualityContext} from "../renderer"
import functions from "../structures/functions"
import "../styles/advancedsettings.less"

const AdvancedSettings: React.FunctionComponent = (props) => {
    const {originalFramerate, setOriginalFramerate} = useContext(OriginalFramerateContext)
    const {framerate, setFramerate} = useContext(FramerateContext)
    const {videoQuality, setVideoQuality} = useContext(VideoQualityContext)
    const {gifQuality, setGIFQuality} = useContext(GIFQualityContext)
    const {gifCumulative, setGIFCumulative} = useContext(GIFCumulativeContext)
    const {pngCompression, setPNGCompression} = useContext(PNGCompressionContext)
    const {jpgQuality, setJPGQuality} = useContext(JPGQualityContext)
    const {parallelFrames, setParallelFrames} = useContext(ParallelFramesContext)
    const {disableGPU, setDisableGPU} = useContext(DisableGPUContext)
    const {forceOpenCL, setForceOpenCL} = useContext(ForceOpenCLContext)
    const {blockSize, setBlockSize} = useContext(BlockSizeContext)
    const {threads, setThreads} = useContext(ThreadsContext)
    const {rename, setRename} = useContext(RenameContext)
    const {noise, setNoise} = useContext(NoiseContext)
    const {scale, setScale} = useContext(ScaleContext)
    const {speed, setSpeed} = useContext(SpeedContext)
    const {reverse, setReverse} = useContext(ReverseContext)
    const {mode, setMode} = useContext(ModeContext)
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
            setGIFCumulative(settings.gifCumulative)
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
        }
    }

    useEffect(() => {
        ipcRenderer.invoke("store-settings", {framerate, rename, originalFramerate, videoQuality, gifQuality, gifCumulative, pngCompression, jpgQuality, parallelFrames, disableGPU, forceOpenCL, blockSize, threads})
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
        setGIFCumulative(true)
        setGIFQuality(10)
        setPNGCompression(3)
        setJPGQuality(100)
        setParallelFrames(1)
        setDisableGPU(false)
        setForceOpenCL(false)
        setBlockSize(1024)
        setThreads(4)
        setNoise(2)
        setScale(2)
        setSpeed(1)
        setReverse(false)
        setMode("noise-scale")
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

    const changeVideoQuality = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value
        if (value.includes(".")) return
        if (Number.isNaN(Number(value))) return
        if (Number(value) > 51) value = "51"
        setVideoQuality(value)
    }

    const changeGIFQuality = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value.includes(".")) return
        if (value.length > 3) return
        if (Number.isNaN(Number(value))) return
        setGIFQuality(value)
    }

    const changePNGCompression = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value
        if (value.includes(".")) return
        if (Number.isNaN(Number(value))) return
        if (Number(value) > 9) value = "9"
        setPNGCompression(value)
    }

    const changeJPGQuality = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value
        if (value.includes(".")) return
        if (Number.isNaN(Number(value))) return
        if (Number(value) > 101) value = "101"
        setJPGQuality(value)
    }

    const changeParallelFrames = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value.includes(".")) return
        if (value.length > 3) return
        if (Number.isNaN(Number(value))) return
        setParallelFrames(value)
    }

    const changeBlockSize = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value.includes(".")) return
        if (value.length > 5) return
        if (Number.isNaN(Number(value))) return
        setBlockSize(value)
    }

    const changeThreads = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value.includes(".")) return
        if (value.length > 2) return
        if (Number.isNaN(Number(value))) return
        setThreads(value)
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
                            <input className="settings-input" type="text" spellCheck="false" value={framerate} onChange={changeFramerate}/>
                            <p className="settings-text">Original?</p>
                            <img src={originalFramerate ? checkboxChecked : checkbox} onClick={() => setOriginalFramerate((prev: boolean) => !prev)} className="settings-checkbox"/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">Video Quality: </p>
                            <input className="settings-input" type="text" spellCheck="false" value={videoQuality} onChange={changeVideoQuality}/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">GIF Cumulative? </p>
                            <img src={gifCumulative ? checkboxChecked : checkbox} onClick={() => setGIFCumulative((prev: boolean) => !prev)} className="settings-checkbox"/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">GIF Quality: </p>
                            <input className="settings-input" type="text" spellCheck="false" value={gifQuality} onChange={changeGIFQuality}/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">PNG Compression: </p>
                            <input className="settings-input" type="text" spellCheck="false" value={pngCompression} onChange={changePNGCompression}/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">JPG/WEBP Quality: </p>
                            <input className="settings-input" type="text" spellCheck="false" value={jpgQuality} onChange={changeJPGQuality}/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">Parallel Frames: </p>
                            <input className="settings-input" type="text" spellCheck="false" value={parallelFrames} onChange={changeParallelFrames}/>
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
                            <input className="settings-input" type="text" spellCheck="false" value={blockSize} onChange={changeBlockSize}/>
                        </div>
                        <div className="settings-row">
                            <p className="settings-text">Threads: </p>
                            <input className="settings-input" type="text" spellCheck="false" value={threads} onChange={changeThreads}/>
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
