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
		ctx.strokeStyle='#DDD'
		ctx.fillStyle='#CCC'
		ctx.font='30px sans-serif'
		drawAxis()
		ctx.save()
		ctx.rotate(-Math.PI/2)
		drawAxis()
		ctx.restore()
		ctx.textBaseline='middle'
		ctx.fillText(xLabel,xAxisSize+10,0)
		ctx.textBaseline='alphabetic'
		ctx.textAlign='center'
		ctx.fillText(yLabel,0,-yAxisSize-10)
		ctx.restore()
	}
}

module.exports=Canvas
