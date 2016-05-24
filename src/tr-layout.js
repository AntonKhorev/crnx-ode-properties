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
		const hasClose=(classId,traitId)=>{
			const trait=this.classData[classId].traits[traitId]
			if (!trait) return false
			return trait.some(section=>section[0]=='close')
		}

		const cells=this.classColumns.map(classId=>{
			/*
			const hasVisibleParentsWithVisibleOpenTrait=(traitId)=>{
				const reach=(id)=>{
					for (let parent in this.classData[id].parents) {
						if (
					}
				}
				return reach(classId)
			}
			*/

			const cell=[]
			const walkTraits=(traitSubtree)=>{
				const traitId=traitSubtree[0]
				const traitChildren=traitSubtree[1]
				const visited={}
				const walkAncestors=id=>{
					if (visited[id]) return
					visited[id]=true
					if (this.classData[id].traits[traitId]) {
						if (hasClose(id,traitId)) {
							//if (hasVisibleParentsWithTrait(traitId)) {
								cell.push([id,traitId])
							//}
						} else {
							cell.push([id,traitId])
						}
					} else {
						Object.keys(this.classSubgraph.integratedAncestors[classId][id]).sort().forEach(walkAncestors)
					}
				}
				if (traitChildren) {
					traitChildren.forEach(walkTraits)
				} else {
					walkAncestors(classId)
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
