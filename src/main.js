'use strict'

$(function(){
	$('.crnx-ode-properties').each(function(){
		const $container=$(this)
		$container.empty().append(
			"$$\\frac{\\mathrm{d}y}{\\mathrm{d}t} = f(t,y)$$",
			" ",
			"$$\\frac{\\mathrm{d}y}{\\mathrm{d}t} = f_1(t) \\cdot f_2(y)$$"
		)
		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	})
})
