import { allPalettesWithBlack } from "../randomPalette"
import ColorButton from "./ColorButton"
import React from "react"
import Modal from "react-modal"
import cx from "classnames"

const customStyles = {
    overlay: {
        backgroundColor       : 'rgba(0, 0, 0, 0.66)',
        zIndex    : '20',
    },
    content : {
        left                  : '50%',
        width                  : '400px',
        marginRight           : '-200px',
        backgroundColor       : '#000'
    }
};

const SelectPaletteModal = ({isOpen, close, choose}) => {

    return (
        <Modal isOpen={isOpen} close={close} style={customStyles}>
            <h3>
                Select Palette
                <a className="close" href="#" onClick={ close }>x</a>
            </h3>
            {
                (
                    allPalettesWithBlack.map(
                        (p, i) => {
                            return (
                                <div key={i}>
                        <span style={ {pointerEvents: "none"} }>
                            {
                                p.map((c, index) => (
                                    <ColorButton
                                        key={ i * 1000 + index }
                                        color={ p[index] }
                                        index={ index }
                                        disabled={ true }
                                    />
                                ))
                            }
                        </span>
                                    <button
                                        type="button"
                                        onClick={ () => {
                                            choose(p)
                                        } }
                                        title="Select palette"
                                    >
                                        Select
                                    </button>
                                </div>
                            )
                        }
                    )
                )

            }

        </Modal>
    )
}

export default SelectPaletteModal
