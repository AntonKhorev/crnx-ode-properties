'use strict'

const detailsPolyfill=require('crnx-base/details-polyfill')

class LhcPlot {
	constructor() {
		const coefs={
			a: 1,
			b: 0,
			c: 0,
			d: 1,
		}
		const getCoefInputs=coef=>{
			const initCoefInput=$input=>$input.attr('min',-5).attr('max',5).attr('step','any').val(coefs[coef])
			return $("<td>").append(
				$("<label>").append(
					`<span class='label'>\\( ${coef} \\)</span>`,
					`<span class='space'> </span>`,
					initCoefInput($("<input type='number'>"))
				),
				" ",
				initCoefInput($("<input type='range'>"))
			)
		}
		this.$output=$("<div class='matrix'>").append(
			$("<details>").append(
				$("<summary>").append("equation coefficients"),
				$("<table>").append(
					$("<tr>").append(
						getCoefInputs('a'),
						getCoefInputs('b')
					),
					$("<tr>").append(
						getCoefInputs('c'),
						getCoefInputs('d')
					)
				)
			).each(detailsPolyfill),
			$("<details>").append(
				$("<summary>").append("tr-det plane"),
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
