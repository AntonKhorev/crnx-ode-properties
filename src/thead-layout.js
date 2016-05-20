'use strict'

const makeNodeLabelLayersWithParents=require('./thead-layout/node-layers')
const makeArcLocationLayers=require('./thead-layout/arc-layers')
const makeLayoutLayers=require('./thead-layout/cell-layers')

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

		const ranks={}
		this.columns.forEach((id,i)=>{
			ranks[id]=i
		})
		this.columnParents={}
		for (let id in parents) {
			this.columnParents[id]=Object.keys(parents[id]).sort((id1,id2)=>ranks[id1]-ranks[id2])
		}
	}
}

module.exports=TheadLayout
