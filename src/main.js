'use strict'

const TheadLayout=require('./thead-layout')
const data=require('./data')

$(function(){
	$('.crnx-ode-properties').each(function(){
		const $container=$(this)
		const dag={}, idag={}
		const selectedNodes={}
		for (let id in data) {
			selectedNodes[id]=true
			dag[id]=data[id].parents
			idag[id]={}
		}
		for (let id in data) {
			for (let pid in dag[id]) {
				idag[pid][id]=true
			}
		}
		let theadLayout=new TheadLayout(dag,selectedNodes)
		const breadthWalk=(graph,id)=>{
			const result=[]
			const visited={}
			const queue=[id]
			while (queue.length>0) {
				id=queue.shift()
				if (visited[id]) {
					continue
				}
				visited[id]=true
				if (!selectedNodes[id]) {
					result.push(id)
				}
				queue.push(...Object.keys(graph[id]).sort())
			}
			return result
		}
		const writeButton=(text,tip)=>{
			const $button=$(`<button type='button'><span>${text}</span></button>`)
			if (tip!==undefined) {
				$button.attr('title',tip)
			}
			return $button
		}
		const writeTable=()=>{
			const setCellClasses=($cell,cell)=>{
				;['b','t','bt','rl','rt','bl'].forEach(dir=>{
					if (cell[dir]) {
						$cell.addClass(dir)
					}
				})
			}
			const writeTheadCell=cell=>{
				const $cell=$("<th>")
				setCellClasses($cell,cell)
				if (cell.node!==undefined) {
					$cell.append(data[cell.node].name)
					const parents=breadthWalk(dag,cell.node)
					if (parents.length>0) {
						$cell.append(
							" ",
							writeButton("Add parent","Add one of parents of this node").addClass('t')
						)
					}
					const children=breadthWalk(idag,cell.node)
					if (children.length>0) {
						$cell.append(
							" ",
							writeButton("Add child","Add one of children of this node").addClass('b')
						)
					}
				}
				return $cell
			}
			const writeThead=()=>{
				const $thead=$("<thead>")
				for (let i=0;i<theadLayout.nodeLayers.length;i++) {
					$thead.append(
						$("<tr class='nodes'>").append(
							theadLayout.nodeLayers[i].map(writeTheadCell)
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
			const writeTfoot=()=>{
				if (theadLayout.columns.length<=1) {
					return $()
				}
				return $("<tfoot>").append(
					$("<tr>").append(
						theadLayout.columns.map(id=>$("<td>").append(
							writeButton("Delete","Delete this node").click(function(){
								delete selectedNodes[id]
								theadLayout=new TheadLayout(dag,selectedNodes)
								writeTable()
							})
						))
					)
				)
			}
			$container.empty().append(
				$("<table>").append(
					writeThead(),
					writeTfoot(),
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
