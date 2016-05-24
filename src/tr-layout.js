'use strict'

class TrLayout {
	constructor(classSubgraph,classData,classColumns) {
		this.classSubgraph=classSubgraph
		this.classData=classData
		this.classColumns=classColumns
	}

	// returns list of cells: list of (class id, trait id)
	// 	class id = which class to take property from
	// returns null if row is to be skipped
	getSubtreeLayout(traitSubtree) {
		const hasCloseSection=trait=>{
			return trait.some(section=>section[0]=='close')
		}
		const ancestorsHaveIntegratedTrait=(classId,traitId)=>{
			const visited={}
			const walk=classId=>{
				if (visited[classId]) return false
				visited[classId]=true
				if (getIntegratedClassesForTrait(classId,traitId).length>0) {
					return true
				}
				for (let vpid in this.classSubgraph.visibleParents[classId]) {
					if (walk(vpid)) {
						return true
					}
				}
				return false
			}
			for (let vpid in this.classSubgraph.visibleParents[classId]) {
				if (walk(vpid)) {
					return true
				}
			}
			return false
		}
		const getIntegratedClassesForTrait=(classId,traitId)=>{ // TODO memoize?
			const integratedClassIds=[]
			const visited={}
			const walk=id=>{
				if (visited[id]) return
				visited[id]=true
				const trait=this.classData[id].traits[traitId]
				if (trait) {
					if (!hasCloseSection(trait) || ancestorsHaveIntegratedTrait(classId,traitId)) {
						integratedClassIds.push(id)
					}
				} else {
					Object.keys(this.classSubgraph.integratedAncestors[classId][id]).sort().forEach(walk)
				}
			}
			walk(classId)
			return integratedClassIds
		}

		const cells=this.classColumns.map(classId=>{
			const cell=[]
			const walkTraits=(traitSubtree)=>{
				const traitId=traitSubtree[0]
				const traitChildren=traitSubtree[1]
				if (traitChildren) {
					traitChildren.forEach(walkTraits)
				} else {
					getIntegratedClassesForTrait(classId,traitId).forEach(id=>{
						cell.push([id,traitId])
					})
				}
			}
			walkTraits(traitSubtree)
			return cell
		})

		if (cells.some(cell=>cell.length>0)) {
			return cells
		} else {
			return null
		}
	}
}

module.exports=TrLayout
