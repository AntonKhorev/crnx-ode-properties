'use strict'

const UnorderedClassSubgraph=require('./unordered-class-subgraph')
const OrderedClassSubgraph=require('./ordered-class-subgraph')
const TheadLayout=require('./thead-layout')
const TrLayout=require('./tr-layout')
const data=require('./data')

const i18n=(id)=>{
	const strings={
		'trait.entity': "Associated entities",
		'trait.associatedHomogeneousEquation': "Associated homogeneous equation",
		'trait.characteristicEquation': "<a href='https://en.wikipedia.org/wiki/Characteristic_equation_(calculus)'>Characteristic equation</a>",

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

		'trait.transform': "Transforms to different types",
		'trait.orderReduction': "Order reduction",

		'trait.solutionMethod': "Solutions",
		'trait.generalSolutionMethod': "General solution",
		'trait.phaseSolutionMethod': "<a href='https://en.wikipedia.org/wiki/Phase_space'>Phase space</a> trajectory",
		'trait.equilibriumSolutionMethod': "<a href='https://en.wikipedia.org/wiki/Equilibrium_point'>Equilibrium solutions</a>",
		'trait.testSolutionMethod': "Solution testing",
	}
	return strings[id]
}

$(function(){
	$('.crnx-ode-properties').each(function(){
		const $container=$(this)
		const selectedNodes={} // visible nodes // TODO rename to visibleNodes
		let traitAlignmentLevel=1
		const maxTraitAlignmentLevel=4
		for (let id in data.classes) {
			if (data.classes[id].importance<=1) {
				selectedNodes[id]=true
			}
		}
		const getHtmlName=id=>(data.classes[id].htmlName!==undefined
			? data.classes[id].htmlName
			: data.classes[id].name
		)

		let unorderedClassSubgraph,theadLayout,orderedClassSubgraph,trLayout
		const recomputeLayouts=()=>{
			unorderedClassSubgraph=new UnorderedClassSubgraph(data.classes,selectedNodes)
			theadLayout=new TheadLayout(unorderedClassSubgraph)
			orderedClassSubgraph=new OrderedClassSubgraph(unorderedClassSubgraph,theadLayout.columns)
			trLayout=new TrLayout(unorderedClassSubgraph,data.classes,theadLayout.columns)
		}
		recomputeLayouts()

		// TODO put into classSubgraph
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
		const writeTraitItemSection=(type,contents)=>{
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
		}
		const writeTraitItem=(forClassId,fromClassId,traitId)=>{
			const item=data.classes[fromClassId].traits[traitId]
			const sections=[]
			item.forEach(section=>{
				const type=section[0], contents=section[1]
				if (type=='form' && forClassId!=fromClassId) {
					sections.push(writeTraitItemSection('note',[
						"when equation is written as <em>"+getHtmlName(fromClassId)+"</em>:",
						"\\["+data.classes[fromClassId].equation+"\\]",
					]))
				} else if (contents) {
					sections.push(writeTraitItemSection(type,contents))
				}
			})
			if (sections.length>0 && item[0][0]!='title') {
				sections.unshift(writeTraitItemSection('title',[
					(item[item.length-1][0]=='compare'
						? "Property comparable to <em>"+i18n('trait.'+traitId)+"</em>"
						: i18n('trait.'+traitId)
					)
				]))
			}
			if (sections.length>0) {
				return $("<div class='trait'>").append(sections)
			}
		}
		const writeTraitCell=(forClassId,traitCell)=>{
			const $cell=$("<td>")
			if (traitCell.length>0) {
				$cell.append(traitCell.map(classTraitId=>{
					const classId=classTraitId[0]
					const traitId=classTraitId[1]
					return writeTraitItem(forClassId,classId,traitId)
				}))
			}
			return $cell
		}
		const writeTraitRow=(traitSubtree)=>{
			const traitCells=trLayout.getSubtreeLayout(traitSubtree)
			if (!traitCells) return null
			return $("<tr>").append(traitCells.map(
				(traitCell,i)=>writeTraitCell(theadLayout.columns[i],traitCell)
			))
		}
		const writeTable=()=>{
			const visibleAncestors={} // including self
			const computeVisibleAncestors=(id,aid)=>{
				visibleAncestors[id][aid]=true
				for (let naid in unorderedClassSubgraph.visibleParents[aid]) {
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
				recomputeLayouts()
				writeTable()
			}
			const addNode=id=>{
				selectedNodes[id]=true
				recomputeLayouts()
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
							id=>$("<li tabindex='0'>"+data.classes[id].name+"</li>").click(function(){
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
					const ancestors=breadthWalk(unorderedClassSubgraph.allParents,cell.node).reverse()
					if (ancestors.length>0) {
						$cell.append(
							" ",
							writeTheadButton($cell,"Add ancestor","Add one of supertypes of this equation type",'t',ancestors)
						)
					}
					const descendants=breadthWalk(unorderedClassSubgraph.allChildren,cell.node)
					if (descendants.length>0) {
						$cell.append(
							" ",
							writeTheadButton($cell,"Add descendant","Add one of subtypes of this equation type",'b',descendants)
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
			const writeTraitRows=()=>{
				const output=[]
				const rec=(traitSubtree,depth)=>{
					const traitId=traitSubtree[0]
					const traitChildren=traitSubtree[1]
					if (depth>=traitAlignmentLevel || !traitChildren) {
						output.push(writeTraitRow(traitSubtree))
					} else {
						traitChildren.forEach(traitChild=>rec(traitChild,depth+1))
					}
				}
				rec(['root',data.traits],0)
				return output
			}
			const writeTraitAlignmentControls=()=>{
				const $container=$("<form>Trait alignment level:</form>")
				for (let i=0;i<=maxTraitAlignmentLevel;i++) {
					$container.append(
						" ",
						$("<label>").append(
							$("<input type='radio' name='trait-alignment-level'>").prop('checked',i==traitAlignmentLevel).click(function(){
								traitAlignmentLevel=i
								writeTable()
							}),
							" "+i
						)
					)
				}
				return $container
			}
			const writeEquation=(id)=>{
				$equations[id]=$("<div class='equation'>").append("\\["+data.classes[id].equation+"\\]")
				if (data.classes[id].vectorEquation) {
					$equations[id].append("<div class='alt-separator'>or in vector format</div>","\\["+data.classes[id].vectorEquation+"\\]")
				}
				$equations[id].hover(function(){
					for (let aid in visibleAncestors[id]) {
						$equations[aid].addClass('highlight')
					}
				},function(){
					for (let aid in visibleAncestors[id]) {
						$equations[aid].removeClass('highlight')
					}
				})
				return $equations[id]
			}
			$container.empty().append(
				$("<table>").append(
					writeThead(),
					writeTfoot(),
					$("<tbody>").append(
						$("<tr>").append( // equations
							theadLayout.columns.map(id=>{
								const $td=$("<td>").append(writeEquation(id))
								const notes=[]
								if (data.classes[id].equationNotes!==undefined) {
									notes.push(...data.classes[id].equationNotes.map(
										noteText=>$("<div class='note'>").append(noteText)
									))
								}
								const columnParents=orderedClassSubgraph.visibleParents[id]
								if (columnParents.length>0) {
									notes.push(
										$("<div class='note'>").append(
											"can also be written as and has all properties of:",
											$("<ul>").append(columnParents.map(pid=>{
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
						writeTraitRows()
					)
				),
				writeTraitAlignmentControls(),
				"<p>General notes:</p>",
				$("<ul>").append(
					`<li>how to read the diagram: <ul>`+
						`<li>equation type names are written among arrows that show the relationship between types</li>`+
						`<li>properties of an equation type are listed in the table column below its name</li>`+
						`<li>every property of the equation type on the tip of the arrow <span class='arrow'></span> is also true for the equation type on the other end of the arrow (like <a href='https://en.wikipedia.org/wiki/Class_diagram'>class diagram</a>)</li>`+
					`</ul></li>`,
					`<li>all functions have to be continuous on the interval of interest</li>`,
					`<li>\\( y \\), \\( y_1 \\), \\( y_p \\) and \\( y \\) or \\( z \\) with any other subscript is a function of \\( t \\); other functions are written with an argument like this: \\( f(t) \\)</li>`,
					`<li>\\( C \\), \\( K \\) and other uppercase letters are arbitrary constants</li>`,
					`<li>\\( \\int\\!f(t)\\,\\mathrm{d}t + C \\) is a family of antiderivatives of \\( f(t) \\) with parameter \\( C \\)</li>`,
					`<li>\\( \\int\\!f(t)\\,\\mathrm{d}t \\) is any single antiderivative of \\( f(t) \\)`
				)
			)
			MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
		}
		writeTable()
	})
})
