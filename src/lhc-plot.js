'use strict'

const detailsPolyfill=require('crnx-base/details-polyfill')
const Matrix=require('./lhc-plot/matrix')
const TrdetCanvas=require('./lhc-plot/trdet-canvas')
const PhaseCanvas=require('./lhc-plot/phase-canvas')

// works like this: http://mathlets.org/mathlets/linear-phase-portraits-matrix-entry/
class LhcPlot {
	constructor() {
		const matrix=new Matrix
		const $numberInputs={}
		const $rangeInputs={}
		let $equilibriumType
		const trdetCanvas=new TrdetCanvas
		const phaseCanvas=new PhaseCanvas
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
			matrix.forUpdated(cf=>{
				$numberInputs[cf].val(matrix[cf])
				$rangeInputs[cf].val(matrix[cf])
			})
			updateEquilibriumType()
			trdetCanvas.redraw(matrix)
			phaseCanvas.redraw(matrix)
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
				trdetCanvas.$output.on('mousedown mousemove',function(ev){
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
				phaseCanvas.$output
			).each(detailsPolyfill)
		)
		updateDetails()
	}
}

module.exports=LhcPlot
