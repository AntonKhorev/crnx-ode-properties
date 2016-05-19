'use strict'

const TheadLayout=require('./thead-layout')
const data=require('./data')

const i18n=(id)=>{
	const strings={
		'trait.entity': "Associated entities",
		'trait.associatedHomogeneousEquation': "Associated homogeneous equation",

		'trait.property': "Properties",
		'trait.isoclineProperty': "Property of <a href='https://en.wikipedia.org/wiki/Isocline'>isoclines</a>",
		'trait.solutionRelation': "Solution relation properties",
		'trait.shiftSolutionRelation': "Time/value shifts of solutions",
		'trait.linearitySolutionRelation': "Linear/affine properties of solutions",
		'trait.solutionSpaceBasis': "Basis of the solution space",
		'trait.homogeneitySolutionRelation': "Homogeneity of solutions",
		'trait.additivitySolutionRelation': "Additivity of solutions",
		'trait.twoLinearCombinationSolutionRelation': "<a href='https://en.wikipedia.org/wiki/Linear_combination'>Linear combination</a> property of solutions",
		'trait.nLinearCombinationSolutionRelation': "<a href='https://en.wikipedia.org/wiki/Linear_combination'>Linear combination</a> property of solutions",
		'trait.twoAffineCombinationSolutionRelation': "<a href='https://en.wikipedia.org/wiki/Affine_combination'>Affine combination</a> property of solutions",
		'trait.nAffineCombinationSolutionRelation': "<a href='https://en.wikipedia.org/wiki/Affine_combination'>Affine combination</a> property of solutions",
		'trait.associatedSolutionRelation': "Associated homogeneous equation solution",

		'trait.solutionMethod': "Solutions",
		'trait.generalSolutionMethod': "General solution",
		'trait.equilibriumSolutionMethod': "<a href='https://en.wikipedia.org/wiki/Equilibrium_point'>Equilibrium solutions</a>",
		'trait.testSolutionMethod': "Solution testing",
	}
	return strings[id]
}

$(function(){
	$('.crnx-ode-properties').each(function(){
		const $container=$(this)
		const dag={}, idag={} // TODO naming of completeDag, visibleDag; completeIDag, visibleIDag
		const selectedNodes={} // visible nodes // TODO rename to visibleNodes
		for (let id in data) {
			if (data[id].importance<=1) {
				selectedNodes[id]=true
			}
			dag[id]=data[id].parents
			idag[id]={}
		}
		for (let id in data) {
			for (let pid in dag[id]) {
				idag[pid][id]=true
			}
		}
		const getHtmlName=id=>(data[id].htmlName!==undefined
			? data[id].htmlName
			: data[id].name
		)

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
		const writeData=(name,id)=>{
			const output=[]

			// mark ancestors of visible ancestors as visited
			const visited={}
			const markAncestors=id=>{
				if (visited[id]) return
				visited[id]=true
				Object.keys(data[id].parents).forEach(pid=>{
					markAncestors(pid)
				})
			}
			const reachAncestors=id=>{
				if (visited[id]) return
				Object.keys(data[id].parents).forEach(pid=>{
					if (selectedNodes[pid]) {
						markAncestors(pid)
					} else {
						reachAncestors(pid)
					}
				})
			}
			reachAncestors(id)

			const overrides={}
			const raiseOverride=iid=>{
				if (overrides[iid]===undefined) {
					overrides[iid]=0
				}
				overrides[iid]++
			}
			const lowerOverride=iid=>{
				overrides[iid]--
			}
			const rec=cid=>{
				visited[cid]=true
				const forOverrides=fn=>{
					if (data[cid][name]) {
						data[cid][name].forEach(item=>{
							item.forEach(section=>{
								const type=section[0]
								if (section[0]=='override') {
									const iids=section[1]
									iids.forEach(iid=>{
										fn(iid)
									})
								}
							})
						})
					}
				}
				// recursion on nodes that are not selected for display
				forOverrides(raiseOverride)
				Object.keys(data[cid].parents).sort().forEach(pid=>{
					if (!visited[pid]) {
						rec(pid)
					}
				})
				forOverrides(lowerOverride)
				// output of things that are not overridden by children
				if (data[cid][name]) {
					data[cid][name].forEach(item=>{
						let skip=false
						item.forEach(section=>{
							const type=section[0]
							if (type=='id') {
								const iid=section[1]
								if (overrides[iid]) {
									skip=true
								}
							}
						})
						if (skip) return
						const outItem=[]
						item.forEach(section=>{
							const type=section[0]
							if (type=='id' || type=='override') return
							if (type=='form') {
								if (cid!=id) {
									outItem.push(['note',[
										"when equation is written as <em>"+getHtmlName(cid)+"</em>:",
										"\\["+data[cid].equation+"\\]",
									]])
								}
							} else {
								outItem.push(section)
							}
						})
						if (outItem.length>0) {
							output.push(outItem)
						}
					})
				}
			}
			rec(id)
			if (output.length==0) return $()
			return $("<ul class='major'>").append(output.map(item=>{
				return $("<li>").append(item.map(section=>{
					const type=section[0], contents=section[1]
					const $section=$(`<div class='${type}'>`).append(contents.map(line=>{
						if (type=='title') {
							return $(`<div><em>${line}</em>:</div>`)
						} else {
							return $(`<div>${line}</div>`)
						}
					}))
					if (type=='detail') {
						const $b1=writeButton("Open","Expand details")
						const $b2=writeButton("Open","Expand details")
						$section.prepend($b1).append($b2)
						const $bs=$b1.add($b2)
						$bs.click(function(){
							if (!$section.hasClass('open')) {
								$section.addClass('open')
								$bs.html("<span>Close</span>").attr('title',"Collapse details")
							} else {
								$section.removeClass('open')
								$bs.html("<span>Open</span>").attr('title',"Expand details")
							}
						})
					}
					return $section
				}))
			}))
		}
		const writeTable=()=>{
			const visibleAncestors={} // including self
			const computeVisibleAncestors=(id,aid)=>{
				if (selectedNodes[aid]) {
					visibleAncestors[id][aid]=true
				}
				for (let naid in dag[aid]) {
					computeVisibleAncestors(id,naid)
				}
			}
			for (let id in selectedNodes) {
				visibleAncestors[id]={}
				computeVisibleAncestors(id,id)
			}

			const $equations={}
			let $attachedMenu, $attachedToButton, attachedDirection, attachTimeoutId

			const deleteNode=id=>{
				delete selectedNodes[id]
				theadLayout=new TheadLayout(dag,selectedNodes)
				writeTable()
			}
			const addNode=id=>{
				selectedNodes[id]=true
				theadLayout=new TheadLayout(dag,selectedNodes)
				writeTable()
			}
			const setCellClasses=($cell,cell)=>{
				;['b','t','bt','rl','rt','bl'].forEach(dir=>{
					if (cell[dir]) {
						$cell.addClass(dir)
					}
				})
			}
			const writeTheadButton=($cell,text,tip,dir,nodes)=>{
				const keyCodeEnter=13
				const keyCodeSpace=32
				const keyCodeUp=38
				const keyCodeDown=40
				const $button=writeButton(text,tip).addClass(dir).click(function(){
					const removeAttachedMenu=()=>{
						$attachedToButton.removeClass('attached-t attached-b')
						$attachedMenu.remove()
						clearTimeout(attachTimeoutId)
						$attachedToButton=undefined
						$attachedMenu=undefined
						attachedDirection=undefined
						attachTimeoutId=undefined
					}
					const startAttachingMenu=()=>{
						$attachedToButton=$button
						$attachedMenu=$("<ul>").append(nodes.map(
							id=>$("<li tabindex='0'>"+data[id].name+"</li>").click(function(){
								addNode(id)
							}).keydown(function(ev){
								if (!attachedDirection) return // not yet decided on attach direction (this can't happen)
								if (ev.keyCode==keyCodeUp) {
									const $toFocus=$(this).prev()
									if ($toFocus.length) {
										$toFocus.focus()
										return false
									} else if (attachedDirection=='b') {
										$button.focus()
										return false
									}
								} else if (ev.keyCode==keyCodeDown) {
									const $toFocus=$(this).next()
									if ($toFocus.length) {
										$toFocus.focus()
										return false
									} else if (attachedDirection=='t') {
										$button.focus()
										return false
									}
								} else if (ev.keyCode==keyCodeEnter || ev.keyCode==keyCodeSpace) {
									addNode(id)
									return false
								}
							})
						))
						$cell.append($attachedMenu)
						attachTimeoutId=setTimeout(()=>{ // can calculate height only after it's displayed
							const mh=$attachedMenu.outerHeight()
							const mo=$attachedMenu.offset()
							const bh=$button.outerHeight()
							const bo=$button.offset()
							let t=bo.top-mh+1
							if (dir!='t' || t<0) { // want below or doesn't fit to screen above the button
								t=bo.top+bh-1
								attachedDirection='b'
							} else {
								$attachedMenu.insertBefore($button)
								attachedDirection='t'
							}
							$attachedMenu.offset({
								top: t,
								left: mo.left,
							})
							$attachedMenu.addClass('attached')
							$button.addClass('attached-'+attachedDirection)
						},0)
					}
					if (!$button.is($attachedToButton)) {
						if ($attachedToButton) {
							removeAttachedMenu() // close menu opened elsewhere
						}
						startAttachingMenu()
					} else {
						removeAttachedMenu() // close menu here
					}
				}).keydown(function(ev){
					if ($button.is($attachedToButton)) {
						if (ev.keyCode==keyCodeUp && attachedDirection=='t') {
							$attachedMenu.children().last().focus()
							return false
						} else if (ev.keyCode==keyCodeDown && attachedDirection=='b') {
							$attachedMenu.children().first().focus()
							return false
						}
					}
				})
				return $button
			}
			const writeTheadCell=cell=>{
				const $cell=$("<th>")
				setCellClasses($cell,cell)
				if (cell.node!==undefined) {
					$cell.append(getHtmlName(cell.node))
					const parents=breadthWalk(dag,cell.node).reverse()
					let $parents
					if (parents.length>0) {
						$cell.append(
							" ",
							writeTheadButton($cell,"Add parent","Add one of supertypes of this equation type",'t',parents)
						)
					}
					const children=breadthWalk(idag,cell.node)
					if (children.length>0) {
						$cell.append(
							" ",
							writeTheadButton($cell,"Add child","Add one of subtypes of this equation type",'b',children)
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
							writeButton("Delete","Delete this equation type").click(function(){
								deleteNode(id)
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
						// equations
						$("<tr>").append(
							theadLayout.columns.map(id=>{
								const $td=$("<td>")
								$td.append(
									$equations[id]=$("<div class='equation'>\\["+data[id].equation+"\\]</div>").hover(function(){
										for (let aid in visibleAncestors[id]) {
											$equations[aid].addClass('highlight')
										}
									},function(){
										for (let aid in visibleAncestors[id]) {
											$equations[aid].removeClass('highlight')
										}
									})
								)
								const notes=[]
								if (data[id].equationNotes!==undefined) {
									notes.push(...data[id].equationNotes.map(
										noteText=>$("<div class='note'>").append(noteText)
									))
								}
								const parents=Object.keys(theadLayout.parents[id])
								if (parents.length>0) {
									notes.push(
										$("<div class='note'>").append(
											"can also be written as and has all properties of:",
											$("<ul>").append(parents.sort().map(pid=>{
												const $li=$("<li>").append(
													$("<em>"+getHtmlName(pid)+"</em>").hover(function(){
														$equations[pid].addClass('highlight')
														$li.addClass('highlight')
													},function(){
														$li.removeClass('highlight')
														$equations[pid].removeClass('highlight')
													})
												)
												return $li
											}))
										)
									)
								}
								if (notes.length>0) {
									$td.append($("<ul>").append(notes.map(
										note=>$("<li>").append(note)
									)))
								}
								return $td
							})
						),
						// properties
						$("<tr>").append(
							theadLayout.columns.map(id=>$("<td>").append(
								writeData('properties',id)
							))
						),
						// solutions
						$("<tr>").append(
							theadLayout.columns.map(id=>$("<td>").append(
								writeData('solutions',id)
							))
						)
					)
				),
				"<p>General notes:</p>",
				$("<ul>").append(
					`<li>how to read the diagram: <ul>`+
						`<li>equation type names are written among arrows that show the relationship between types</li>`+
						`<li>properties of an equation type are listed in the table column below its name</li>`+
						`<li>every property of the equation type on the tip of the arrow <span class='arrow'></span> is also true for the equation type on the other end of the arrow (like <a href='https://en.wikipedia.org/wiki/Class_diagram'>class diagram</a>)</li>`+
					`</ul></li>`,
					`<li>all functions have to be continuous on the interval of interest</li>`,
					`<li>\\( \\int\\!f(t)\\,\\mathrm{d}t + C \\) is a family of antiderivatives of \\( f(t) \\) with parameter \\( C \\)</li>`,
					`<li>\\( \\int\\!f(t)\\,\\mathrm{d}t \\) is any single antiderivative of \\( f(t) \\)`
				)
			)
			MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
		}
		writeTable()
	})
})
