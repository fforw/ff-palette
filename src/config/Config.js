import React, { useRef, useState } from "react"
import Modal from "react-modal"
import cx from "classnames"
import { allPalettesWithBlack } from "../randomPalette"
import { rndFromArray } from "../util"
import ColorButton from "./ColorButton"
import clipboard from 'clipboardy'
import { HexColorPicker } from "react-colorful"

const random = rndFromArray(allPalettesWithBlack)

import { ToastContainer, toast } from 'react-toastify';
import ActiveState from "./ActiveState"
import SelectPaletteModal from "./SelectPaletteModal"
import ImportModal from "./ImportModal"

const Config = ({palette, setPalette, strategy, setStrategy, strategies, debug, setDebug}) => {

    /* we buffer the last active color value to make "disabling" the control less jarring */
    const activeRef = useRef(null)
    const [active, _setActive] = useState(ActiveState.NONE)

    const setActive = a => {
        activeRef.current = active
        _setActive(a)
    }

    const [panelActive, setPanelActive] = useState(true)

    const [selectDialogOpen, setSelectDialogOpen] = useState(false)
    const [importDialogOpen, setImportDialogOpen] = useState(false)

    let deactivatedColor = activeRef.current !== null ? palette[activeRef.current] : "#000"
    return (
        <div className={cx("ui-panel", panelActive && "open")}>
            {/* Sidebar toggle */}
            <a
                className="ui-control"
                href="#"
                title="Toggle sidebar"
                onClick={ ev => {
                    ev.preventDefault()
                    setPanelActive(!panelActive)
                }}>
                { panelActive ? "<" : ">" }
            </a>
            <h3>
                Natural Color Mixing tool
                <small>Generate palette images based on <a href="https://github.com/rvanwijnen/spectral.js">spectral.js</a> natural color mixing.</small>
            </h3>

            {/* Toolbar */}
            <div>
                <button
                    type="button"
                    title="JSON import/export"
                    onClick={ () => {
                        setImportDialogOpen(true)
                    } }
                >
                    Import
                </button>
                <button
                    type="button"
                    title="Copy palette JSON to clipboard"
                    onClick={ () => {
                        clipboard.write(
                            JSON.stringify(palette, null, 4)
                        ).then(
                            () => toast(
                                "Copied to clipboard",
                                {
                                    type: "info",
                                    theme: "dark",
                                    autoClose: 1000,
                                    align: "center"
                                }
                            )
                        )
                    } }
                >
                    📋 Copy palette
                </button>
                &nbsp;
                <button
                    type="button"
                    onClick={ () => setSelectDialogOpen(true) }
                    title="Select palette from a set of predefined palettes"
                >
                    Select
                </button>
                <hr className="divider"/>

                {/* Active color picker */}
                <div className={ cx(active < 0 && "cover") }>
                       <HexColorPicker
                           color={ active < 0 ? deactivatedColor : palette[active] }
                           onChange={
                               active >= 0 ?
                                   col => {
                                       const newPalette = palette.slice()
                                       newPalette[active] = col
                                       setPalette(newPalette)
                                   } : null
                           }
                       />
                </div>
            </div>

            {/* Current palette buttons  */}
            <p>
            {
                    palette.map((c, index) => (
                        <ColorButton
                            key={ index }
                            color={ palette[index] }
                            index={ index }
                            active={ active }
                            setActive={ setActive }
                        />
                    ))
                }
            </p>

            {/* Strategy selection list */}
            <ul className="box">
                {
                    strategies.map(s => {

                        const { name, desc } = s

                        return (
                            <li key={ name } className={ cx( s === strategy && "active" ) }>
                                <a
                                    href="#"
                                    onClick={ ev => {
                                        ev.preventDefault()
                                        setStrategy(s)
                                } }>
                                    <span className="name">{ name }</span> - <span className="desc">{ desc }</span>
                                </a>
                            </li>
                        )
                    })
                }
            </ul>
            {/* Strategy option(s) */}
            <div>
                <label>
                    <input type="checkbox" name="debug" checked={ debug } onChange={ () => setDebug(!debug) }/>
                    Debug
                </label>
            </div>

            {/* MODALS */}

            <SelectPaletteModal
                isOpen={ selectDialogOpen }
                close={ () => setSelectDialogOpen(false) }
                choose={
                    p => {
                        setPalette(p)
                        setSelectDialogOpen(false)
                    }
                }

            />

            <ImportModal
                isOpen={ importDialogOpen }
                close={ () => setImportDialogOpen(false) }
                palette={ palette }
                setPalette={
                    p => {
                        setPalette(p)
                        setImportDialogOpen(false)
                    }
                }
            />

        </div>
    )
}

export default Config
