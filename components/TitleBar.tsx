import {ipcRenderer} from "electron"
import {getCurrentWindow, shell} from "@electron/remote"
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
import lightButton from "../assets/light.png"
import lightButtonHover from "../assets/light-hover.png"
import darkButton from "../assets/dark.png"
import darkButtonHover from "../assets/dark-hover.png"
import "../styles/titlebar.less"

const TitleBar: React.FunctionComponent = (props) => {
    const [hover, setHover] = useState(false)
    const [hoverClose, setHoverClose] = useState(false)
    const [hoverMin, setHoverMin] = useState(false)
    const [hoverMax, setHoverMax] = useState(false)
    const [hoverReload, setHoverReload] = useState(false)
    const [hoverStar, setHoverStar] = useState(false)
    const [hoverTheme, setHoverTheme] = useState(false)
    const [theme, setTheme] = useState("light")
    const [hoverSettings, setHoverSettings] = useState(false)

    useEffect(() => {
        ipcRenderer.invoke("check-for-updates", true)
        const initTheme = async () => {
            const saved = await ipcRenderer.invoke("get-theme")
            changeTheme(saved)
        }
        initTheme()
    }, [])

    const minimize = () => {
        getCurrentWindow().minimize()
    }

    const maximize = () => {
        const window = getCurrentWindow()
        if (window.isMaximized()) {
            window.unmaximize()
        } else {
            window.maximize()
        }
    }
    const close = () => {
        getCurrentWindow().close()
    }
    const star = () => {
        shell.openExternal(pack.repository.url)
    }
    const update = () => {
        ipcRenderer.invoke("check-for-updates", false)
    }

    const settings = () => {
        ipcRenderer.invoke("advanced-settings", false)
    }

    const changeTheme = (value?: string) => {
        let condition = value !== undefined ? value === "dark" : theme === "light"
        if (condition) {
            document.documentElement.style.setProperty("--bg-color", "#090409")
            document.documentElement.style.setProperty("--title-color", "#090409")
            document.documentElement.style.setProperty("--text-color", "#4d84d9")
            document.documentElement.style.setProperty("--dir-color", "#090409")
            document.documentElement.style.setProperty("--dir-text", "#4985b4")
            document.documentElement.style.setProperty("--settings-color", "#090409")
            document.documentElement.style.setProperty("--settings-text", "#673efa")
            document.documentElement.style.setProperty("--settings-revert", "#090409")
            document.documentElement.style.setProperty("--settings-revert-text", "#563bf0")
            document.documentElement.style.setProperty("--settings-ok", "#090409")
            document.documentElement.style.setProperty("--settings-ok-text", "#355aff")
            document.documentElement.style.setProperty("--version-color", "#090409")
            document.documentElement.style.setProperty("--version-text", "#3a5eff")
            document.documentElement.style.setProperty("--version-accept", "#090409")
            document.documentElement.style.setProperty("--version-accept-text", "#5142ff")
            document.documentElement.style.setProperty("--version-reject", "#090409")
            document.documentElement.style.setProperty("--version-reject-text", "#463bbe")
            setTheme("dark")
            ipcRenderer.invoke("save-theme", "dark")
            ipcRenderer.invoke("update-color", "dark")
        } else {
            document.documentElement.style.setProperty("--bg-color", "#5ea8da")
            document.documentElement.style.setProperty("--title-color", "#4d84d9")
            document.documentElement.style.setProperty("--text-color", "black")
            document.documentElement.style.setProperty("--dir-color", "#4985b4")
            document.documentElement.style.setProperty("--dir-text", "black")
            document.documentElement.style.setProperty("--settings-color", "#3e4cfa")
            document.documentElement.style.setProperty("--settings-text", "black")
            document.documentElement.style.setProperty("--settings-revert", "#563bf0")
            document.documentElement.style.setProperty("--settings-revert-text", "black")
            document.documentElement.style.setProperty("--settings-ok", "#355aff")
            document.documentElement.style.setProperty("--settings-ok-text", "black")
            document.documentElement.style.setProperty("--version-color", "#3a5eff")
            document.documentElement.style.setProperty("--version-text", "black")
            document.documentElement.style.setProperty("--version-accept", "#5142ff")
            document.documentElement.style.setProperty("--version-accept-text", "black")
            document.documentElement.style.setProperty("--version-reject", "#463bbe")
            document.documentElement.style.setProperty("--version-reject-text", "black")
            setTheme("light")
            ipcRenderer.invoke("save-theme", "light")
            ipcRenderer.invoke("update-color", "light")
        }
    }

    return (
        <section className="title-bar">
                <div className="title-bar-drag-area">
                    <div className="title-container">
                        <img className="app-icon" height="22" width="22" src={appIcon}/>
                        <p><span className="title">Waifu2x GUI v{pack.version}</span></p>
                    </div>
                    <div className="title-bar-buttons">
                    <img src={hoverTheme ? (theme === "light" ? darkButtonHover : lightButtonHover) : (theme === "light" ? darkButton : lightButton)} height="20" width="20" className="title-bar-button theme-button" onClick={() => changeTheme()} onMouseEnter={() => setHoverTheme(true)} onMouseLeave={() => setHoverTheme(false)}/>
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
