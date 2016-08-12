'use strict'

const Canvas=require('./canvas')

class TrdetCanvas extends Canvas {
	redraw(matrix) {
		const crosshairSize=10
		const pointerSize=5
		const pointerMargin=3
		const trRange=matrix.getRange('tr')
		const detRange=matrix.getRange('det')
		const ctx=this.ctx
		const xRange=this.width/2
		const yRange=this.height/2
		const D=matrix.det
		const T=matrix.tr
		const drawRegionAreas=()=>{
			ctx.save()
			ctx.fillStyle='#FCC'
			if (D<0) {
				ctx.fillRect(-xRange,0,xRange*2,yRange)
			} else if ((D>0 && 4*D<T*T) || (4*D>T*T) && T!=0) {
				if (T<0) {
					ctx.scale(-1,1)
				}
				ctx.beginPath()
				if (4*D>T*T) {
					ctx.moveTo(xRange,-yRange)
					ctx.lineTo(0,-yRange)
				} else {
					ctx.moveTo(xRange,0)
				}
				for (let x=0;x<=xRange;x++) {
					const t=x*trRange/xRange
					const d=t*t/4
					const y=-d*yRange/detRange
					ctx.lineTo(x,y)
				}
				ctx.closePath()
				ctx.fill()
			}
			ctx.restore()
		}
		const drawRegionLines=()=>{
			ctx.save()
			const drawRegionLinesOnce=(all)=>{
				const drawParabola=()=>{
					for (let x=0;x<=+xRange;x++) {
						const t=x*trRange/xRange
						const d=t*t/4
						const y=-d*yRange/detRange
						ctx[x?'lineTo':'moveTo'](x,y)
					}
				}
				ctx.beginPath()
				if (all || (D==0 && T<0)) {
					ctx.moveTo(-xRange,0)
					ctx.lineTo(0,0)
				}
				if (all || (D==0 && T>0)) {
					ctx.moveTo(+xRange,0)
					ctx.lineTo(0,0)
				}
				if (all || (D>0 && T==0)) {
					ctx.moveTo(0,-yRange)
					ctx.lineTo(0,0)
				}
				if (all || (4*D==T*T && T<0)) {
					ctx.save()
					ctx.scale(-1,1)
					drawParabola()
					ctx.restore()
				}
				if (all || (4*D==T*T && T>0)) {
					drawParabola()
				}
				if (all || (D==0 && T==0)) {
					ctx.moveTo(-2,-2)
					ctx.lineTo(-2,+2)
					ctx.lineTo(+2,+2)
					ctx.lineTo(+2,-2)
					ctx.closePath()
				}
				ctx.stroke()
			}
			ctx.lineCap='square'
			ctx.lineWidth=2
			drawRegionLinesOnce(true)
			ctx.lineWidth=4
			ctx.strokeStyle='#F88'
			drawRegionLinesOnce()
			ctx.lineWidth=2
			ctx.strokeStyle='#400'
			drawRegionLinesOnce()
			ctx.restore()
		}
		const drawPosition=()=>{
			ctx.save()
			ctx.strokeStyle=ctx.fillStyle='#F00'
			let x=matrix.tr/trRange*xRange
			let y=-matrix.det/detRange*yRange
			if (x<0) {
				ctx.scale(-1,1)
				x=-x
			}
			if (y<0) {
				ctx.scale(1,-1)
				y=-y
			}
			if (x>xRange) {
				ctx.transform(0,1,1,0,0,0)
				const t=x
				x=y
				y=t
			}
			if ((x>xRange && y>yRange-pointerMargin) || (x>xRange-pointerMargin && y>yRange)) {
				ctx.beginPath()
				ctx.moveTo(xRange-pointerMargin,yRange-pointerMargin)
				ctx.lineTo(xRange-pointerMargin,yRange-pointerMargin-pointerSize*Math.SQRT2)
				ctx.lineTo(xRange-pointerMargin-pointerSize*Math.SQRT2,yRange-pointerMargin)
				ctx.closePath()
				ctx.fill()
			} else if (y>xRange) {
				ctx.beginPath()
				ctx.moveTo(x,yRange-pointerMargin)
				ctx.lineTo(x+pointerSize,yRange-pointerMargin-pointerSize)
				ctx.lineTo(x-pointerSize,yRange-pointerMargin-pointerSize)
				ctx.closePath()
				ctx.fill()
			} else {
				const s=crosshairSize
				ctx.beginPath()
				ctx.moveTo(x-s,y)
				ctx.lineTo(x+s,y)
				ctx.moveTo(x,y-s)
				ctx.lineTo(x,y+s)
				ctx.stroke()
			}
			ctx.restore()
		}
		ctx.save()
		ctx.fillStyle='#FFF'
		ctx.fillRect(0,0,this.width,this.height)
		ctx.translate(xRange,yRange)
		drawRegionAreas()
		this.drawAxes('tr','det')
		drawRegionLines()
		drawPosition()
		ctx.restore()
	}
}

module.exports=TrdetCanvas
