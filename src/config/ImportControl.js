import React, { useRef, useState } from "react"
import cx from "classnames"
import Color from "../Color"
import { toast } from 'react-toastify';

const TOAST_ERROR_OPTIONS = {type: "error", autoClose: 1500, align: "center"}

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

                            let data = null
                            try
                            {
                                data = JSON.parse(value)
                            }
                            catch(e)
                            {
                                toast("Error parsing JSON: " + e, TOAST_ERROR_OPTIONS)
                            }

                            if (data && Array.isArray(data))
                            {
                                let valid = true
                                for (let i = 0; i < data.length; i++)
                                {
                                    const color = data[i]
                                    if (!Color.validate(color))
                                    {
                                        toast("Invalid color " + color, TOAST_ERROR_OPTIONS)
                                        valid = false
                                    }
                                }

                                if (valid)
                                {
                                    setPalette(data)
                                }
                            }
                        },
                        400
                    )

                } }
            />

        </div>
    )
}

export default ImportControl
