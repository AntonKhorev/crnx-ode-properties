'use strict'

const detailsPolyfill=require('crnx-base/details-polyfill')
const Matrix=require('./lhc-plot/matrix')

class LhcPlot {
	constructor() {
		const matrix=new Matrix
		const $numberInputs={}
		const $rangeInputs={}
		let $equilibriumType
		let $trdetCanvas,trdetCanvasContext
		let $phaseCanvas,phaseCanvasContext
		const updateDetails=()=>{
			const updateEquilibriumType=()=>{
				const getEquilibriumType=()=>{
					// names are based on
					// http://ocw.mit.edu/courses/mathematics/18-03-differential-equations-spring-2010/readings/supp_notes/MIT18_03S10_chapter_26.pdf
					const D=matrix.det
					const T=matrix.tr
					const ssc=(T==0)?"center":((T<0)?"sink":"source")
					if (D<0) {
						return `saddle`
					} else if (D==0) {
						if (T==0) {
							if (matrix.b==0 && matrix.c==0) {
								return `degenerate everywhere fixed`
							} else {
								return `degenerate parallel lines`
							}
						} else {
							return `degenerate comb ${ssc}`
						}
					} else if (4*D<T*T) {
						return `nodal (real) ${ssc}`
					} else if (4*D==T*T) {
						if (matrix.b==0 && matrix.c==0) {
							return `star ${ssc}`
						} else {
							return `defective nodal (real) ${ssc}`
						}
					} else {
						if (T==0) {
							return ssc
						} else {
							return `spiral ${ssc}`
						}
					}
				}
				$equilibriumType.text(getEquilibriumType())
			}
			const redrawTrdetCanvas=()=>{
				const crosshairSize=10
				const pointerSize=5
				const pointerMargin=3
				const trRange=matrix.getRange('tr')
				const detRange=matrix.getRange('det')
				const ctx=trdetCanvasContext
				const width=$trdetCanvas[0].width
				const height=$trdetCanvas[0].height
				const xRange=width/2
				const yRange=height/2
				const drawRegions=()=>{
					ctx.save()
					ctx.lineWidth=2
					ctx.beginPath()
					ctx.moveTo(-xRange,0)
					ctx.lineTo(+xRange,0)
					ctx.moveTo(0,-yRange)
					ctx.lineTo(0,0)
					let first=true
					for (let x=-xRange;x<=+xRange;x++) {
						const T=x*trRange/xRange
						const D=T*T/4
						const y=-D*yRange/detRange
						ctx[first?'moveTo':'lineTo'](x,y)
						first=false
					}
					ctx.stroke()
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
				ctx.fillRect(0,0,width,height)
				ctx.translate(xRange,yRange)
				drawRegions()
				drawPosition()
				ctx.restore()
			}
			const redrawPhaseCanvas=()=>{
				const ctx=phaseCanvasContext
				const width=$phaseCanvas[0].width
				const height=$phaseCanvas[0].height
				const xRange=width/2
				const yRange=height/2
				const drawEigenline=(lambda,otherLambda)=>{
					const iconSize=5
					let icon
					if (lambda<0) {
						icon=-1-(otherLambda<0 && lambda<otherLambda)
					} else if (lambda>0) {
						icon=+1+(otherLambda>0 && lambda>otherLambda)
					} else {
						icon=0
					}
					const xy=matrix.getEigenvector(lambda)
					let x=xy[0], y=xy[1]
					ctx.save()
					ctx.lineWidth=2
					if (x<0) {
						x=-x
						y=-y
					}
					if (y<0) {
						ctx.scale(1,-1)
						y=-y
					}
					if (x<y) { // TODO this will work only for square canvases, should also swap xRange and yRange
						ctx.transform(0,1,1,0,0,0) // swap x,y
						const t=x
						x=y
						y=t
					}
					if (x>0) {
						const r=Math.sqrt(x*x+y*y)
						const x0=x/r
						const y0=y/r
						const x1=xRange
						const y1=yRange*y/x
						const xic=xRange/2*x0
						const yic=yRange/2*y0
						const xis=iconSize*x0
						const yis=iconSize*y0
						const drawEigenlineIcon=()=>{
							const dir=Math.sign(icon)
							const drawSquare=()=>{
								ctx.beginPath()
								ctx.moveTo(xic+(-xis-yis),-(yic+(-yis+xis)))
								ctx.lineTo(xic+(-xis+yis),-(yic+(-yis-xis)))
								ctx.lineTo(xic+(+xis+yis),-(yic+(+yis-xis)))
								ctx.lineTo(xic+(+xis-yis),-(yic+(+yis+xis)))
								ctx.closePath()
								ctx.fill()
							}
							const drawTriangle=(ofs)=>{
								ctx.beginPath()
								ctx.moveTo(xic+dir*(ofs*xis-xis-yis),-(yic+dir*(ofs*yis-yis+xis)))
								ctx.lineTo(xic+dir*(ofs*xis-xis+yis),-(yic+dir*(ofs*yis-yis-xis)))
								ctx.lineTo(xic+dir*(ofs*xis+xis    ),-(yic+dir*(ofs*yis+yis    )))
								ctx.closePath()
								ctx.fill()
							}
							if (dir==0) {
								drawSquare()
							} else {
								drawTriangle(0)
								if (Math.abs(icon)>=2) {
									drawTriangle(2)
								}
							}
						}
						ctx.beginPath()
						ctx.moveTo(-x1,+y1)
						ctx.lineTo(+x1,-y1)
						ctx.stroke()
						ctx.save()
						drawEigenlineIcon()
						ctx.scale(-1,-1)
						drawEigenlineIcon()
						ctx.restore()
					}
					ctx.restore()
				}
				const drawSolution=(x0,y0)=>{
					let lambda1,lambda2
					if (matrix.re1<=matrix.re2) {
						lambda1=matrix.re1
						lambda2=matrix.re2
					} else {
						lambda1=matrix.re2
						lambda2=matrix.re1
					}
					const xy1=matrix.getEigenvector(lambda1)
					const x1=xy1[0], y1=xy1[1]
					const xy2=matrix.getEigenvector(lambda2)
					const x2=xy2[0], y2=xy2[1]
					const k1=+(x2*y0-x0*y2)/(x2*y1-x1*y2)
					const k2=-(x1*y0-x0*y1)/(x2*y1-x1*y2)
					ctx.save()
					ctx.lineWidth=2
					ctx.strokeStyle='#08F'
					if (lambda1>0 && k1!=0 && k2!=0) {
						const limit=10*Math.max(xRange,yRange)
						let T1=0
						let T2=0
						const dT1=1/Math.max(Math.abs(k1*x1),Math.abs(k2*x2))
						ctx.beginPath()
						ctx.moveTo(0,0)
						for (let i=0;i<limit;i++) {
							T1+=dT1
							T2=Math.pow(T1,lambda2/lambda1)
							ctx.lineTo(
								+(k1*x1*T1+k2*x2*T2),
								-(k1*y1*T1+k2*y2*T2)
							)
							if (
								(k1*x1*T1+k2*x2*T2)*Math.sign(k2*x2)>xRange ||
								(k1*y1*T1+k2*y2*T2)*Math.sign(k2*y2)>yRange
							) break
						}
						ctx.stroke()
					}
					ctx.restore()
				}
				const drawDirectionField=()=>{
					const arrowSpacing=27
					const arrowLength=5
					const arrowWidth=2
					const drawArrow=(x,y)=>{
						const dx=matrix.a*x+matrix.b*y
						const dy=matrix.c*x+matrix.d*y
						const dl=Math.sqrt(dx*dx+dy*dy)
						ctx.beginPath()
						ctx.moveTo(
							+(x-dx/dl*arrowLength),
							-(y-dy/dl*arrowLength)
						)
						ctx.lineTo(+x,-y)
						ctx.stroke()
						ctx.beginPath()
						ctx.moveTo(
							+(x+dx/dl*arrowLength),
							-(y+dy/dl*arrowLength)
						)
						ctx.lineTo(
							+(x-dy/dl*arrowWidth),
							-(y+dx/dl*arrowWidth)
						)
						ctx.lineTo(
							+(x+dy/dl*arrowWidth),
							-(y-dx/dl*arrowWidth)
						)
						ctx.closePath()
						ctx.fill()
					}
					ctx.save()
					ctx.fillStyle=ctx.strokeStyle='#888'
					const nx=Math.floor(xRange/arrowSpacing)
					const ny=Math.floor(yRange/arrowSpacing)
					for (let i=-nx;i<=nx;i++) {
						for (let j=-ny;j<=ny;j++) {
							drawArrow(
								i*arrowSpacing+0.5*Math.sign(i),
								j*arrowSpacing+0.5*Math.sign(j)
							)
						}
					}
					ctx.restore()
				}
				ctx.save()
				ctx.fillStyle='#FFF'
				ctx.fillRect(0,0,width,height)
				ctx.restore()
				ctx.save()
				ctx.translate(xRange,yRange)
				drawDirectionField()
				if (matrix.im1==0) {
					drawEigenline(matrix.re1,matrix.re2)
					if (matrix.re1!=matrix.re2) {
						drawEigenline(matrix.re2,matrix.re1)
						drawSolution(+xRange/2,0)
						drawSolution(-xRange/2,0)
						drawSolution(0,+yRange/2)
						drawSolution(0,-yRange/2)
					}
				}
				ctx.restore()
			}
			matrix.forUpdated(cf=>{
				$numberInputs[cf].val(matrix[cf])
				$rangeInputs[cf].val(matrix[cf])
			})
			updateEquilibriumType()
			redrawTrdetCanvas()
			redrawPhaseCanvas()
		}
		const getCoefInputs=coef=>{
			const isMatrixElement=coef.length==1
			const valueRange=matrix.getRange(coef)
			const initCoefInput=(type,getValue,setValue)=>{
				const $input=$(`<input type='${type}'>`).attr('step','any').val(matrix[coef])
				if (type=='range') {
					$input.attr('min',-valueRange).attr('max',valueRange)
				}
				$input.on('input change',function(){
					if (this.checkValidity()) {
						const value=getValue()
						setValue(value)
						matrix[coef]=Number(value)
						updateDetails()
					}
				})
				return $input
			}
			const $div=$("<div>")
			if (!isMatrixElement) {
				$div.addClass(coef)
			}
			let label=coef
			if (coef=='tr') {
				label=`\\operatorname{${coef}}(\\mathbf{A})`
			} else if (coef=='det') {
				label=`\\${coef}(\\mathbf{A})`
			} else if (coef.slice(0,2)=='re') {
				//label=`\\lambda_${coef.charAt(2)} =`
				label=`\\Re \\lambda_${coef.charAt(2)}`
			} else if (coef.slice(0,2)=='im') {
				//label=`+ i \\cdot`
				label=`\\Im \\lambda_${coef.charAt(2)}`
			}
			let $number,$range
			$div.append(
				$("<label>").append(
					`<span class='label'>\\( ${label} \\)</span>`,
					`<span class='space'> </span>`,
					$number=initCoefInput('number',()=>$number.val(),(v)=>$range.val(v))
				),
				" ",
				$range=initCoefInput('range',()=>Number($range.val()).toFixed(2),(v)=>$number.val(v))
			)
			$numberInputs[coef]=$number
			$rangeInputs[coef]=$range
			return $div
		}
		this.$output=$("<div class='matrix'>").append(
			$("<details>").append(
				$("<summary>").append("equation coefficients"),
				$("<table>").append(
					$("<tr>").append(
						$("<td>").append(getCoefInputs('a')),
						$("<td>").append(getCoefInputs('b'))
					),
					$("<tr>").append(
						$("<td>").append(getCoefInputs('c')),
						$("<td>").append(getCoefInputs('d'))
					)
				),
				$("<div>").append(
					"Set matrix to ",
					$("<button>zero</button>").click(function(){
						matrix.setZero()
						updateDetails()
					}),
					" ",
					$("<button>associated</button>").click(function(){
						matrix.setAssociated()
						updateDetails()
					})
				)
			).each(detailsPolyfill),
			$("<details>").append(
				$("<summary>").append("matrix parameters"),
				getCoefInputs('tr'),
				getCoefInputs('det'),
				$("<table>").append(
					$("<tr>").append(
						$("<td>").append(getCoefInputs('re1')),
						$("<td>").append(getCoefInputs('im1'))
					),
					$("<tr>").append(
						$("<td>").append(getCoefInputs('re2')),
						$("<td>").append(getCoefInputs('im2'))
					)
				)
			).each(detailsPolyfill),
			$("<details>").append(
				$("<summary>").append("equilibrium point type"),
				$equilibriumType=$("<div>")
			).each(detailsPolyfill),
			$("<details>").append(
				$("<summary class='bordered'>").append("<a href='https://en.wikipedia.org/wiki/Trace_(linear_algebra)'>tr</a>-<a href='https://en.wikipedia.org/wiki/Determinant'>det</a> plane"),
				$trdetCanvas=$("<canvas width='246' height='246'>").on('mousedown mousemove',function(ev){
					if (!ev.buttons&1) return
					const $canvas=$(this)
					const w=$canvas.width()
					const h=$canvas.height()
					const trim=(v)=>Number(v.toFixed(2))
					matrix.setTrdetExternally(
						trim(+(ev.offsetX-w/2+0.5)/(w/2)*matrix.getRange('tr')),
						trim(-(ev.offsetY-h/2+0.5)/(h/2)*matrix.getRange('det'))
					)
					updateDetails()
				})
			).each(detailsPolyfill),
			$("<details>").append(
				$("<summary class='bordered'>").append("<a href='https://en.wikipedia.org/wiki/Phase_space'>phase plane</a>"),
				$phaseCanvas=$("<canvas width='246' height='246'>")
			).each(detailsPolyfill),
			$("<div class='note'>").append("plotting is not fully implemented yet, try to use <a href='http://mathlets.org/mathlets/linear-phase-portraits-matrix-entry/'>MIT Mathlet</a> instead")
		)
		trdetCanvasContext=$trdetCanvas[0].getContext('2d')
		phaseCanvasContext=$phaseCanvas[0].getContext('2d')
		updateDetails()
	}
}

module.exports=LhcPlot
