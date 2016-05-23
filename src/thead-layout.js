'use strict'

const makeNodeLabelLayers=require('./thead-layout/node-layers')
const makeArcLocationLayers=require('./thead-layout/arc-layers')
const makeLayoutLayers=require('./thead-layout/cell-layers')

class TheadLayout {
	constructor(unorderedClassGraph) {
		const orderedVisibleDepthNodes=makeNodeLabelLayers(unorderedClassGraph.visibleParents,unorderedClassGraph.visibleDepthNodes)
		const arcLocationLayers=makeArcLocationLayers(orderedVisibleDepthNodes,unorderedClassGraph.visibleParents)
		const t=makeLayoutLayers(orderedVisibleDepthNodes,arcLocationLayers)
		this.columns=[].concat(...orderedVisibleDepthNodes)
		this.nodeLayers=t[0]
		this.arcLayers=t[1]

		// TODO remove - replace by ordered subgraph
		const ranks={}
		this.columns.forEach((id,i)=>{
			ranks[id]=i
		})
		this.columnParents={}
		for (let id in unorderedClassGraph.visibleParents) {
			this.columnParents[id]=Object.keys(unorderedClassGraph.visibleParents[id]).sort((id1,id2)=>ranks[id1]-ranks[id2])
		}
	}
}

module.exports=TheadLayout
