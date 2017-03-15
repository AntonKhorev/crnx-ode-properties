'use strict'

// produces array of <tr>'s in this.$trs
class TraitRowsOutput {
	constructor(theadLayout,trLayout,traitsData,traitAlignmentLevel) {
		const writeTraitItem=(forClassId,fromClassId,traitId)=>{
			return `<div>${forClassId}<br>${fromClassId}<br>${traitId}</div>`
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
		this.$trs=[]
		const rec=(traitSubtree,depth)=>{
			const traitId=traitSubtree[0]
			const traitChildren=traitSubtree[1]
			if (depth>=traitAlignmentLevel || !traitChildren) {
				this.$trs.push(writeTraitRow(traitSubtree))
			} else {
				traitChildren.forEach(traitChild=>rec(traitChild,depth+1))
			}
		}
		rec(['root',traitsData],0)
	}
	updateForm(classId,form) {
		// TODO
	}
}

module.exports=TraitRowsOutput
