import {ipcRenderer} from "electron"
import React, {useContext, useEffect, useState} from "react"
import {Dropdown, DropdownButton} from "react-bootstrap"
import checkboxChecked from "../assets/checkbox-checked.png"
import checkbox from "../assets/checkbox.png"
import {ModeContext, NoiseContext, ReverseContext, ScaleContext, SpeedContext} from "../renderer"
import "../styles/globalsettings.less"

const DirectoryBar: React.FunctionComponent = (props) => {
    const {noise, setNoise} = useContext(NoiseContext)
    const {scale, setScale} = useContext(ScaleContext)
    const {speed, setSpeed} = useContext(SpeedContext)
    const {reverse, setReverse} = useContext(ReverseContext)
    const {mode, setMode} = useContext(ModeContext)

    useEffect(() => {
        ipcRenderer.invoke("store-settings", {noise, scale, speed, reverse, mode})
    })

    const handleNoise = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value
        if (value.length > 1) return
        if (Number.isNaN(Number(value))) return
        if (Number(value) > 3) value = "3"
        setNoise(value.replace(".", ""))
    }

    const handleNoiseKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowUp") {
            setNoise((prev: any) => {
                if (Number(prev) + 1 > 3) return Number(prev)
                return Number(prev) + 1
            })
        } else if (event.key === "ArrowDown") {
            setNoise((prev: any) => {
                if (Number(prev) - 1 < 0) return Number(prev)
                return Number(prev) - 1
            })
        }
    }

    const handleScale = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value.replace(".", "").length > 2) return
        if (Number.isNaN(Number(value))) return
        setScale(value)
    }

    const handleScaleKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowUp") {
            setScale((prev: any) => {
                if (Number(prev) + 1 > 99) return Number(prev)
                if (String(prev).includes(".")) return (Number(prev) + 1).toFixed(1)
                return Number(prev) + 1
            })
        } else if (event.key === "ArrowDown") {
            setScale((prev: any) => {
                if (Number(prev) - 1 < 0) return Number(prev)
                if (String(prev).includes(".")) return (Number(prev) - 1).toFixed(1)
                return Number(prev) - 1
            })
        }
    }

    const handleSpeed = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value.replace(".", "").length > 2) return
        if (Number.isNaN(Number(value))) return
        setSpeed(value)
    }

    const handleSpeedKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowUp") {
            setSpeed((prev: any) => {
                if (Number(prev) + 1 > 99) return Number(prev)
                if (String(prev).includes(".")) return (Number(prev) + 1).toFixed(1)
                return Number(prev) + 1
            })
        } else if (event.key === "ArrowDown") {
            setSpeed((prev: any) => {
                if (Number(prev) - 1 < 0) return Number(prev)
                if (String(prev).includes(".")) return (Number(prev) - 1).toFixed(1)
                return Number(prev) - 1
            })
        }
    }

    const handleReverse = () => {
        setReverse((prev: any) => !prev)
    }

    return (
        <section className="global-settings">
            <div className="global-settings-box">
                <p className="global-settings-text">Noise: </p>
                <input className="global-settings-input" type="text" min="0" max="3" value={noise} onChange={handleNoise} onKeyDown={handleNoiseKey}/>
            </div>
            <div className="global-settings-box">
                <p className="global-settings-text">Scale: </p>
                <input className="global-settings-input" type="text" value={scale} onChange={handleScale} onKeyDown={handleScaleKey}/>
            </div>
            <div className="global-settings-box">
                <p className="global-settings-text">Mode: </p>
                <DropdownButton title={mode} drop="up">
                    <Dropdown.Item active={mode === "noise"} onClick={() => setMode("noise")}>noise</Dropdown.Item>
                    <Dropdown.Item active={mode === "scale"} onClick={() => setMode("scale")}>scale</Dropdown.Item>
                    <Dropdown.Item active={mode === "noise-scale"} onClick={() => setMode("noise-scale")}>noise-scale</Dropdown.Item>
                </DropdownButton>
            </div>
            <div className="global-settings-box">
                <p className="global-settings-text">Speed: </p>
                <input className="global-settings-input" type="text" min="0.5" max="100" value={speed} onChange={handleSpeed} onKeyDown={handleSpeedKey}/>
            </div>
            <div className="global-settings-box">
                <p className="global-settings-text">Reverse: </p>
                <img className="global-settings-checkbox" width="20" height="20" src={reverse ? checkboxChecked : checkbox} onClick={handleReverse}/>
            </div>
        </section>
    )
}

export default DirectoryBar
