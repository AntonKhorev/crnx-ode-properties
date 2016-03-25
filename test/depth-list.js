'use strict'

const assert=require('assert')
const depthList=require('../src/depth-list')

describe("depthList",()=>{
	it("selects node from node",()=>{
		const result=depthList({
			'A':{},
		},{
			'A':true,
		})
		assert.deepEqual(result,[[
			['A'],
		],{
			'A':{},
		}])
	})
	it("selects 2 nodes from 2 nodes",()=>{
		const result=depthList({
			'A':{},
			'B':{},
		},{
			'A':true,
			'B':true,
		})
		assert.deepEqual(result,[[
			['A','B'],
		],{
			'A':{},
			'B':{},
		}])
	})
	it("selects 2 nodes (reversed) from 2 nodes",()=>{
		const result=depthList({
			'B':{},
			'A':{},
		},{
			'B':true,
			'A':true,
		})
		assert.deepEqual(result,[[
			['A','B'],
		],{
			'A':{},
			'B':{},
		}])
	})
	it("selects chain from chain",()=>{
		const result=depthList({
			'A':{},
			'B':{'A':true},
		},{
			'A':true,
			'B':true,
		})
		assert.deepEqual(result,[[
			['A'],
			['B'],
		],{
			'A':{},
			'B':{'A':true},
		}])
	})
	it("selects node from chain",()=>{
		const result=depthList({
			'A':{},
			'B':{'A':true},
		},{
			'B':true,
		})
		assert.deepEqual(result,[[
			['B'],
		],{
			'B':{},
		}])
	})
	it("selects fork from fork",()=>{
		const result=depthList({
			'A':{},
			'B':{'A':true},
			'C':{'A':true},
		},{
			'A':true,
			'B':true,
			'C':true,
		})
		assert.deepEqual(result,[[
			['A'],
			['B','C'],
		],{
			'A':{},
			'B':{'A':true},
			'C':{'A':true},
		}])
	})
	it("selects chain from fork",()=>{
		const result=depthList({
			'A':{},
			'B':{'A':true},
			'C':{'A':true},
		},{
			'A':true,
			'C':true,
		})
		assert.deepEqual(result,[[
			['A'],
			['C'],
		],{
			'A':{},
			'C':{'A':true},
		}])
	})
	it("selects 2 nodes from fork",()=>{
		const result=depthList({
			'A':{},
			'B':{'A':true},
			'C':{'A':true},
		},{
			'B':true,
			'C':true,
		})
		assert.deepEqual(result,[[
			['B','C'],
		],{
			'B':{},
			'C':{},
		}])
	})
	it("selects diamond from diamond",()=>{
		const result=depthList({
			'A':{},
			'B':{'A':true},
			'C':{'A':true},
			'D':{'B':true,'C':true},
		},{
			'A':true,
			'B':true,
			'C':true,
			'D':true,
		})
		assert.deepEqual(result,[[
			['A'],
			['B','C'],
			['D'],
		],{
			'A':{},
			'B':{'A':true},
			'C':{'A':true},
			'D':{'B':true,'C':true},
		}])
	})
	it("selects 3-chain from diamond",()=>{
		const result=depthList({
			'A':{},
			'B':{'A':true},
			'C':{'A':true},
			'D':{'B':true,'C':true},
		},{
			'A':true,
			'B':true,
			'D':true,
		})
		assert.deepEqual(result,[[
			['A'],
			['B'],
			['D'],
		],{
			'A':{},
			'B':{'A':true},
			'D':{'B':true},
		}])
	})
	it("selects И-shape from И-shape",()=>{
		const result=depthList({
			'A':{},
			'B':{},
			'C':{'A':true,'B':true},
			'D':{'B':true},
		},{
			'A':true,
			'B':true,
			'C':true,
			'D':true,
		})
		assert.deepEqual(result,[[
			['A','B'],
			['C','D'],
		],{
			'A':{},
			'B':{},
			'C':{'A':true,'B':true},
			'D':{'B':true},
		}])
	})
	it("selects И-shape from N-shape",()=>{
		const result=depthList({
			'A':{},
			'B':{},
			'C':{'A':true},
			'D':{'A':true,'B':true},
		},{
			'A':true,
			'B':true,
			'C':true,
			'D':true,
		})
		assert.deepEqual(result,[[
			['A','B'],
			['D','C'],
		],{
			'A':{},
			'B':{},
			'C':{'A':true},
			'D':{'A':true,'B':true},
		}])
	})
})
