class validcode {

    private ref: HTMLCanvasElement | null = null
    private code: string = ''
    private height: number
    private width: number
    private pool: string

    constructor(height: number = 40, width: number = 120, pool: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
        this.height = height;
        this.width = width;
        this.pool = pool;
    }

    setRef = (ref: HTMLCanvasElement) => {
        this.ref = ref
    }

    private randomNum = (min: number, max: number) => {
        return parseInt(String(Math.random() * (max - min) + min))
    }

    private randomColor = (min: number, max: number) => {
        const r = this.randomNum(min, max)
        const g = this.randomNum(min, max)
        const b = this.randomNum(min, max)
        return `rgb(${r},${g},${b})`
    }

    draw = () => {
        const ctx = this.ref!.getContext('2d') as CanvasRenderingContext2D
        // filled color
        ctx.fillStyle = this.randomColor(180, 230)
        // set the position of the rectangle
        ctx.fillRect(0, 0, this.width, this.height)
        // code
        let imgCode = ''
        // generate the code
        for (let i = 0; i < 4; i++) {
            // random character
            const text = this.pool[this.randomNum(0, this.pool.length)]
            imgCode += text
            // random font size
            const fontSize = this.randomNum(18, 40)
            // random rotation angle
            const deg = this.randomNum(-30, 30)
            ctx.font = fontSize + 'px Simhei'
            ctx.textBaseline = 'top'
            ctx.fillStyle = this.randomColor(80, 150)
            ctx.save()
            ctx.translate(30 * i + 15, 15)
            ctx.rotate((deg * Math.PI) / 180)
            ctx.fillText(text, -15 + 5, -15)
            ctx.restore()
        }
        for (let i = 0; i < 5; i++) {
            ctx.beginPath()
            ctx.moveTo(this.randomNum(0, this.width), this.randomNum(0, this.height))
            ctx.lineTo(this.randomNum(0, this.width), this.randomNum(0, this.height))
            ctx.strokeStyle = this.randomColor(180, 230)
            ctx.closePath()
            ctx.stroke()
        }
        for (let i = 0; i < 40; i++) {
            ctx.beginPath()
            ctx.arc(this.randomNum(0, this.width), this.randomNum(0, this.height), 1, 0, 2 * Math.PI)
            ctx.closePath()
            ctx.fillStyle = this.randomColor(150, 200)
            ctx.fill()
        }
        this.code = imgCode
    }

    validate = (code: string, strict?: boolean) => {
        if (strict) {
            return code === this.code
        } else {
            return code.toLowerCase() === this.code.toLowerCase()
        }
    }
}

export default validcode