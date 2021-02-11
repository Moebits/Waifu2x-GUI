import {ipcRenderer, remote} from "electron"
import fs from "fs"
import React, {useContext, useEffect, useState} from "react"
import folderButtonHover from "../assets/folderButton-hover.png"
import folderButton from "../assets/folderButton.png"
import {DirectoryContext} from "../renderer"
import "../styles/directorybar.less"

const DirectoryBar: React.FunctionComponent = (props) => {
    const [defaultDir, setDefaultDir] = useState("")
    const [folderHover, setFolderHover] = useState(false)
    const {directory, setDirectory} = useContext(DirectoryContext)

    useEffect(() => {
        ipcRenderer.invoke("get-downloads-folder").then((f) => {
            f = f.replace(/\\/g, "/")
            setDefaultDir(f)
            setDirectory(f)
        })
    }, [])

    const changeDirectory = async () => {
        let dir = await ipcRenderer.invoke("select-directory")
        if (dir) {
            dir = dir.replace(/\\/g, "/")
            setDefaultDir(dir)
            setDirectory(dir)
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
        if (!fs.existsSync(directory)) fs.mkdirSync(directory, {recursive: true})
        remote.shell.openPath(directory)
    }

    return (
        <section className="directory-bar">
            <div className="directory-bar-center">
                <img className="directory-bar-img" width="25" height="25" src={folderHover ? folderButtonHover : folderButton} onMouseEnter={() => setFolderHover(true)} onMouseLeave={() => setFolderHover(false)} onClick={changeDirectory}/>
                <input className="directory-bar-box" type="text" value={directory} onDoubleClick={openDirectory} onChange={updateDirectory}/>
            </div>
        </section>
    )
}

export default DirectoryBar
