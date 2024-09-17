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
import ImportControl from "./ImportControl"
import ActiveState from "./ActiveState"
import SelectPaletteModal from "./SelectPaletteModal"

const Config = ({palette, setPalette, strategy, setStrategy, strategies}) => {

    const activeRef = useRef(null)

    const [active, _setActive] = useState(ActiveState.NONE)

    const setActive = a => {
        activeRef.current = active
        _setActive(a)
    }

    const [selectDialogOpen, setSelectDialogOpen] = useState(false)

    return (
        <>
            <h3>
                Natural Color Mixing tool
                <small>Generate palette images based on <a href="https://github.com/rvanwijnen/spectral.js">spectral.js</a> natural color mixing.</small>
            </h3>


            <div>
                <button
                    type="button"
                    onClick={ () => {
                        setActive(active === ActiveState.IMPORT ? ActiveState.NONE : ActiveState.IMPORT)
                    } }
                >
                    Import
                </button>
                <button
                    type="button"
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
                >
                    Select
                </button>
                <hr className="divider"/>
                {
                    active === ActiveState.IMPORT && (
                               <ImportControl
                                   palette={ palette }
                                   setPalette={ setPalette }
                               />
                           )
                }
                {
                    active < 0 && (
                        <div className="cover">
                               <HexColorPicker
                                   color={ activeRef.current !== null ? palette[activeRef.current] : "#000" }
                               />
                        </div>
                    )
                }
                {
                    active >= 0 && (
                               <HexColorPicker
                                   color={ palette[active] }
                                   onChange={
                                       col => {
                                           const newPalette = palette.slice()
                                           newPalette[active] = col
                                           setPalette(newPalette)
                                       }
                                   }
                               />
                           )
                }
            </div>
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
            <ul className="box">
                {
                    strategies.map(s => {

                        const { name, desc } = s

                        return (
                            <li key={ name } className={ cx( s === strategy && "active" ) }>
                                <a href="#" onClick={ ev => setStrategy(s) }>
                                    <span className="name">{ name }</span> - <span className="desc">{ desc }</span>
                                </a>
                            </li>
                        )
                    })
                }
            </ul>
            <SelectPaletteModal
                isOpen={selectDialogOpen}
                close={ () => setSelectDialogOpen(false) }
                choose={
                    p => {
                        setPalette(p)
                        setSelectDialogOpen(false)
                    }
                }

            />
        </>
    )
}

export default Config
