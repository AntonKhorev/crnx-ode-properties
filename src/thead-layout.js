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
	}
}

module.exports=TheadLayout
