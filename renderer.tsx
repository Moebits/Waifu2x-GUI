import "bootstrap/dist/css/bootstrap.min.css"
import {ipcRenderer} from "electron"
import React, {useEffect, useState} from "react"
import ReactDom from "react-dom"
import AdvancedSettings from "./components/AdvancedSettings"
import DirectoryBar from "./components/DirectoryBar"
import FileContainerList from "./components/FileContainerList"
import FileSelector from "./components/FileSelector"
import GlobalSettings from "./components/GlobalSettings"
import GroupAction from "./components/GroupAction"
import LogoBar from "./components/LogoBar"
import Preview from "./components/Preview"
import TitleBar from "./components/TitleBar"
import VersionDialog from "./components/VersionDialog"
import "./index.less"

export const DirectoryContext = React.createContext<any>(null)
export const NoiseContext = React.createContext<any>(null)
export const ScaleContext = React.createContext<any>(null)
export const ModeContext = React.createContext<any>(null)
export const FPSMultiplierContext = React.createContext<any>(null)
export const SpeedContext = React.createContext<any>(null)
export const ReverseContext = React.createContext<any>(null)
export const ClearAllContext = React.createContext<any>(null)

export const OriginalFramerateContext = React.createContext<any>(null)
export const FramerateContext = React.createContext<any>(null)
export const VideoQualityContext = React.createContext<any>(null)
export const GIFQualityContext = React.createContext<any>(null)
export const PNGCompressionContext = React.createContext<any>(null)
export const JPGQualityContext = React.createContext<any>(null)
export const ParallelFramesContext = React.createContext<any>(null)
export const ThreadsContext = React.createContext<any>(null)
export const RenameContext = React.createContext<any>(null)
export const GIFTransparencyContext = React.createContext<any>(null)
export const PitchContext = React.createContext<any>(null)
export const SDColorSpaceContext = React.createContext<any>(null)
export const PreviewContext = React.createContext<any>(null)
export const QueueContext = React.createContext<any>(null)
export const UpscalerContext = React.createContext<any>(null)
export const CompressContext = React.createContext<any>(null)
export const PNGFramesContext = React.createContext<any>(null)
export const PDFDownscaleContext = React.createContext<any>(null)
export const PythonDownscaleContext = React.createContext<any>(null)
export const AdvSettingsContext = React.createContext<any>(null)

const App = () => {
  const [directory, setDirectory] = useState("")
  const [noise, setNoise] = useState(2)
  const [scale, setScale] = useState(2)
  const [mode, setMode] = useState("noise-scale")
  const [fpsMultiplier, setFPSMultiplier] = useState(1)
  const [speed, setSpeed] = useState(1)
  const [reverse, setReverse] = useState(false)
  const [clearAll, setClearAll] = useState(false)

  const [originalFramerate, setOriginalFramerate] = useState(true)
  const [framerate, setFramerate] = useState(24)
  const [videoQuality, setVideoQuality] = useState(16)
  const [gifQuality, setGIFQuality] = useState(10)
  const [pngCompression, setPNGCompression] = useState(3)
  const [jpgQuality, setJPGQuality] = useState(95)
  const [parallelFrames, setParallelFrames] = useState(2)
  const [threads, setThreads] = useState(4)
  const [rename, setRename] = useState("2x")
  const [gifTransparency, setGIFTransparency] = useState(true)
  const [pitch, setPitch] = useState(true)
  const [sdColorSpace, setSDColorSpace] = useState(true)
  const [queue, setQueue] = useState(1)
  const [upscaler, setUpscaler] = useState("waifu2x")
  const [compress, setCompress] = useState(true)
  const [pngFrames, setPNGFrames] = useState(false)
  const [pdfDownscale, setPDFDownscale] = useState(0)
  const [pythonDownscale, setPythonDownscale] = useState(0)
  const [advSettings, setAdvSettings] = useState(false)

  const [previewVisible, setPreviewVisible] = useState(false)

  useEffect(() => {
    ipcRenderer.on("debug", console.log)
  }, [])

  return (
    <main className="app">
      <PythonDownscaleContext.Provider value={{pythonDownscale, setPythonDownscale}}>
      <PDFDownscaleContext.Provider value={{pdfDownscale, setPDFDownscale}}>
      <PNGFramesContext.Provider value={{pngFrames, setPNGFrames}}>
      <FPSMultiplierContext.Provider value={{fpsMultiplier, setFPSMultiplier}}>
      <AdvSettingsContext.Provider value={{advSettings, setAdvSettings}}>
      <CompressContext.Provider value={{compress, setCompress}}>
      <UpscalerContext.Provider value={{upscaler, setUpscaler}}>
      <SDColorSpaceContext.Provider value={{sdColorSpace, setSDColorSpace}}>
      <QueueContext.Provider value={{queue, setQueue}}>
      <PreviewContext.Provider value={{previewVisible, setPreviewVisible}}>
      <PitchContext.Provider value={{pitch, setPitch}}>
      <GIFTransparencyContext.Provider value={{gifTransparency, setGIFTransparency}}>
      <OriginalFramerateContext.Provider value={{originalFramerate, setOriginalFramerate}}>
      <RenameContext.Provider value={{rename, setRename}}>
      <ThreadsContext.Provider value={{threads, setThreads}}>
      <ParallelFramesContext.Provider value={{parallelFrames, setParallelFrames}}>
      <JPGQualityContext.Provider value={{jpgQuality, setJPGQuality}}>
      <PNGCompressionContext.Provider value={{pngCompression, setPNGCompression}}>
      <GIFQualityContext.Provider value={{gifQuality, setGIFQuality}}>
      <VideoQualityContext.Provider value={{videoQuality, setVideoQuality}}>
      <FramerateContext.Provider value ={{framerate, setFramerate}}>
      <ClearAllContext.Provider value={{clearAll, setClearAll}}>
      <DirectoryContext.Provider value={{directory, setDirectory}}>
      <NoiseContext.Provider value={{noise, setNoise}}>
      <ScaleContext.Provider value={{scale, setScale}}>
      <ModeContext.Provider value={{mode, setMode}}>
      <SpeedContext.Provider value={{speed, setSpeed}}>
      <ReverseContext.Provider value={{reverse, setReverse}}>
        <TitleBar/>
        <VersionDialog/>
        <AdvancedSettings/>
        <Preview/>
        <LogoBar/>
        <FileSelector/>
        <DirectoryBar/>
        <GlobalSettings/>
        <GroupAction/>
        <FileContainerList/>
      </ReverseContext.Provider>
      </SpeedContext.Provider>
      </ModeContext.Provider>
      </ScaleContext.Provider>
      </NoiseContext.Provider>
      </DirectoryContext.Provider>
      </ClearAllContext.Provider>
      </FramerateContext.Provider>
      </VideoQualityContext.Provider>
      </GIFQualityContext.Provider>
      </PNGCompressionContext.Provider>
      </JPGQualityContext.Provider>
      </ParallelFramesContext.Provider>
      </ThreadsContext.Provider>
      </RenameContext.Provider>
      </OriginalFramerateContext.Provider>
      </GIFTransparencyContext.Provider>
      </PitchContext.Provider>
      </PreviewContext.Provider>
      </QueueContext.Provider>
      </SDColorSpaceContext.Provider>
      </UpscalerContext.Provider>
      </CompressContext.Provider>
      </AdvSettingsContext.Provider>
      </FPSMultiplierContext.Provider>
      </PNGFramesContext.Provider>
      </PDFDownscaleContext.Provider>
      </PythonDownscaleContext.Provider>
    </main>
  )
}

ReactDom.render(<App/>, document.getElementById("root"))
