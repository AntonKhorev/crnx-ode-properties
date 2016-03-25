'use strict'

// dag = {nodeLabel:{parentLabel:true,...},...}
// nodes = {nodeLabel:true,...}
module.exports=(dag,selectedNodes)=>{
	const ancestorDistances={} // {node:{ancestorNode:distance,...},...}; node is any node, ancestorNode is one of selectedNodes
	const depthList=[]
	const parents={}
	const addAncestorDistance=(fromNode,toNode,distance)=>{
		const oldDistance=ancestorDistances[fromNode][toNode]
		const newDistance=(oldDistance===undefined
			? distance
			: Math.max(distance,oldDistance)
		)
		ancestorDistances[fromNode][toNode]=newDistance
	}
	const traverseNode=node=>{
		if (parents[node]) {
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
		depthList[depth].push(node) // TODO sort by number of parents (desc), label (asc)
	}
	for (let node in selectedNodes) {
		traverseNode(node)
	}
	return [depthList,parents]
}
