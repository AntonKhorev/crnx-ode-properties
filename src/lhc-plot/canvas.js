'use strict'

class Canvas {
	constructor() {
		this.width=246
		this.height=246
		this.$output=$(`<canvas width='${this.width}' height='${this.height}'>`)
		this.ctx=this.$output[0].getContext('2d')
	}
	drawAxes(xLabel,yLabel) {
		const xAxisSize=80
		const yAxisSize=80
		const arrowSize=15
		const ctx=this.ctx
		const drawAxis=()=>{
			ctx.beginPath()
			ctx.moveTo(-xAxisSize,0)
			ctx.lineTo(+xAxisSize,0)
			ctx.moveTo(xAxisSize-arrowSize,-arrowSize)
			ctx.lineTo(xAxisSize,0)
			ctx.lineTo(xAxisSize-arrowSize,+arrowSize)
			ctx.stroke()
		}
		ctx.save()
		ctx.lineWidth=6
		ctx.strokeStyle='rgba(0,0,0,0.1)'
		drawAxis()
		ctx.save()
		ctx.rotate(-Math.PI/2)
		drawAxis()
		ctx.restore()
		ctx.restore()
	}
}

module.exports=Canvas
