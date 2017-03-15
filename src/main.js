'use strict'

const detailsPolyfill=require('crnx-base/details-polyfill')
const UnorderedClassSubgraph=require('./unordered-class-subgraph')
const OrderedClassSubgraph=require('./ordered-class-subgraph')
const TheadLayout=require('./thead-layout')
const TrLayout=require('./tr-layout')
const Notation=require('./notation')
const data=require('./data')
const TraitRowsOutput=require('./trait-rows-output')

const i18n=(id)=>{
	const strings={
		'trait.entity': "Associated entities",
		'trait.associatedHomogeneousEquation': "Associated homogeneous equation",
		'trait.characteristicEquation': "<a href='https://en.wikipedia.org/wiki/Characteristic_equation_(calculus)'>Characteristic equation</a>",
		'trait.halfLife': "<a href='https://en.wikipedia.org/wiki/Half-life'>Half-life</a>",

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

		// TODO remove
		'trait.transform': "Transforms to different types",
		'trait.orderReduction': "Order reduction",

		'trait.solutionMethod': "Solutions",
		'trait.generalSolutionMethod': "General solution",
		'trait.phaseSolutionMethod': "<a href='https://en.wikipedia.org/wiki/Phase_space'>Phase space</a> trajectory",
		'trait.equilibriumSolutionMethod': "<a href='https://en.wikipedia.org/wiki/Equilibrium_point'>Equilibrium solutions</a>",
		'trait.testSolutionMethod': "Solution testing",

		'trait.plot': "Plot",
	}
	return strings[id]
}

const mathjaxDetailsFixAndPolyfill=function(){
	detailsPolyfill.apply(this)
	$(this).on('toggle',function(){
		// mathjax common html renderer needs this to set correct font size
		// have to do it on every details opening, not just once b/c user can request redraw at any time
		// closed <details> behave like display:none; see http://stackoverflow.com/questions/36779037/mathjax-2-6-font-size-in-hidden-elements
		if ($(this).attr('open')) { // can't test for prop('open') when it's polyfilled
			MathJax.Hub.Queue(["Rerender",MathJax.Hub,this])
		}
	})
}

$(function(){
	$('.crnx-ode-properties').each(function(){
		const $container=$(this).empty()
		const selectedNodes={} // visible nodes // TODO rename to visibleNodes

		// options
		let traitAlignmentLevel=1
		const maxTraitAlignmentLevel=4
		let dependentVariables='yvz'
		const availableDependentVariables=['xyw','yvz']
		const viewDependentVariables={
			xyw: `\\( x \\), \\( y \\), \\( w \\)`,
			yvz: `\\( y \\), \\( v \\), \\( z \\)`,
		}
		let notation=new Notation(dependentVariables)

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
		const writeTraitItem=(forClassId,fromClassId,traitId)=>{
			const item=data.classes[fromClassId].traits[traitId]
			if (!item.content) return
			const getTitle=()=>{
				if (item.title!==undefined) {
					return item.title
				} else if (item.compare) {
					return "Property comparable to <em>"+i18n('trait.'+traitId)+"</em>"
				} else {
					return i18n('trait.'+traitId)
				}
			}
			const $item=$("<details class='trait'>").append(
				$("<summary>").append(getTitle())
			).each(mathjaxDetailsFixAndPolyfill)
			const rec=(line)=>{
				if (typeof line == 'string') {
					return $("<div class='line'>").append(line)
				} else if (typeof line == 'function') {
					return line()
				} else if (line.type=='derivation' || line.type=='proof' || line.type=='example' || line.type=='case') {
					return $("<details>").append(
						$("<summary>").append(line.title!==undefined ? line.title : line.type),
						line.content.map(rec)
					).each(mathjaxDetailsFixAndPolyfill)
				} else if (line.type=='switch') {
					return $("<div class='"+line.type+"'>").append(
						$("<div class='condition'>").append(line.title!==undefined ? line.title : line.type,':'),
						$("<div class='cases'>").append(
							line.content.map(rec)
						)
					)
				} else {
					return $("<div class='"+line.type+"'>").append(
						line.content.map(rec)
					)
				}
			}
			if (item.form) {
				const forClass=data.classes[forClassId]
				let forForm=forClassId
				if (forClass.hasForm!==undefined) {
					forForm=forClass.hasForm
				}
				let fromForms={
					[fromClassId]: true,
				}
				if (item.form!==true) {
					fromForms=item.form
				}
				if (!fromForms[forForm]) {
					$item.append(
						rec({type:'note',content:[
							"when equation is written as <em>"+getHtmlName(fromClassId)+"</em>:",
							"\\["+data.classes[fromClassId].equation+"\\]",
						]})
					)
				}
			}
			$item.append(item.content.map(rec))
			return $item
		}

		let $tableContainer,$quickSelect,$quickSelectButton
		const updateQuickSelectButton=()=>{
			const id=$quickSelect.val()
			$quickSelectButton.text(selectedNodes[id]
				? "Delete"
				: "Add"
			)
		}
		const deleteNode=id=>{
			delete selectedNodes[id]
			$quickSelect.children(`[value="${id}"]`).removeClass('added')
			updateQuickSelectButton()
			recomputeLayouts()
			writeTable()
		}
		const addNode=id=>{
			selectedNodes[id]=true
			$quickSelect.children(`[value="${id}"]`).addClass('added')
			updateQuickSelectButton()
			recomputeLayouts()
			writeTable()
		}
		const writeQuickSelectControls=()=>{
			const $div=$("<div>").append(
				$quickSelect=$("<select>").append(
					Object.keys(data.classes).sort().map(id=>{
						const $option=$("<option>").val(id).text(data.classes[id].name)
						if (selectedNodes[id]) {
							$option.addClass('added')
						}
						return $option
					})
				).change(function(){
					updateQuickSelectButton()
				}),
				" ",
				$quickSelectButton=$("<button>").click(function(){
					const id=$quickSelect.val()
					if (selectedNodes[id]) {
						deleteNode(id)
					} else {
						addNode(id)
					}
				}),
				" ",
				$("<button>Clear all</button>").click(function(){
					for (let id in selectedNodes) {
						delete selectedNodes[id]
					}
					$quickSelect.children().removeClass('added')
					updateQuickSelectButton()
					recomputeLayouts()
					writeTable()
				})
			)
			updateQuickSelectButton()
			return $div
		}
		const writeTable=()=>{ // TODO rename (doesn't return object)
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
			const $classHighlightables={}
			let $attachedMenu, $attachedToButton, attachedDirection, attachTimeoutId
			const setCellClasses=($cell,cell)=>{
				for (let dir of ['b','t','bt','rl','rt','bl']) {
					if (cell[dir]) {
						$cell.addClass(dir)
					}
				}
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
					const id=cell.node
					$classHighlightables[id]=$cell
					$cell.append(getHtmlName(id))
					const ancestors=breadthWalk(unorderedClassSubgraph.allParents,id).reverse()
					if (ancestors.length>0) {
						$cell.append(
							" ",
							writeTheadButton($cell,"Add ancestor","Add one of supertypes of this equation type",'t',ancestors)
						)
					}
					const descendants=breadthWalk(unorderedClassSubgraph.allChildren,id)
					if (descendants.length>0) {
						$cell.append(
							" ",
							writeTheadButton($cell,"Add descendant","Add one of subtypes of this equation type",'b',descendants)
						)
					}
					$cell.hover(function(){
						for (let aid in visibleAncestors[id]) {
							$classHighlightables[aid].addClass('highlight')
						}
					},function(){
						for (let aid in visibleAncestors[id]) {
							$classHighlightables[aid].removeClass('highlight')
						}
					})
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
			const writeDependentVariablesControls=()=>{
				// TODO text inputs with
				//	suggested names: u, v, w, x, y, z
				//	examples: x,y,w; y,v,z
				const $container=$("<form>Dependent variables notation (main variable, second variable in 2d system, substitution variable):</form>")
				for (let dvs of availableDependentVariables) {
					$container.append(
						" ",
						$("<label>").append(
							$("<input type='radio' name='dependent-variables'>").prop('checked',dvs==dependentVariables).click(function(){
								dependentVariables=dvs
								notation=new Notation(dependentVariables)
								writeTable()
							}),
							" "+viewDependentVariables[dvs]
						)
					)
				}
				return $container
			}
			const writeEquations=(id)=>{
				const $cell=$("<td>")
				data.classes[id].forms.forEach((formData,i)=>{
					if (i) {
						$cell.append(
							"<div class='alt-separator'>or</div>"
						)
					}
					$cell.append(
						$("<div class='equation'>").append("\\["+formData.equation(notation)+"\\]")
					)
					if (formData.notes!==undefined) {
						$cell.append(
							$("<ul>").append(
								formData.notes(notation).map(
									noteText=>`<li><div class='note'>${noteText}</div></li>`
								)
							)
						)
					}
				})
				const columnParents=orderedClassSubgraph.visibleParents[id]
				if (columnParents.length>0) {
					$cell.append(
						$("<ul>").append(
							$("<li>").append(
								$("<div class='note'>").append(
									"can also be written as and has all properties of:",
									$("<ul>").append(columnParents.map(pid=>{
										const $li=$("<li>").append(
											$("<em>"+getHtmlName(pid)+"</em>").hover(function(){
												$classHighlightables[pid].addClass('highlight')
												$li.addClass('highlight')
											},function(){
												$li.removeClass('highlight')
												$classHighlightables[pid].removeClass('highlight')
											})
										)
										return $li
									}))
								)
							)
						)
					)
				}
				return $cell
			}
			const writeGeneralNotes=()=>{
				const nt=notation
				return $("<ul>").append(
					`<li>how to read the diagram: <ul>`+
						`<li>equation type names are written among arrows that show the relationship between types</li>`+
						`<li>properties of an equation type are listed in the table column below its name</li>`+
						`<li>every property of the equation type on the tip of the arrow <span class='arrow'></span> is also true for the equation type on the other end of the arrow (like <a href='https://en.wikipedia.org/wiki/Class_diagram'>class diagram</a>)</li>`+
					`</ul></li>`,
					`<li>all functions have to be continuous on the interval of interest</li>`,
					`<li>\\( ${nt.x} \\), \\( ${nt.y} \\) or \\( ${nt.w} \\) possibly with a subscript is a function of \\( t \\); other functions are written with an argument like this: \\( f(t) \\)</li>`,
					`<li>\\( C \\), \\( K \\) and other uppercase letters are arbitrary constants</li>`,
					`<li>\\( \\int\\!f(t)\\,\\mathrm{d}t + C \\) is a family of antiderivatives of \\( f(t) \\) with parameter \\( C \\)</li>`,
					`<li>\\( \\int\\!f(t)\\,\\mathrm{d}t \\) is any single antiderivative of \\( f(t) \\)`
				)
			}
			$tableContainer.empty()
			const traitRowsOutput=new TraitRowsOutput(theadLayout,trLayout,data.traits,traitAlignmentLevel)
			if (Object.keys(selectedNodes).length>0) $tableContainer.append(
				$("<table class='classes'>").append(
					writeThead(),
					writeTfoot(),
					$("<tbody>").append(
						$("<tr>").append( // equations
							theadLayout.columns.map(writeEquations)
						),
						traitRowsOutput.$trs
					)
				)
			)
			$tableContainer.append(
				writeTraitAlignmentControls(),
				writeDependentVariablesControls(),
				"<p>General notes:</p>",
				writeGeneralNotes()
			)
			MathJax.Hub.Queue(["Typeset",MathJax.Hub]) // TODO pass table container
		}
		$container.append(
			writeQuickSelectControls(),
			$tableContainer=$("<div>")
		)
		writeTable()
	})
})
