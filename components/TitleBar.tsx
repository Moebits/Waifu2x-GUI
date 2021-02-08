import {ipcRenderer, remote} from "electron"
import React, {useEffect, useState} from "react"
import closeButtonHover from "../assets/closeButton-hover.png"
import closeButton from "../assets/closeButton.png"
import appIcon from "../assets/icon.png"
import maximizeButtonHover from "../assets/maximizeButton-hover.png"
import maximizeButton from "../assets/maximizeButton.png"
import minimizeButtonHover from "../assets/minimizeButton-hover.png"
import minimizeButton from "../assets/minimizeButton.png"
import settingsButtonHover from "../assets/settingsButton-hover.png"
import settingsButton from "../assets/settingsButton.png"
import starButtonHover from "../assets/starButton-hover.png"
import starButton from "../assets/starButton.png"
import updateButtonHover from "../assets/updateButton-hover.png"
import updateButton from "../assets/updateButton.png"
import pack from "../package.json"
import functions from "../structures/functions"
import "../styles/titlebar.less"

const TitleBar: React.FunctionComponent = (props) => {
    const [hover, setHover] = useState(false)
    const [hoverClose, setHoverClose] = useState(false)
    const [hoverMin, setHoverMin] = useState(false)
    const [hoverMax, setHoverMax] = useState(false)
    const [hoverReload, setHoverReload] = useState(false)
    const [hoverStar, setHoverStar] = useState(false)
    const [hoverSettings, setHoverSettings] = useState(false)

    useEffect(() => {
        ipcRenderer.invoke("check-for-updates", true)
    }, [])

    const minimize = () => {
        remote.getCurrentWindow().minimize()
    }

    const maximize = () => {
        const window = remote.getCurrentWindow()
        if (window.isMaximized()) {
            window.unmaximize()
        } else {
            window.maximize()
        }
    }
    const close = () => {
        remote.getCurrentWindow().close()
    }
    const star = () => {
        remote.shell.openExternal(pack.repository.url)
    }
    const update = () => {
        ipcRenderer.invoke("check-for-updates", false)
    }

    const settings = () => {
        ipcRenderer.invoke("advanced-settings", false)
    }

    return (
        <section className="title-bar">
                <div className="title-bar-drag-area">
                    <div className="title-container">
                        <img className="app-icon" height="22" width="22" src={appIcon}/>
                        <p><span className="title">Waifu2x GUI v{pack.version}</span></p>
                    </div>
                    <div className="title-bar-buttons">
                        <img src={hoverSettings ? settingsButtonHover : settingsButton} height="20" width="20" className="title-bar-button settings-button" onClick={settings} onMouseEnter={() => setHoverSettings(true)} onMouseLeave={() => setHoverSettings(false)}/>
                        <img src={hoverStar ? starButtonHover : starButton} height="20" width="20" className="title-bar-button star-button" onClick={star} onMouseEnter={() => setHoverStar(true)} onMouseLeave={() => setHoverStar(false)}/>
                        <img src={hoverReload ? updateButtonHover : updateButton} height="20" width="20" className="title-bar-button update-button" onClick={update} onMouseEnter={() => setHoverReload(true)} onMouseLeave={() => setHoverReload(false)}/>
                        <img src={hoverMin ? minimizeButtonHover : minimizeButton} height="20" width="20" className="title-bar-button" onClick={minimize} onMouseEnter={() => setHoverMin(true)} onMouseLeave={() => setHoverMin(false)}/>
                        <img src={hoverMax ? maximizeButtonHover : maximizeButton} height="20" width="20" className="title-bar-button" onClick={maximize} onMouseEnter={() => setHoverMax(true)} onMouseLeave={() => setHoverMax(false)}/>
                        <img src={hoverClose ? closeButtonHover : closeButton} height="20" width="20" className="title-bar-button" onClick={close} onMouseEnter={() => setHoverClose(true)} onMouseLeave={() => setHoverClose(false)}/>
                    </div>
                </div>
        </section>
    )
}

export default TitleBar
