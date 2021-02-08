import "bootstrap/dist/css/bootstrap.min.css"
import React, {useEffect, useState} from "react"
import ReactDom from "react-dom"
import AdvancedSettings from "./components/AdvancedSettings"
import DirectoryBar from "./components/DirectoryBar"
import FileContainerList from "./components/FileContainerList"
import FileSelector from "./components/FileSelector"
import GlobalSettings from "./components/GlobalSettings"
import LogoBar from "./components/LogoBar"
import StartAll from "./components/StartAll"
import TitleBar from "./components/TitleBar"
import VersionDialog from "./components/VersionDialog"
import "./index.less"

export const DirectoryContext = React.createContext<any>(null)
export const NoiseContext = React.createContext<any>(null)
export const ScaleContext = React.createContext<any>(null)
export const ModeContext = React.createContext<any>(null)
export const SpeedContext = React.createContext<any>(null)
export const ReverseContext = React.createContext<any>(null)
export const StartAllContext = React.createContext<any>(null)

export const OriginalFramerateContext = React.createContext<any>(null)
export const FramerateContext = React.createContext<any>(null)
export const VideoQualityContext = React.createContext<any>(null)
export const GIFQualityContext = React.createContext<any>(null)
export const GIFCumulativeContext = React.createContext<any>(null)
export const PNGCompressionContext = React.createContext<any>(null)
export const JPGQualityContext = React.createContext<any>(null)
export const ParallelFramesContext = React.createContext<any>(null)
export const DisableGPUContext = React.createContext<any>(null)
export const ForceOpenCLContext = React.createContext<any>(null)
export const BlockSizeContext = React.createContext<any>(null)
export const ThreadsContext = React.createContext<any>(null)
export const RenameContext = React.createContext<any>(null)

const App = () => {
  const [directory, setDirectory] = useState("")
  const [noise, setNoise] = useState(2)
  const [scale, setScale] = useState(2)
  const [mode, setMode] = useState("noise-scale")
  const [speed, setSpeed] = useState(1)
  const [reverse, setReverse] = useState(false)
  const [startAll, setStartAll] = useState(false)

  const [originalFramerate, setOriginalFramerate] = useState(true)
  const [framerate, setFramerate] = useState(24)
  const [videoQuality, setVideoQuality] = useState(16)
  const [gifQuality, setGIFQuality] = useState(10)
  const [gifCumulative, setGIFCumulative] = useState(false)
  const [pngCompression, setPNGCompression] = useState(3)
  const [jpgQuality, setJPGQuality] = useState(100)
  const [parallelFrames, setParallelFrames] = useState(1)
  const [disableGPU, setDisableGPU] = useState(false)
  const [forceOpenCL, setForceOpenCL] = useState(false)
  const [blockSize, setBlockSize] = useState(512)
  const [threads, setThreads] = useState(4)
  const [rename, setRename] = useState("2x")

  return (
    <main className="app">
      <OriginalFramerateContext.Provider value={{originalFramerate, setOriginalFramerate}}>
      <RenameContext.Provider value={{rename, setRename}}>
      <ThreadsContext.Provider value={{threads, setThreads}}>
      <BlockSizeContext.Provider value={{blockSize, setBlockSize}}>
      <ForceOpenCLContext.Provider value={{forceOpenCL, setForceOpenCL}}>
      <DisableGPUContext.Provider value={{disableGPU, setDisableGPU}}>
      <ParallelFramesContext.Provider value={{parallelFrames, setParallelFrames}}>
      <JPGQualityContext.Provider value={{jpgQuality, setJPGQuality}}>
      <PNGCompressionContext.Provider value={{pngCompression, setPNGCompression}}>
      <GIFQualityContext.Provider value={{gifQuality, setGIFQuality}}>
      <GIFCumulativeContext.Provider value={{gifCumulative, setGIFCumulative}}>
      <VideoQualityContext.Provider value={{videoQuality, setVideoQuality}}>
      <FramerateContext.Provider value ={{framerate, setFramerate}}>
      <StartAllContext.Provider value={{startAll, setStartAll}}>
      <DirectoryContext.Provider value={{directory, setDirectory}}>
      <NoiseContext.Provider value={{noise, setNoise}}>
      <ScaleContext.Provider value={{scale, setScale}}>
      <ModeContext.Provider value={{mode, setMode}}>
      <SpeedContext.Provider value={{speed, setSpeed}}>
      <ReverseContext.Provider value={{reverse, setReverse}}>
        <TitleBar/>
        <VersionDialog/>
        <AdvancedSettings/>
        <LogoBar/>
        <FileSelector/>
        <DirectoryBar/>
        <GlobalSettings/>
        <StartAll/>
        <FileContainerList/>
      </ReverseContext.Provider>
      </SpeedContext.Provider>
      </ModeContext.Provider>
      </ScaleContext.Provider>
      </NoiseContext.Provider>
      </DirectoryContext.Provider>
      </StartAllContext.Provider>
      </FramerateContext.Provider>
      </VideoQualityContext.Provider>
      </GIFCumulativeContext.Provider>
      </GIFQualityContext.Provider>
      </PNGCompressionContext.Provider>
      </JPGQualityContext.Provider>
      </ParallelFramesContext.Provider>
      </DisableGPUContext.Provider>
      </ForceOpenCLContext.Provider>
      </BlockSizeContext.Provider>
      </ThreadsContext.Provider>
      </RenameContext.Provider>
      </OriginalFramerateContext.Provider>
    </main>
  )
}

ReactDom.render(<App/>, document.getElementById("root"))
