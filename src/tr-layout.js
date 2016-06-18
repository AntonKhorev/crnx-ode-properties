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
					if (!trait.close || ancestorsHaveIntegratedTrait(classId,traitId)) {
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

		// compared traits filtering
		const keepTraits={}
		cells.forEach(cell=>cell.forEach(classTraitId=>{
			const classId=classTraitId[0]
			const traitId=classTraitId[1]
			const trait=this.classData[classId].traits[traitId]
			if (!trait.compare) {
				keepTraits[traitId]=true
			}
		}))
		for (let i=0;i<cells.length;i++) {
			cells[i]=cells[i].filter(classTraitId=>{
				const traitId=classTraitId[1]
				return keepTraits[traitId]
			})
		}

		// empty row detection
		if (cells.some(cell=>cell.length>0)) {
			return cells
		} else {
			return null
		}
	}
}

module.exports=TrLayout
