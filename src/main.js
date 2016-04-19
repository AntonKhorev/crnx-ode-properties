'use strict'

const TheadLayout=require('./thead-layout')
const data=require('./data')

$(function(){
	$('.crnx-ode-properties').each(function(){
		const $container=$(this)
		$container.empty()
		const dag={}
		const selectedNodes={}
		for (let id in data) {
			dag[id]=data[id].parents
			selectedNodes[id]=true
		}
		const theadLayout=new TheadLayout(dag,selectedNodes)
		$container.append(
			$("<table>").append(
				$("<thead>").append(
					$("<tr>").append(
						theadLayout.columns.map(id=>"<th>"+data[id].name+"</th>")
					)
				),
				$("<tbody>").append(
					$("<tr>").append(
						theadLayout.columns.map(id=>"<td>$$"+data[id].equation+"$$</td>")
					)
				)
			)
		)
		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	})
})
