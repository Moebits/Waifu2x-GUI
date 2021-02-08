import {ipcRenderer} from "electron"
import React, {useContext, useState} from "react"
import startAllButtonHover from "../assets/startAll-hover.png"
import startAllButton from "../assets/startAll.png"
import {StartAllContext} from "../renderer"
import "../styles/startall.less"

const StartAll: React.FunctionComponent = (props) => {
    const {startAll, setStartAll} = useContext(StartAllContext)
    const [hover, setHover] = useState(false)

    const click = () => {
        ipcRenderer.invoke("start-all")
        setHover(false)
    }
    if (startAll) {
        return (
            <section className="start-all-container">
                    <img src={hover ? startAllButtonHover : startAllButton} onClick={click} className="start-all" width="319" height="61" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}/>
            </section>
        )
    }
    return null
}

export default StartAll
