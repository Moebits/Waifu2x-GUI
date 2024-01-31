import React, {useEffect, useState, useContext} from "react"
import {AdvSettingsContext} from "../renderer"
import logo from "../assets/logo.png"
import functions from "../structures/functions"
import "../styles/logobar.less"

const LogoBar: React.FunctionComponent = (props) => {
    const {advSettings, setAdvSettings} = useContext(AdvSettingsContext)

    return (
        <section className="logo-bar">
            <div className="logo-bar-container">
                <img src={logo} className="logo" width="418" height="118"/>
                {!advSettings ? <div className="logo-bar-drag"></div> : null}
            </div>
        </section>
    )
}

export default LogoBar
