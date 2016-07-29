'use strict'

const detailsPolyfill=require('crnx-base/details-polyfill')

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
		}
		const getCoefInputs=coef=>{
			const initCoefInput=($input,getValue,setValue)=>$input
				.attr('min',-5)
				.attr('max',5)
				.attr('step','any')
				.val(coefs[coef])
				.on('input change',function(){
					if (this.checkValidity()) {
						setValue(getValue())
					}
				})
			const $div=$("<div>")
			if (coef.length>1) {
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
					$number=initCoefInput($("<input type='number'>"),()=>$number.val(),(v)=>$range.val(v))
				),
				" ",
				$range=initCoefInput($("<input type='range'>"),()=>Number($range.val()).toFixed(2),(v)=>$number.val(v))
			)
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
				$("<summary>").append("<a href='https://en.wikipedia.org/wiki/Trace_(linear_algebra)'>tr</a>-<a href='https://en.wikipedia.org/wiki/Determinant'>det</a> plane"),
				"TODO"
			).each(detailsPolyfill),
			$("<details>").append(
				$("<summary>").append("<a href='https://en.wikipedia.org/wiki/Phase_space'>phase plane</a>"),
				"TODO"
			).each(detailsPolyfill)
		)
	}
}

module.exports=LhcPlot
