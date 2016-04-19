'use strict'

const data=require('./data')

$(function(){
	$('.crnx-ode-properties').each(function(){
		const $container=$(this)
		$container.empty()
		for (let id in data) {
			$container.append("<div>$$"+data[id].equation+"$$</div>")
		}
		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	})
})
