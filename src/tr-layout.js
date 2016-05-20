'use strict'

// returns list of cells: list of (class id, trait id)
// 	class id = which class to take property from
// returns null if row is to be skipped
module.exports=(traitSubtree,classIds,classData)=>{
	const hasClose=(classId,traitId)=>{
		const trait=classData[classId].traits[traitId]
		if (!trait) return false
		return trait.some(section=>section[0]=='close')
	}

	const cells=classIds.map(classId=>{
		const masked={}
		const maskAncestors=id=>{
			if (masked[id]) return
			masked[id]=true
			Object.keys(classData[id].parents).forEach(pid=>{
				maskAncestors(pid)
			})
		}
		const reachToMaskAncestors=id=>{
			if (masked[id]) return
			Object.keys(classData[id].parents).forEach(pid=>{
				if (classIds.indexOf(pid)>=0) { // parent is visible
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
				for (let parent in classData[id].parents) {
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
				if (classData[id].traits[traitId]) {
					if (hasClose(id,traitId)) {
						//if (hasVisibleParentsWithTrait(traitId)) {
							cell.push([id,traitId])
						//}
					} else {
						cell.push([id,traitId])
					}
				} else {
					Object.keys(classData[id].parents).sort().forEach(walkAncestors)
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
