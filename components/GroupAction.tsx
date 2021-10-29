import {ipcRenderer} from "electron"
import React, {useContext, useState, useEffect} from "react"
import clearAllButtonHover from "../assets/clearAll-hover.png"
import clearAllButton from "../assets/clearAll.png"
import startAllButtonHover from "../assets/startAll-hover.png"
import startAllButton from "../assets/startAll.png"
import clearAllButtonDarkHover from "../assets/clearAll-hover-dark.png"
import clearAllButtonDark from "../assets/clearAll-dark.png"
import startAllButtonDarkHover from "../assets/startAll-hover-dark.png"
import startAllButtonDark from "../assets/startAll-dark.png"
import {ClearAllContext} from "../renderer"
import "../styles/groupaction.less"

const GroupAction: React.FunctionComponent = (props) => {
    const {clearAll, setClearAll} = useContext(ClearAllContext)
    const [startHover, setStartHover] = useState(false)
    const [clearHover, setClearHover] = useState(false)
    const [color, setColor] = useState("light")

    useEffect(() => {
        const updateColor = (event: any, color: string) => {
            setColor(color)
        }
        ipcRenderer.on("update-color", updateColor)
        return () => {
            ipcRenderer.removeListener("update-color", updateColor)
        }
    }, [])

    const start = () => {
        ipcRenderer.invoke("start-all")
        setStartHover(false)
    }

    const clear = () => {
        ipcRenderer.invoke("clear-all")
        setClearHover(false)
    }

    const getImage = (type: string) => {
        if (type === "start") {
            if (color === "light") {
                if (startHover) {
                    return startAllButtonHover
                } else {
                    return startAllButton
                }
            } else {
                if (startHover) {
                    return startAllButtonDarkHover
                } else {
                    return startAllButtonDark
                }
            }
        } else if (type === "clear") {
            if (color === "light") {
                if (clearHover) {
                    return clearAllButtonHover
                } else {
                    return clearAllButton
                }
            } else {
                if (clearHover) {
                    return clearAllButtonDarkHover
                } else {
                    return clearAllButtonDark
                }
            }
        }
    }

    if (clearAll) {
        return (
            <section className="group-action-container">
                    <img src={getImage("start")} onClick={start} className="group-action-button" width="319" height="61" onMouseEnter={() => setStartHover(true)} onMouseLeave={() => setStartHover(false)}/>
                    <img src={getImage("clear")} onClick={clear} className="group-action-button" width="319" height="61" onMouseEnter={() => setClearHover(true)} onMouseLeave={() => setClearHover(false)}/>
            </section>
        )
    }
    return null
}

export default GroupAction
