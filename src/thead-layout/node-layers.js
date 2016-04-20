'use strict'

// dag = {nodeLabel:{parentLabel:true,...},...}
// nodes = {nodeLabel:true,...}
module.exports=(dag,selectedNodes)=>{
	const ancestorDistances={} // {node:{ancestorNode:distance,...},...}; node is any node, ancestorNode is one of selectedNodes
	const addAncestorDistance=(fromNode,toNode,distance)=>{
		const oldDistance=ancestorDistances[fromNode][toNode]
		const newDistance=(oldDistance===undefined
			? distance
			: Math.max(distance,oldDistance)
		)
		ancestorDistances[fromNode][toNode]=newDistance
	}
	const traverseNode=node=>{
		if (ancestorDistances[node]) {
			return // already visited
		}
		ancestorDistances[node]={}
		for (let parentNode in dag[node]) {
			traverseNode(parentNode)
			if (selectedNodes[parentNode]) {
				addAncestorDistance(node,parentNode,1)
			}
			for (let ancestorNode in ancestorDistances[parentNode]) {
				const parentDistance=ancestorDistances[parentNode][ancestorNode]
				addAncestorDistance(node,ancestorNode,parentDistance+!!selectedNodes[parentNode])
			}
		}
	}
	const depthList=[]
	const parents={}
	for (let node in selectedNodes) {
		traverseNode(node)
		let depth=0
		parents[node]={}
		for (let ancestorNode in ancestorDistances[node]) {
			const distance=ancestorDistances[node][ancestorNode]
			if (distance>depth) {
				depth=distance
			}
			if (distance==1) {
				parents[node][ancestorNode]=true
			}
		}
		if (depthList[depth]===undefined) {
			depthList[depth]=[]
		}
		depthList[depth].push(node)
	}

	// TODO separate fn
	// sort nodes at each depth by
	//	lexicographic parent order
	//	label
	let nextParentOrder=0
	const parentOrder={}
	for (let depth in depthList) {
		const sortedParents={}
		depthList[depth].forEach(node=>{
			sortedParents[node]=Object.keys(parents[node]).map(
				parentNode=>parentOrder[parentNode]
			).sort((a,b)=>a-b)
		})
		depthList[depth].sort((node0,node1)=>{
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
		for (let i in depthList[depth]) {
			const node=depthList[depth][i]
			parentOrder[node]=nextParentOrder++
		}
	}
	return [depthList,parents]
}
