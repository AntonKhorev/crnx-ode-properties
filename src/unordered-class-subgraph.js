'use strict'

class UnorderedClassGraph {
	constructor(classData,visibleClasses) {
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
			for (let parentNode in classData[node].parents) {
				traverseNode(parentNode)
				if (visibleClasses[parentNode]) {
					addAncestorDistance(node,parentNode,1)
				}
				for (let ancestorNode in ancestorDistances[parentNode]) {
					const parentDistance=ancestorDistances[parentNode][ancestorNode]
					addAncestorDistance(node,ancestorNode,parentDistance+!!visibleClasses[parentNode])
				}
			}
		}
		this.visibleParents={}
		for (let node in visibleClasses) {
			traverseNode(node)
			this.visibleParents[node]={}
			for (let ancestorNode in ancestorDistances[node]) {
				const distance=ancestorDistances[node][ancestorNode]
				if (distance==1) {
					this.visibleParents[node][ancestorNode]=true
				}
			}
		}
	}
}

module.exports=UnorderedClassGraph
