import {ipcRenderer} from "electron"
import React, {useEffect, useState} from "react"
import logo from "../assets/logo.png"
import functions from "../structures/functions"
import "../styles/preview.less"

const Preview: React.FunctionComponent = (props) => {
    const [src, setSrc] = useState("")
    const [type, setType] = useState("image")
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const preview = (event: any, image: string, type: "image" | "gif" | "video") => {
            if (image) {
                functions.logoDrag(false)
                setSrc(image)
                setType(type)
                setVisible(true)
            }
        }
        ipcRenderer.on("preview", preview)
        return () => {
            ipcRenderer.removeListener("preview", preview)
        }
    }, [])

    const close = () => {
        functions.logoDrag(true)
        setVisible(false)
    }

    if (visible) {
        return (
            <section className="preview-container" onClick={close}>
                <div className="preview-box">
                    {type === "video" ?
                    <video className="preview-img" muted autoPlay loop controls>
                        <source src={src}></source>
                    </video> :
                    <img className="preview-img" src={src}/>}
                </div>
            </section>
        )
    }
    return null
}

export default Preview
