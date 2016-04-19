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
		const setArcs=($cell,cell)=>{
			;['bt','rl','rt','bl'].forEach(dir=>{
				if (cell[dir]) {
					$cell.append('+'+dir)
				}
			})
		}
		const writeThead=()=>{
			const $thead=$("<thead>")
			for (let i=0;i<theadLayout.nodeLayers.length;i++) {
				$thead.append(
					$("<tr>").append(
						theadLayout.nodeLayers[i].map(cell=>{
							const $cell=$("<th>")
							if (cell.node!==undefined) {
								$cell.append(data[cell.node].name)
							}
							setArcs($cell,cell)
							return $cell
						})
					)
				)
				if (i<theadLayout.arcLayers.length) {
					$thead.append(
						theadLayout.arcLayers[i].map(row=>$("<tr>").append(
							row.map(cell=>{
								const $cell=$("<th>")
								setArcs($cell,cell)
								return $cell
							})
						))
					)
				}
			}
			return $thead
		}
		$container.append(
			$("<table>").append(
				writeThead(),
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
