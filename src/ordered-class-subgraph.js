'use strict'

// TODO maybe don't need this class - use iterators on unordered subgraph instead?
class OrderedClassGraph {
	constructor(unorderedClassGraph,orderedClasses) {
		const ranks={}
		orderedClasses.forEach((id,i)=>{
			ranks[id]=i
		})
		this.visibleParents={}
		for (let id in unorderedClassGraph.visibleParents) {
			this.visibleParents[id]=Object.keys(unorderedClassGraph.visibleParents[id]).sort((id1,id2)=>ranks[id1]-ranks[id2])
		}
	}
}

module.exports=OrderedClassGraph
