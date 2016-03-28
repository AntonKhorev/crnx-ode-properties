'use strict'

const assert=require('assert')
const arcRows=require('../src/arc-rows')

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

describe("dagRows",()=>{
	it("makes no arcs for node",()=>{
		const result=arcRows([
			['A'],
		],{
			'A':{},
		})
		assertArcRowsStructure(result,[
		])
	})
	it("makes combined arc for fork",()=>{
		const result=arcRows([
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
})
