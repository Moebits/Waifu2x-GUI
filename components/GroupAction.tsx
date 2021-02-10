import {ipcRenderer} from "electron"
import React, {useContext, useState} from "react"
import clearAllButtonHover from "../assets/clearAll-hover.png"
import clearAllButton from "../assets/clearAll.png"
import startAllButtonHover from "../assets/startAll-hover.png"
import startAllButton from "../assets/startAll.png"
import {ClearAllContext, StartAllContext} from "../renderer"
import "../styles/groupaction.less"

const GroupAction: React.FunctionComponent = (props) => {
    const {startAll, setStartAll} = useContext(StartAllContext)
    const {clearAll, setClearAll} = useContext(ClearAllContext)
    const [startHover, setStartHover] = useState(false)
    const [clearHover, setClearHover] = useState(false)

    const start = () => {
        ipcRenderer.invoke("start-all")
        setStartHover(false)
    }

    const clear = () => {
        ipcRenderer.invoke("clear-all")
        setClearHover(false)
    }

    if (clearAll) {
        return (
            <section className="group-action-container">
                    {startAll ? <img src={startHover ? startAllButtonHover : startAllButton} onClick={start} className="group-action-button" width="319" height="61" onMouseEnter={() => setStartHover(true)} onMouseLeave={() => setStartHover(false)}/> : null}
                    <img src={clearHover ? clearAllButtonHover : clearAllButton} onClick={clear} className="group-action-button" width="319" height="61" onMouseEnter={() => setClearHover(true)} onMouseLeave={() => setClearHover(false)}/>
            </section>
        )
    }
    return null
}

export default GroupAction
