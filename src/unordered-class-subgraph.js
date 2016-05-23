'use strict'

class UnorderedClassGraph {
	constructor(classData,visibleClasses) {
		const invertGraph=(graph)=>{
			const igraph={}
			for (let id in graph) {
				igraph[id]={}
			}
			for (let id in graph) {
				for (let pid in graph[id]) {
					igraph[pid][id]=true
				}
			}
			return igraph
		}

		// this.allParents and this.allChildren
		this.allParents={}
		for (let id in classData) {
			this.allParents[id]=classData[id].parents
		}
		this.allChildren=invertGraph(this.allParents)

		// this.visibleParents, this.visibleChildren, this.visibleDepthNodes
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
			for (let parentNode in this.allParents[node]) {
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
		this.visibleDepthNodes=[]
		this.visibleParents={}
		for (let node in visibleClasses) {
			traverseNode(node)
			let depth=0
			this.visibleParents[node]={}
			for (let ancestorNode in ancestorDistances[node]) {
				const distance=ancestorDistances[node][ancestorNode]
				if (distance>depth) {
					depth=distance
				}
				if (distance==1) {
					this.visibleParents[node][ancestorNode]=true
				}
			}
			if (this.visibleDepthNodes[depth]===undefined) {
				this.visibleDepthNodes[depth]={}
			}
			this.visibleDepthNodes[depth][node]=true
		}
		this.visibleChildren=invertGraph(this.visibleParents)

		// this.integratedAncestors = ancestors that are not (visible parents and/or ancestors of visible parents)
		this.integratedAncestors={}
		for (let cid in visibleClasses) {
			const masked={}
			const maskAncestors=id=>{
				if (masked[id]) return
				masked[id]=true
				for (let pid in this.allParents[id]) {
					maskAncestors(pid)
				}
			}
			for (let pid in this.visibleParents[cid]) {
				maskAncestors(pid)
			}
			this.integratedAncestors[cid]={}
			const integrateAncestors=id=>{
				if (this.integratedAncestors[cid][id]) return
				this.integratedAncestors[cid][id]={}
				for (let pid in this.allParents[id]) {
					if (!masked[pid]) {
						this.integratedAncestors[cid][id][pid]=true
						integrateAncestors(pid)
					}
				}
			}
			integrateAncestors(cid)
		}
	}
}

module.exports=UnorderedClassGraph
