'use strict'

// dag = {nodeLabel:{parentLabel:true,...},...}
// nodes = {nodeLabel:true,...}
module.exports=(visibleParents,visibleDepthNodes)=>{
	// sort nodes at each depth by
	//	lexicographic parent order
	//	label
	const orderedVisibleDepthNodes=[]
	let nextParentOrder=0
	const parentOrder={}
	for (let depth in visibleDepthNodes) {
		orderedVisibleDepthNodes[depth]=Object.keys(visibleDepthNodes[depth])
		const sortedParents={}
		for (let node in visibleDepthNodes[depth]) {
			sortedParents[node]=Object.keys(visibleParents[node]).map(
				parentNode=>parentOrder[parentNode]
			).sort((a,b)=>a-b)
		}
		orderedVisibleDepthNodes[depth].sort((node0,node1)=>{
			const p0=sortedParents[node0]
			const p1=sortedParents[node1]
			for (let i=0;i<p0.length||i<p1.length;i++) {
				const cmpLen=(i<p0.length)-(i<p1.length)
				if (cmpLen!=0) {
					return cmpLen
				}
				const cmpOrd=p0[i]-p1[i]
				if (cmpOrd!=0) {
					return cmpOrd
				}
			}
			if (node0<node1) {
				return -1
			} else if (node0>node1) {
				return +1
			} else {
				return 0
			}
		})
		for (const node of orderedVisibleDepthNodes[depth]) {
			parentOrder[node]=nextParentOrder++
		}
	}
	return orderedVisibleDepthNodes
}
