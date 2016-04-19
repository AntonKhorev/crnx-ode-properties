'use strict'

const makeNodeLabelLayersWithParents=require('./thead-layout/depth-list')
const makeArcLocationLayers=require('./thead-layout/arc-rows')
const makeLayoutLayers=require('./thead-layout/cell-layout')

class TheadLayout {
	constructor(dag,selectedNodes) {
		let t
		t=makeNodeLabelLayersWithParents(dag,selectedNodes)
		const nodeLabelLayers=t[0], parents=t[1]
		const arcLocationLayers=makeArcLocationLayers(nodeLabelLayers,parents)
		t=makeLayoutLayers(nodeLabelLayers,arcLocationLayers)
		this.columns=[].concat(...nodeLabelLayers)
		this.nodeLayers=t[0]
		this.arcLayers=t[1]
	}
}

module.exports=TheadLayout
