'use strict'

$(function(){
	$('.crnx-ode-properties').each(function(){
		const $container=$(this)
		$container.empty().append(
			"When \\(a \\ne 0\\), there are two solutions to \\(ax^2 + bx + c = 0\\) and they are $$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$"
		)
		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	})
})
