import {ipcRenderer, remote} from "electron"
import React, {useContext, useEffect, useState} from "react"
import logo from "../assets/logo.png"
import {PreviewContext} from "../renderer"
import functions from "../structures/functions"
import "../styles/preview.less"

const Preview: React.FunctionComponent = (props) => {
    const [src, setSrc] = useState("")
    const [type, setType] = useState("image")
    const {previewVisible, setPreviewVisible} = useContext(PreviewContext)

    useEffect(() => {
        const preview = (event: any, image: string, type: "image" | "gif" | "video") => {
            if (image) {
                functions.logoDrag(false)
                setSrc(image)
                setType(type)
                setPreviewVisible(true)
            }
        }
        window.addEventListener("click", close)
        ipcRenderer.on("preview", preview)
        return () => {
            ipcRenderer.removeListener("preview", preview)
            window.removeEventListener("click", close)
        }
    }, [])

    const close = () => {
        functions.logoDrag(true)
        setPreviewVisible(false)
    }

    if (previewVisible) {
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
