'use strict'

// returns list of cells: list of (class id, trait id)
// class id = which class to take property from
module.exports=(traitSubtree,classIds,classData)=>{
	return classIds.map(classId=>{
		const cell=[]
		const walkTraits=(traitSubtree)=>{
			const traitId=traitSubtree[0]
			const traitChildren=traitSubtree[1]

			const visited={}
			const markAncestors=id=>{
				if (visited[id]) return
				visited[id]=true
				Object.keys(classData[id].parents).forEach(pid=>{
					markAncestors(pid)
				})
			}
			const reachAncestors=id=>{
				if (visited[id]) return
				Object.keys(classData[id].parents).forEach(pid=>{
					if (classIds.indexOf(pid)>=0) {
						markAncestors(pid)
					} else {
						reachAncestors(pid)
					}
				})
			}

			const walkAncestors=id=>{
				if (visited[id]) return
				visited[id]=true
				if (classData[id].traits[traitId]) {
					cell.push([id,traitId])
				} else {
					Object.keys(classData[id].parents).sort().forEach(walkAncestors)
				}
			}

			if (traitChildren) {
				traitChildren.forEach(walkTraits)
			} else {
				reachAncestors(classId) // mark ancestors of visible ancestors as visited
				walkAncestors(classId)
			}
		}
		walkTraits(traitSubtree)

		return cell
	})
}
