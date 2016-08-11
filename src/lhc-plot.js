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
				ctx.fillRect(0,0,width,height)
				ctx.translate(xRange,yRange)
				drawRegionAreas()
				drawRegionLines()
				drawPosition()
				ctx.restore()
			}
			const redrawPhaseCanvas=()=>{
				const ctx=phaseCanvasContext
				const width=$phaseCanvas[0].width
				const height=$phaseCanvas[0].height
				const xRange=width/2
				const yRange=height/2
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
							const drawDiamond=()=>{
								ctx.beginPath()
								ctx.moveTo(xic-xis,-(yic-yis))
								ctx.lineTo(xic+yis,-(yic-xis))
								ctx.lineTo(xic+xis,-(yic+yis))
								ctx.lineTo(xic-yis,-(yic+xis))
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
								drawDiamond()
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
				const drawSolution=(x0,y0,color)=>{
					const iterationLimit=100*Math.max(xRange,yRange)
					const drawSaddleOrNodeSolution=()=>{
						let lambda1,lambda2
						if (matrix.re1<=matrix.re2) {
							lambda1=matrix.re1
							lambda2=matrix.re2
						} else {
							lambda1=matrix.re2
							lambda2=matrix.re1
						}
						const xy1=matrix.getEigenvector(lambda1)
						let x1=xy1[0], y1=xy1[1]
						const xy2=matrix.getEigenvector(lambda2)
						let x2=xy2[0], y2=xy2[1]
						if (lambda2<=0) {
							let t
							t=lambda1
							lambda1=-lambda2
							lambda2=-t
							t=x1
							x1=x2
							x2=t
							t=y1
							y1=y2
							y2=t
						}
						const k1=+(x2*y0-x0*y2)/(x2*y1-x1*y2)
						const k2=-(x1*y0-x0*y1)/(x2*y1-x1*y2)
						if (k1==0 || k2==0) return
						if (lambda1>0) { // node
							let T1=0
							let T2=0
							const dT1=1/Math.max(Math.abs(k1*x1),Math.abs(k1*y1)) // step size is controlled by slow direction
							ctx.beginPath()
							ctx.moveTo(0,0)
							for (let i=0;i<iterationLimit;i++) {
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
						} else if (lambda1<0 && lambda2>0) { // saddle
							let t=0 // assumes starting point is in viewport
							for (let i=0;i<iterationLimit;i++) {
								const ke1=k1*Math.exp(lambda1*t)
								const ke2=k2*Math.exp(lambda2*t)
								if (
									(x1*ke1+x2*ke2)*Math.sign(x1*k1)>xRange ||
									(y1*ke1+y2*ke2)*Math.sign(y1*k1)>yRange
								) break
								const dt=Math.min(
									1/Math.abs(x1*ke1*lambda1),
									1/Math.abs(y1*ke1*lambda1),
									1/Math.abs(x1*ke2*lambda2),
									1/Math.abs(y1*ke2*lambda2)
								)
								t-=dt
							}
							ctx.beginPath()
							for (let i=0;i<iterationLimit;i++) {
								const ke1=k1*Math.exp(lambda1*t)
								const ke2=k2*Math.exp(lambda2*t)
								ctx[i?'lineTo':'moveTo'](
									+(x1*ke1+x2*ke2),
									-(y1*ke1+y2*ke2)
								)
								if (t>0 && (
									(x1*ke1+x2*ke2)*Math.sign(x1*k2)>xRange ||
									(y1*ke1+y2*ke2)*Math.sign(y1*k2)>yRange
								)) break
								const dt=Math.min(
									1/Math.abs(x1*ke1*lambda1),
									1/Math.abs(y1*ke1*lambda1),
									1/Math.abs(x1*ke2*lambda2),
									1/Math.abs(y1*ke2*lambda2)
								)
								t+=dt
							}
							ctx.stroke()
						} else if (lambda1==0 && lambda2>0) { // comb
							// TODO allow k1 or k2 == 0
							const T=Math.min(
								(Math.sign(x2*k2)*xRange-x1*k1)/(x2*k2),
								(Math.sign(y2*k2)*xRange-y1*k1)/(y2*k2)
							)
							if (T>0) {
								ctx.beginPath()
								ctx.moveTo(
									+(x1*k1),
									-(y1*k1)
								)
								ctx.lineTo(
									+(x1*k1+x2*k2*T),
									-(y1*k1+y2*k2*T)
								)
								ctx.stroke()
							}
						}
					}
					const drawSpiralSolution=()=>{
						let alpha=matrix.re1
						let beta=matrix.im1
						if (beta<0) {
							beta=-beta
						}
						const xxyy=matrix.getComplexEigenvector(alpha,beta)
						if (alpha<0) {
							alpha=-alpha
							beta=-beta
						}
						const x1=xxyy[0], x2=xxyy[1]
						const y1=xxyy[2], y2=xxyy[3]
						const k1=+(x2*y0-x0*y2)/(x2*y1-x1*y2)
						const k2=-(x1*y0-x0*y1)/(x2*y1-x1*y2)
						if (k1==0 && k2==0) return
						const kxc=k1*x1+k2*x2
						const kxs=k2*x1-k1*x2
						const kyc=k1*y1+k2*y2
						const kys=k2*y1-k1*y2
						if (alpha==0) { // center
							ctx.beginPath()
							const dt=1/Math.max(kxc,kyc,kxs,kys)
							let t=0
							for (let i=0;i<iterationLimit;i++) {
								const c=Math.cos(t)
								const s=Math.sin(t)
								ctx[i?'lineTo':'moveTo'](
									+(kxc*c+kxs*s),
									-(kyc*c+kys*s)
								)
								t+=dt
								if (t>=2*Math.PI) break
							}
							ctx.closePath()
							ctx.stroke()
						} else { // spiral
							const calculateSemiaxes=()=>{ // https://en.wikipedia.org/wiki/Ellipse#Canonical_form
								const A=kys*kys+kyc*kyc, B=-2*(kxs*kys+kxc*kyc), C=kxs*kxs+kxc*kxc
								const f=kxc*kys-kxs*kyc
								const F=-f*f
								const DIS=B*B-4*A*C
								const A2=2*DIS*F*(A+C-Math.sqrt((A-C)*(A-C)+B*B))/(DIS*DIS)
								const B2=2*DIS*F*(A+C+Math.sqrt((A-C)*(A-C)+B*B))/(DIS*DIS)
								return [A2,B2] // TODO relative axes lengths don't depend on initial conditions, this calculation should be simpler
							}
							const A2B2=calculateSemiaxes()
							const A2=A2B2[0]
							const B2=A2B2[1]
							const B=Math.sqrt(B2)
							const R2=xRange*xRange+yRange*yRange
							//const t0=-(Math.log(B2)/2+Math.log(Math.exp(2*Math.PI*alpha/Math.abs(beta))-1))/alpha
							const lineWidth=2
							const t0=(Math.log(lineWidth)-Math.log(B2)/2-Math.log(Math.exp(2*Math.PI*alpha/Math.abs(beta))-1))/alpha
							//const t1=(Math.log(R2)-Math.log(A2))/(2*alpha)
							ctx.beginPath()
							const e0=Math.exp(alpha*t0)
							const nSegments=Math.ceil(B*e0*2*Math.PI)
							for (let i=0;i<nSegments;i++) {
								const t=2*Math.PI*i/nSegments
								const c0=Math.cos(t)
								const s0=Math.sin(t)
								ctx[i?'lineTo':'moveTo'](
									+e0*(kxc*c0+kxs*s0),
									-e0*(kyc*c0+kys*s0)
								)
							}
							ctx.closePath()
							ctx.stroke()
							ctx.fill()
							ctx.beginPath()
							let t=t0
							for (let i=0;i<iterationLimit;i++) {
								const e=Math.exp(alpha*t)
								const c=Math.cos(beta*t)
								const s=Math.sin(beta*t)
								ctx[i?'lineTo':'moveTo'](
									+e*(kxc*c+kxs*s),
									-e*(kyc*c+kys*s)
								)
								//const dtTan=1/Math.abs(beta*B*e)
								const dtRad=Math.log(1/(B*e)+1)/alpha
								//t+=Math.min(Math.max(dtTan,1/Math.abs(40*beta)),dtRad)
								t+=Math.min(dtRad,1/Math.abs(16*beta))
								if (e*e*A2>R2) break
							}
							ctx.stroke()
						}
					}
					const drawDefectiveSolution=()=>{
						if (matrix.b==0 && matrix.c==0 && matrix.re1!=0) { // star source
							const r0=Math.sqrt(x0*x0+y0*y0)
							const R=Math.sqrt(xRange*xRange+yRange*yRange)
							if (r0>0) {
								ctx.beginPath()
								ctx.moveTo(0,0)
								ctx.lineTo(x0*R/r0,y0*R/r0)
								ctx.stroke()
							}
						}
					}
					ctx.save()
					ctx.lineWidth=2
					ctx.strokeStyle=ctx.fillStyle=color
					if (matrix.im1==0 && matrix.re1!=matrix.re2) {
						drawSaddleOrNodeSolution()
					} else if (matrix.im1==0 && matrix.re1==matrix.re2) {
						drawDefectiveSolution()
					} else if (matrix.im1!=0) {
						drawSpiralSolution()
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
					}
				}
				drawSolution(+xRange/2,0,'#08F')
				drawSolution(-xRange/2,0,'#28F')
				drawSolution(0,+yRange/2,'#0AF')
				drawSolution(0,-yRange/2,'#08D')
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
					const tRange=matrix.getRange('tr')
					const dRange=matrix.getRange('det')
					const tClose=2*tRange/(w/2)
					const dClose=2*dRange/(h/2)
					let t=trim(+(ev.offsetX-w/2+0.5)/(w/2)*tRange)
					let d=trim(-(ev.offsetY-h/2+0.5)/(h/2)*dRange)
					const p=t*t/4
					if (Math.abs(d)<=dClose && Math.abs(t)<=tClose) {
						t=0
						d=0
					} else if (d>0 && Math.abs(t)<=tClose) {
						t=0
					} else if (d<0 && d>=-dClose) {
						d=0
					} else if (d-p>0 && d-p<=dClose) {
						d=p
					} else if (d>0 && d<=dClose) {
						d=0
					} else if (d-p<0 && d-p>=-dClose) {
						d=p
					}
					matrix.setTrdetExternally(t,d)
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
