import { toast } from "react-toastify"


export function clamp(v)
{
    return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function rndFromArray(a)
{
    return a[0|Math.random() * a.length]
}

const TOAST_ERROR_OPTIONS = {type: "error", autoClose: 1500, align: "center"}

export function displayError(message)
{
    return toast(message, TOAST_ERROR_OPTIONS);
}
