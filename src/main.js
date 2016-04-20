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
			/*
			;['bt','rl','rt','bl'].forEach(dir=>{
				if (cell[dir]) {
					$cell.append('+'+dir)
				}
			})
			*/
			// bl
			if (cell.bl) {
				$cell.append(
					"<svg width='200' height='20' viewbox='-10 -1 20 2'>"+
					"<path d='M 0 1 A 1 1 0 0 0 -1 0 H -10' fill='none' stroke='#000' stroke-width='0.1' />"+
					"</svg>"
				)
			}
		}
		const writeThead=()=>{
			const $thead=$("<thead>")
			for (let i=0;i<theadLayout.nodeLayers.length;i++) {
				$thead.append(
					$("<tr class='nodes'>").append(
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
						theadLayout.arcLayers[i].map(row=>$("<tr class='arcs'>").append(
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
