'use strict'

// produces array of <tr>'s in this.$trs
// currently produces only one <tr> but this is going to change if alignment options are introduced
class FormRowsOutput {
	constructor(i18n,orderedClassSubgraph,theadLayout,classData,notation,$classHighlightables,formSelectCallback) {
		const writeEquations=(classId)=>{
			const $cell=$("<td>")
			classData[classId].forms.forEach((formData,i)=>{
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
			const columnParents=orderedClassSubgraph.visibleParents[classId] // TODO use thead-layout order
			if (columnParents.length>0) {
				$cell.append(
					$("<ul>").append(
						$("<li>").append(
							$("<div class='note'>").append(
								"can also be written as and has all properties of:",
								$("<ul>").append(columnParents.map(pid=>{
									const $li=$("<li>").append(
										$("<em>"+classData[pid].htmlName+"</em>").hover(function(){
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
		this.$trs=[
			$("<tr>").append(
				theadLayout.columns.map(writeEquations)
			),
		]
	}
}

module.exports=FormRowsOutput
