

export default class RenderingStrategy
{
    /**
     * Name of the rendering strategy
     * @type {string}
     */
    name = "Unnamed";
    /**
     * Description of rendering strategy
     * @type {string}
     */
    desc = "---"
    /**
     * Rendering function
     *
     * fn(palette) => ...
     *
     * @type {function}
     */
    fn = null
    constructor(name, desc, fn)
    {
        this.name = name
        this.desc = desc
        this.fn = fn
    }
}
