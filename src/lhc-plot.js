'use strict'

const detailsPolyfill=require('crnx-base/details-polyfill')
const updateMatrixElementsForTrDet=require('./lhc-plot/matrix-elements-for-tr-det')

class LhcPlot {
	constructor() {
		const coefs={
			a: 1,
			b: 0,
			c: 0,
			d: 1,
			get tr() {
				return this.a+this.d
			},
			get det() {
				return this.a*this.d-this.b*this.c
			},
			getRange(coef) {
				if (coef=='tr') {
					return 10
				} else if (coef=='det') {
					return 50
				} else {
					return 5
				}
			}
		}
		let originalCoefs=null
		const $numberInputs={}
		const $rangeInputs={}
		let $trDetCanvas,trDetCanvasContext
		let $equilibriumType
		const updateDetails=()=>{
			const updateEquilibriumType=()=>{
				const getEquilibriumType=()=>{
					// names are based on
					// http://ocw.mit.edu/courses/mathematics/18-03-differential-equations-spring-2010/readings/supp_notes/MIT18_03S10_chapter_26.pdf
					const D=coefs.det
					const T=coefs.tr
					const ssc=(T==0)?"center":((T<0)?"sink":"source")
					if (D<0) {
						return `saddle`
					} else if (D==0) {
						if (T==0) {
							if (coefs.b==0 && coefs.c==0) {
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
						if (coefs.b==0 && coefs.c==0) {
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
			const redrawTrDetCanvas=()=>{
				const trRange=coefs.getRange('tr')
				const detRange=coefs.getRange('det')
				const ctx=trDetCanvasContext
				const width=$trDetCanvas[0].width
				const height=$trDetCanvas[0].height
				const xRange=width/2
				const yRange=height/2
				const drawRegions=()=>{
					ctx.save()
					ctx.lineWidth=2
					ctx.beginPath()
					ctx.moveTo(-xRange,0)
					ctx.lineTo(+xRange,0)
					ctx.moveTo(0,-yRange)
					ctx.lineTo(0,+yRange)
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
					const x=coefs.tr/trRange*xRange
					const y=-coefs.det/detRange*yRange
					const s=10
					ctx.strokeStyle='#F00'
					ctx.beginPath()
					ctx.moveTo(x-s,y)
					ctx.lineTo(x+s,y)
					ctx.moveTo(x,y-s)
					ctx.lineTo(x,y+s)
					ctx.stroke()
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
			updateEquilibriumType()
			redrawTrDetCanvas()
		}
		const getCoefInputs=coef=>{
			const isMatrixElement=coef.length==1
			const valueRange=coefs.getRange(coef)
			const initCoefInput=(type,getValue,setValue)=>{
				const $input=$(`<input type='${type}'>`).attr('step','any').val(coefs[coef])
				if (type=='range') {
					$input.attr('min',-valueRange).attr('max',valueRange)
				}
				$input.on('input change',function(){
					if (this.checkValidity()) {
						const value=getValue()
						setValue(value)
						if (isMatrixElement) {
							originalCoefs=null
							coefs[coef]=Number(value)
							$numberInputs.tr.val(coefs.tr)
							$rangeInputs.tr.val(coefs.tr)
							$numberInputs.det.val(coefs.det)
							$rangeInputs.det.val(coefs.det)
						} else {
							if (originalCoefs===null) {
								originalCoefs=[coefs.a,coefs.b,coefs.c,coefs.d]
							}
							const updatedCoefValues=updateMatrixElementsForTrDet(
								...originalCoefs,
								Number($numberInputs.tr.val()),
								Number($numberInputs.det.val())
							)
							;['a','b','c','d'].forEach((cf,i)=>{
								coefs[cf]=updatedCoefValues[i]
								$numberInputs[cf].val(coefs[cf])
								$rangeInputs[cf].val(coefs[cf])
							})
						}
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
				getCoefInputs('tr'),
				getCoefInputs('det')
			).each(detailsPolyfill),
			$("<details>").append(
				$("<summary>").append("equilibrium point type"),
				$equilibriumType=$("<div>")
			).each(detailsPolyfill),
			$("<details>").append(
				$("<summary>").append("<a href='https://en.wikipedia.org/wiki/Trace_(linear_algebra)'>tr</a>-<a href='https://en.wikipedia.org/wiki/Determinant'>det</a> plane"),
				$trDetCanvas=$("<canvas width='240' height='240'>")
			).each(detailsPolyfill),
			$("<details>").append(
				$("<summary>").append("<a href='https://en.wikipedia.org/wiki/Phase_space'>phase plane</a>"),
				$("<div class='note'>").append("not implemented yet, try to use <a href='http://mathlets.org/mathlets/linear-phase-portraits-matrix-entry/'>MIT Mathlet</a> instead")
			).each(detailsPolyfill)
		)
		trDetCanvasContext=$trDetCanvas[0].getContext('2d')
		updateDetails()
	}
}

module.exports=LhcPlot
