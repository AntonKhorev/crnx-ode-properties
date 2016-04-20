'use strict'

const TheadLayout=require('./thead-layout')
const data=require('./data')

$(function(){
	$('.crnx-ode-properties').each(function(){
		const $container=$(this)
		const dag={}
		const selectedNodes={}
		for (let id in data) {
			dag[id]=data[id].parents
			selectedNodes[id]=true
		}
		let theadLayout=new TheadLayout(dag,selectedNodes)
		const writeTable=()=>{
			const setCellClasses=($cell,cell)=>{
				;['arrow','bt','rl','rt','bl'].forEach(dir=>{
					if (cell[dir]) {
						$cell.addClass(dir)
					}
				})
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
								setCellClasses($cell,cell)
								return $cell
							})
						)
					)
					if (i<theadLayout.arcLayers.length) {
						$thead.append(
							theadLayout.arcLayers[i].map(row=>$("<tr class='arcs'>").append(
								row.map(cell=>{
									const $cell=$("<th>")
									setCellClasses($cell,cell)
									return $cell
								})
							))
						)
					}
				}
				return $thead
			}
			$container.empty().append(
				$("<table>").append(
					writeThead(),
					$("<tfoot>").append(
						$("<tr>").append(
							theadLayout.columns.map(id=>$("<td>").append(
								$("<button type='button'>Delete</button>").click(function(){
									delete selectedNodes[id]
									theadLayout=new TheadLayout(dag,selectedNodes)
									writeTable()
								})
							))
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
		}
		writeTable()
	})
})
