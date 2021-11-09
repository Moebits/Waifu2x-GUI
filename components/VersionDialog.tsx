import {ipcRenderer} from "electron"
import {app} from "@electron/remote"
import React, {useEffect, useState} from "react"
import "../styles/versiondialog.less"

const VersionDialog: React.FunctionComponent = (props) => {
    const [version, setVersion] = useState(app.getVersion())
    const [newVersion, setNewVersion] = useState(false)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const showVersionDialog = (event: any, update: any) => {
            setVisible((prev) => !prev)
            if (update) {
                setVersion(update)
                setNewVersion(true)
            }
        }
        const closeAllDialogs = (event: any, ignore: any) => {
            if (ignore !== "version") setVisible(false)
        }
        ipcRenderer.on("show-version-dialog", showVersionDialog)
        ipcRenderer.on("close-all-dialogs", closeAllDialogs)
        return () => {
            ipcRenderer.removeListener("show-version-dialog", showVersionDialog)
            ipcRenderer.removeListener("close-all-dialogs", closeAllDialogs)
        }
    }, [])

    const getText = () => {
        if (newVersion) {
            return `A new version (v${version}) is available! Would you like to download the update?`
        } else {
            return `No updates were found, you are currently on the latest version.`
        }
    }

    const click = (button: "accept" | "reject") => {
        if (newVersion && button === "accept") {
            ipcRenderer.invoke("install-update")
        }
        setVisible(false)
    }

    if (visible) {
        return (
            <section className="version-dialog">
                <div className="version-dialog-box">
                    <div className="version-container">
                        <p className="version-dialog-text">{getText()}</p>
                        <div className="version-button-container">
                            <button onClick={() => click("reject")} className="reject-button">{newVersion ? "No" : "Cancel"}</button>
                            <button onClick={() => click("accept")} className="accept-button">{newVersion ? "Yes" : "Ok"}</button>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
    return null
}

export default VersionDialog
