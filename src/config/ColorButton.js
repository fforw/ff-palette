import React from "react"
import cx from "classnames"
import ActiveState from "./ActiveState"


const ColorButton = ({color,index,active,setActive,disabled}) => {

    return (
        <button
            type="button"
            className="color"
            disabled={disabled}
            style={{
                background: color
            }}
            onClick={ ev => {
                if (active === index)
                {
                    setActive(ActiveState.NONE)
                }
                else
                {
                    setActive(index)
                }
            }}
        >
            <span className="inner">
                {
                    active === index ? "✅" : "\u00a0\u00a0"
                }
            </span>
        </button>
    )
}

export default ColorButton
