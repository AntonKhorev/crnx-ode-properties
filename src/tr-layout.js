'use strict'

// returns list of cells: list of (class id, trait id)
// class id = which class to take property from
module.exports=(traitSubtree,classIds,classData)=>{
	return classIds.map(classId=>{
		const cell=[]
		const rec=(traitSubtree)=>{
			const traitId=traitSubtree[0]
			const traitChildren=traitSubtree[1]
			if (traitChildren) {
				traitChildren.forEach(rec)
			} else {
				cell.push([classId,traitId])
			}
		}
		rec(traitSubtree)
		return cell
	})
}
