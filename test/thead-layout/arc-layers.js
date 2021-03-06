'use strict'

const assert=require('assert')
const makeArcLayers=require('../../src/thead-layout/arc-layers')

const assertArcsExpandTo=(arcs,expectedExpandedArcs)=>{
	const expandedArcs=[]
	arcs.forEach(arc=>{
		const parents=arc[0], children=arc[1]
		parents.forEach(parent=>{
			children.forEach(child=>{
				expandedArcs.push([parent,child])
			})
		})
		expandedArcs.sort()
	})
	assert.deepEqual(expandedArcs,expectedExpandedArcs)
}

const assertArcRowsStructure=(arcRows,expectedStructure)=>{
	assert.equal(arcRows.length,expectedStructure.length,"unexpected number of arc rows")
	for (let i=0;i<arcRows.length;i++) {
		assert.equal(arcRows[i].length,expectedStructure[i][0],"unexpected number of arcs")
		assertArcsExpandTo(arcRows[i],expectedStructure[i][1])
	}
}

describe("assertArcsExpandTo",()=>{
	it("validates positive result",()=>{
		assertArcsExpandTo([
			[[1],[3]],
			[[0],[2,3]],
		],[
			[0,2],
			[0,3],
			[1,3],
		])
	})
	it("validates negative result",()=>{
		assert.throws(()=>
			assertArcsExpandTo([
				[[1],[3]],
				[[0],[2,3]],
			],[
			])
		)
	})
})

describe("assertArcRowsStructure",()=>{
	it("validates positive result",()=>{
		assertArcRowsStructure([
			[
				[[0],[1,2]]
			]
		],[
			[1,[[0,1],[0,2]]]
		])
	})
	it("validates negative result",()=>{
		assert.throws(()=>
			assertArcRowsStructure([
				[
					[[0],[1,2]]
				]
			],[
			])
		)
	})
})

describe("makeArcLayers",()=>{
	it("makes no arcs for node",()=>{
		const result=makeArcLayers([
			['A'],
		],{
			'A':{},
		})
		assertArcRowsStructure(result,[
		])
	})
	it("makes combined arc for fork",()=>{
		const result=makeArcLayers([
			['A'],
			['B','C'],
		],{
			'A':{},
			'B':{'A':true},
			'C':{'A':true},
		})
		assertArcRowsStructure(result,[
			[1,[[0,1],[0,2]]]
		])
	})
	it("makes combined arc for V-shape",()=>{
		const result=makeArcLayers([
			['A','B'],
			['C'],
		],{
			'A':{},
			'B':{},
			'C':{'A':true,'B':true},
		})
		assertArcRowsStructure(result,[
			[1,[[0,2],[1,2]]]
		])
	})
	it("makes 2 arcs for 2 chains",()=>{
		const result=makeArcLayers([
			['A','B'],
			['C','D'],
		],{
			'A':{},
			'B':{},
			'C':{'A':true},
			'D':{'B':true},
		})
		assertArcRowsStructure(result,[
			[2,[[0,2],[1,3]]]
		])
	})
	it("makes arcs for 3-chains",()=>{
		const result=makeArcLayers([
			['A'],
			['B'],
			['C'],
		],{
			'A':{},
			'B':{'A':true},
			'C':{'B':true},
		})
		assertArcRowsStructure(result,[
			[1,[[0,1]]],
			[1,[[1,2]]],
		])
	})
	it("makes 2 arcs for N-shape",()=>{
		const result=makeArcLayers([
			['A','B'],
			['C','D'],
		],{
			'A':{},
			'B':{},
			'C':{'A':true},
			'D':{'A':true,'B':true},
		})
		assertArcRowsStructure(result,[
			[2,[[0,2],[0,3],[1,3]]]
		])
	})
	it("makes combined arc for fully connected parents and children",()=>{
		const result=makeArcLayers([
			['A','B'],
			['C','D'],
		],{
			'A':{},
			'B':{},
			'C':{'A':true,'B':true},
			'D':{'A':true,'B':true},
		})
		assertArcRowsStructure(result,[
			[1,[[0,2],[0,3],[1,2],[1,3]]]
		])
	})
	it("supports unsorted parents",()=>{
		const result=makeArcLayers([
			['B','A'],
			['C'],
		],{
			'A':{},
			'B':{},
			'C':{'A':true,'B':true},
		})
		assert.deepEqual(result,[ // arc layers
			[ // arc rows
				[[0,1],[2]],
			]
		])
	})
	it("merges 3 children",()=>{
		const result=makeArcLayers([
			['separable'],
			['autonomous','linearHomogeneous','separableInT']
		],{
			'autonomous':{'separable':true},
			'linearHomogeneous':{'separable':true},
			'separable':{},
			'separableInT':{'separable':true},
		})
		assertArcRowsStructure(result,[
			[1,[[0,1],[0,2],[0,3]]]
		])
	})
})
