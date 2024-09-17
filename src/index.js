import domready from "domready"
import Modal from "react-modal"
import "./style.css"
import { allPalettesWithBlack } from "./randomPalette"
import spectral from "spectral.js"
import { voronoi } from "d3-voronoi"
import { polygonCentroid } from "d3-polygon"
import React from 'react';
import { createRoot } from 'react-dom/client';
import Config from "./config/Config"
import { rndFromArray } from "./util"
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RenderingStrategy from "./Strategy"


const PHI = (1 + Math.sqrt(5)) / 2;
const TAU = Math.PI * 2;
const DEG2RAD_FACTOR = TAU / 360;
const SPREAD_SIZE = 24

const config = {
    width: 0,
    height: 0
};

/**
 * @type CanvasRenderingContext2D
 */
let ctx;
let canvas;


function relax(v, pts, count = 5)
{
    for (let i = 0; i < count; i++)
    {
        pts = v(pts).polygons().map(poly => {
            const c = polygonCentroid(poly)
            c[0] |= 0
            c[1] |= 0
            return c
        })
    }
    return pts
}

function drawPolygon(ctx, polygon)
{
    const last = polygon.length - 1
    const [x, y] = polygon[last]

    ctx.beginPath()
    ctx.moveTo(
        Math.round(x),
        Math.round(y)
    )

    for (let i = 0; i < polygon.length; i++)
    {
        const [x, y] = polygon[i]
        ctx.lineTo(
            Math.round(x),
            Math.round(y)
        )
    }
    ctx.fill()
    ctx.stroke()
}

const overdraw = 1.15

let counter = 0
let palette

let pts = []
let colors = []

const paint = (palette) => {

    const { width, height } = config

    const cx = width >> 1
    const cy = height >> 1
    const aspect = width / height

    const radius = Math.min(cx,cy) // >> 1

    const plot = (color, x0, y0) => {
        // ctx.fillStyle = color
        // ctx.fillRect(x0 - 3, y0 - 3, 6, 6)
        // ctx.fillStyle = "#fff"
        // ctx.fillText(String(counter++), x0 + 4, y0  + 4)

        colors.push(color)
        pts.push([x0|0,y0|0])
    }

    const drawAxis = (halfAxes, index, cx, cy) => {
        const hLen = halfAxes.length
        const hhl = hLen >> 1

        const next = (index + 1) % hLen
        const halfAxis = halfAxes[index]
        const nextAxis = halfAxes[next]

        const angleStep = TAU/hLen

        const rStep = radius * 2 / (SPREAD_SIZE - 1)
        for (let j = 0; j < halfAxis.length; j++)
        {
            const color = halfAxis[j]

            const angle = TAU/4 + index * angleStep
            const r = (rStep >> 1) + j * rStep
            const rx = r// * aspect
            let x0 = cx + Math.cos(angle) * rx
            let y0 = cy + Math.sin(angle) * r
            let x1 = cx + Math.cos(angle + angleStep) * rx
            let y1 = cy + Math.sin(angle + angleStep) * r
            plot(color, x0, y0)

            if (j > 0)
            {
                const other = nextAxis[j]
                const subLen = 2 + j
                const sub = spectral.palette(color, other, subLen, spectral.HEX)

                let dt = 1 / (subLen - 1)
                let t = dt
                for (let k = 1; k < subLen - 1; k++)
                {
                    const x2 = x0 + (x1 - x0) * t
                    const y2 = y0 + (y1 - y0) * t

                    plot(sub[k], x2, y2)
                    t += dt
                }
            }
        }
    }

    pts = []
    colors = []

    ctx.fillStyle = "#16161d"
    ctx.fillRect(0, 0, width, height)

    ctx.save()

    //console.log("PALETTE", palette.length)

    const pLen = palette.length
    const angleStep = TAU / pLen

    const halfPaletteLen = pLen >> 1
    const halfCount = SPREAD_SIZE >> 1

    const halfAxes = new Array(halfPaletteLen)

    for (let i = 0; i < halfPaletteLen; i++)
    {
        const angle = i * angleStep
        let ox = Math.cos(angle) * radius
        let oy = Math.sin(angle) * radius
        const color = palette[i]
        const other = palette[(i + halfPaletteLen) % pLen]
        console.log({color, other})

        const spread = spectral.palette(color, other, SPREAD_SIZE, spectral.HEX)
        halfAxes[i] = spread.slice(0, halfCount).reverse()
        halfAxes[i + halfPaletteLen] = spread.slice(halfCount)
    }

    for (let i = 0; i < halfAxes.length; i++)
    {
        drawAxis(halfAxes, i, cx, cy)
    }

    const borderX = (overdraw - 1) * width / 2
    const borderY = (overdraw - 1) * height / 2
    const v = voronoi().extent([[-borderX,-borderY], [width + borderX, height + borderY]])

    //pts = relax(v, pts, 0)

    ctx.fillStyle = "#000";
    ctx.fillRect(0,0, width, height);

    const diagram = v(pts);

    // ctx.beginPath()
    // ctx.moveTo(cx + radius, cy)
    // ctx.arc(cx, cy,radius,0,TAU,true)
    // ctx.clip()

    let hue = 0
    diagram.polygons().forEach(
        (p, idx) => {

            ctx.fillStyle = colors[idx]
            ctx.strokeStyle = colors[idx]
            ctx.lineWidth = 2
            drawPolygon(ctx, p)
        })

    // for (let i = 0; i < pts.length; i++)
    // {
    //     const [x, y] = pts[i]
    //     const c = colors[i]
    //
    //     ctx.fillStyle = getLuminance(Color.from(c)) < 131237 ? "#fff" : "#000"
    //     ctx.fillText(String(i),x,y)
    //
    // }

    ctx.restore()
}

const dummy = (palette) => {

    const {width, height} = config
    ctx.fillStyle = "#000"
    ctx.fillRect(0,0,width, height)
}
const strategies = [
    new RenderingStrategy(
        "PairedRanges",
        "Dots in a start-shaped patterns with a pair of color spread along each axis",
        paint
    ),
    new RenderingStrategy(
        "Dummy",
        "Second option",
        dummy
    )
]
let strategy = strategies[0]

domready(
    () => {

        canvas = document.getElementById("screen");
        ctx = canvas.getContext("2d");

        const width = (window.innerWidth) | 0;
        const height = (window.innerHeight) | 0;

        config.width = width;
        config.height = height;

        canvas.width = width;
        canvas.height = height;

        palette = rndFromArray(allPalettesWithBlack)
         strategy.fn(palette)


        const domNode = document.getElementById('react-root');
        const root = createRoot(domNode);

        Modal.setAppElement(domNode)


        function render()
        {
            root.render(
                <>
                    <Config
                        palette={ palette }
                        setPalette={
                            p => {
                                palette = p
                                strategy.fn(palette)
                                render()
                            }
                        }
                        strategy={ strategy }
                        setStrategy={ s => {
                            strategy = s
                            strategy.fn(palette)
                            render()
                        } }
                        strategies={ strategies }
                    />
                    <ToastContainer position="top-center"/>
                </>
            )

        }


        render()

        canvas.addEventListener("click",  () => {
            palette = rndFromArray(allPalettesWithBlack)
            paint(palette)
            render()
        }, true)
    }
);
