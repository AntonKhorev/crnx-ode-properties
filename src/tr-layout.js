'use strict'

class TrLayout {
	constructor(classIds,classData) {
		this.classIds=classIds
		this.classData=classData
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

		const cells=this.classIds.map(classId=>{
			const masked={}
			const maskAncestors=id=>{
				if (masked[id]) return
				masked[id]=true
				Object.keys(this.classData[id].parents).forEach(pid=>{
					maskAncestors(pid)
				})
			}
			const reachToMaskAncestors=id=>{
				if (masked[id]) return
				Object.keys(this.classData[id].parents).forEach(pid=>{
					if (this.classIds.indexOf(pid)>=0) { // parent is visible
						maskAncestors(pid)
					} else {
						reachToMaskAncestors(pid)
					}
				})
			}
			reachToMaskAncestors(classId) // mask visible ancestors and their ancestors - b/c they already have traits shown

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
					if (masked[id] || visited[id]) return
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
						Object.keys(this.classData[id].parents).sort().forEach(walkAncestors)
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
