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
	// sort nodes at each depth by
	//	lexicographic parent order
	//	label
	let nextParentOrder=0
	const parentOrder={}
	for (let depth in depthList) {
		depthList[depth]=depthList[depth].map(node=>[
			Object.keys(parents[node]).map(parentNode=>parentOrder[parentNode]).sort(),
			node
		]).sort().map(x=>x[1])
		for (let i in depthList[depth]) {
			const node=depthList[depth][i]
			parentOrder[node]=nextParentOrder++
		}
	}
	return [depthList,parents]
}
