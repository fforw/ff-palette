import { allPalettesWithBlack } from "../randomPalette"
import ColorButton from "./ColorButton"
import React, { useState } from "react"
import Modal from "react-modal"
import cx from "classnames"
import { toast } from "react-toastify"
import Color from "../Color"
import { displayError } from "../util"

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

function validate(json)
{
    let data = null
    try
    {
        data = JSON.parse(json)
    }
    catch(e)
    {
        return [null, "Error parsing JSON: " + e.message]
    }

    if (data && Array.isArray(data))
    {
        let valid = true
        for (let i = 0; i < data.length; i++)
        {
            const color = data[i]
            if (!Color.validate(color))
            {
                return [null, "Invalid color: " + color]
            }
        }

        if (valid)
        {
            return [data, null]
        }
    }

}

const ImportModal = ({isOpen, close, palette, setPalette}) => {

    const [json, setJson] = useState(JSON.stringify(palette, null, 4));

    return (
        <Modal isOpen={ isOpen } close={ close } style={ customStyles }>
            <h3>
                Import palette
                <a
                    className="close"
                    aria-label="Close Dialog"
                    href="#"
                    onClick={ ev => {
                        ev.preventDefault()
                        close()
                    }}>x</a>
            </h3>
            <textarea
                cols={ 40 }
                rows={ 20 }
                value={
                    json
                }
                onChange={
                    ev => {
                        const value = ev.target.value
                        setJson(value)
                    }
                }
            />
            <div>
                <button
                    type="button"
                    onClick={
                        () => {
                            const [p, error] = validate(json)
                            if (p)
                            {
                                setPalette(p)
                            }
                            else
                            {
                                displayError(error)
                            }
                        }
                    }
                >
                    Import
                </button>
            </div>

        </Modal>
    )
}

export default ImportModal
