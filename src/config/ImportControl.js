import React, { useRef, useState } from "react"
import cx from "classnames"
import Color from "../Color"
import { toast } from 'react-toastify';


const ImportControl = ({palette, setPalette}) => {

    const timerRef = useRef(0)

    const [json, setJson] = useState(JSON.stringify(palette, null, 4))

    return (
        <div>
            <textarea
                cols={ 40 }
                rows={ 20 }
                value={
                    json
                }
                onChange={ ev => {
                    const value = ev.target.value
                    setJson(value)

                    if (timerRef.current)
                    {
                        clearTimeout(timerRef.current)
                    }

                    timerRef.current = setTimeout(
                        () => {

                        },
                        400
                    )

                } }
            />

        </div>
    )
}

export default ImportControl
