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
			const writeTheadButton=($cell,text,tip,dir,nodes)=>{
				const keyCodeUp=38
				const keyCodeDown=40
				let $nodes
				let attached
				const $button=writeButton(text,tip).addClass(dir).click(function(){
					if (!$nodes) {
						$nodes=$("<ul>").append(nodes.map(
							id=>$("<li tabindex='0'>"+data[id].name+"</li>").keydown(function(ev){
								if (!attached) return
								if (ev.keyCode==keyCodeUp) {
									const $toFocus=$(this).prev()
									if ($toFocus.length) {
										$toFocus.focus()
									} else if (attached=='b') {
										$button.focus()
									}
								} else if (ev.keyCode==keyCodeDown) {
									const $toFocus=$(this).next()
									if ($toFocus.length) {
										$toFocus.focus()
									} else if (attached=='t') {
										$button.focus()
									}
								}
							})
						))
						$cell.append($nodes)
						$button.addClass('hide')
						setTimeout(()=>{ // can calculate height only after it's displayed
							const nh=$nodes.outerHeight()
							const no=$nodes.offset()
							const bh=$button.outerHeight()
							const bo=$button.offset()
							let t=bo.top-nh+1
							if (dir!='t' || t<0) { // want below or doesn't fit to screen above the button
								t=bo.top+bh-1
								attached='b'
							} else {
								$nodes.insertBefore($button)
								attached='t'
							}
							$nodes.offset({
								top: t,
								left: no.left,
							})
							$nodes.addClass('attached')
						},0)
					} else {
						$button.removeClass('hide')
						$nodes.remove()
						$nodes=undefined
						attached=undefined
					}
				}).keydown(function(ev){
					if (!attached) return
					if (ev.keyCode==keyCodeUp && attached=='t') {
						$nodes.children().last().focus()
					} else if (ev.keyCode==keyCodeDown && attached=='b') {
						$nodes.children().first().focus()
					}
				})
				return $button
			}
			const writeTheadCell=cell=>{
				const $cell=$("<th>")
				setCellClasses($cell,cell)
				if (cell.node!==undefined) {
					$cell.append(data[cell.node].name)
					const parents=breadthWalk(dag,cell.node).reverse()
					let $parents
					if (parents.length>0) {
						$cell.append(
							" ",
							writeTheadButton($cell,"Add parent","Add one of parents of this node",'t',parents)
						)
					}
					const children=breadthWalk(idag,cell.node)
					if (children.length>0) {
						$cell.append(
							" ",
							writeTheadButton($cell,"Add child","Add one of children of this node",'b',children)
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
