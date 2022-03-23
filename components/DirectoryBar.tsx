import {ipcRenderer} from "electron"
import {shell} from "@electron/remote"
import fs from "fs"
import React, {useContext, useEffect, useState} from "react"
import folderButtonHover from "../assets/folderButton-hover.png"
import folderButton from "../assets/folderButton.png"
import sourceButtonHover from "../assets/source-hover.png"
import sourceButton from "../assets/source.png"
import {DirectoryContext} from "../renderer"
import "../styles/directorybar.less"

const DirectoryBar: React.FunctionComponent = (props) => {
    const [defaultDir, setDefaultDir] = useState("")
    const [folderHover, setFolderHover] = useState(false)
    const [sourceHover, setSourceHover] = useState(false)
    const {directory, setDirectory} = useContext(DirectoryContext)
    const [source, setSource] = useState(false)

    useEffect(() => {
        ipcRenderer.invoke("get-downloads-folder").then((f) => {
            f = f.replace(/\\/g, "/")
            if (!f.endsWith("/")) f = `${f}/`
            setDefaultDir(f)
            setDirectory(f)
            setSource(false)
        })
    }, [])

    const changeDirectory = async () => {
        let dir = await ipcRenderer.invoke("select-directory")
        if (dir) {
            dir = dir.replace(/\\/g, "/")
            if (!dir.endsWith("/")) dir = `${dir}/`
            setDefaultDir(dir)
            setDirectory(dir)
            setSource(false)
        }
    }

    const updateDirectory = (event: React.ChangeEvent<HTMLInputElement>) => {
        const dir = event.target.value.replace(/\\/g, "/")
        if (!dir.includes(defaultDir)) {
            setDirectory(defaultDir)
            ipcRenderer.invoke("select-directory", defaultDir)
        } else {
            setDirectory(dir)
            ipcRenderer.invoke("select-directory", dir)
        }
    }

    const openDirectory = () => {
        if (source) return
        if (!fs.existsSync(directory)) fs.mkdirSync(directory, {recursive: true})
        shell.openPath(directory)
    }

    const sourceAction = () => {
        if (source) {
            ipcRenderer.invoke("get-downloads-folder", true).then((f) => {
                f = f.replace(/\\/g, "/")
                if (!f.endsWith("/")) f = `${f}/`
                setDefaultDir(f)
                setDirectory(f)
                setSource(false)
            })
        } else {
            setSource(true)
            setDefaultDir("{source}/")
            setDirectory("{source}/")
        }
    }

    return (
        <section className="directory-bar">
            <div className="directory-bar-center">
                <img className="directory-bar-img" width="25" height="25"  src={sourceHover ? sourceButtonHover : sourceButton} onMouseEnter={() => setSourceHover(true)} onMouseLeave={() => setSourceHover(false)} onClick={sourceAction}/>
                <img className="directory-bar-img" width="25" height="25" src={folderHover ? folderButtonHover : folderButton} onMouseEnter={() => setFolderHover(true)} onMouseLeave={() => setFolderHover(false)} onClick={changeDirectory}/>
                <input className="directory-bar-box" type="text" value={directory} onDoubleClick={openDirectory} onChange={updateDirectory}/>
            </div>
        </section>
    )
}

export default DirectoryBar
