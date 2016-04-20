'use strict'

const assert=require('assert')
const makeNodeLayers=require('../../src/thead-layout/node-layers')

describe("makeNodeLayers",()=>{
	it("selects node from node",()=>{
		const result=makeNodeLayers({
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
		const result=makeNodeLayers({
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
		const result=makeNodeLayers({
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
		const result=makeNodeLayers({
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
		const result=makeNodeLayers({
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
	it("selects 2 chains from 2 chains",()=>{
		const result=makeNodeLayers({
			'A':{},
			'B':{},
			'C':{'A':true},
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
			'C':{'A':true},
			'D':{'B':true},
		}])
	})
	it("selects 2 chains (reversed) from 2 chains",()=>{
		const result=makeNodeLayers({
			'A':{},
			'B':{},
			'C':{'B':true},
			'D':{'A':true},
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
			'C':{'B':true},
			'D':{'A':true},
		}])
	})
	it("selects fork from fork",()=>{
		const result=makeNodeLayers({
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
		const result=makeNodeLayers({
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
		const result=makeNodeLayers({
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
		const result=makeNodeLayers({
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
		const result=makeNodeLayers({
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
		const result=makeNodeLayers({
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
	it("selects N-shape from alpha-shape",()=>{
		const result=makeNodeLayers({
			'A':{},
			'B':{},
			'C':{'A':true,'B':true},
			'D':{'A':true},
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
			'C':{'A':true,'B':true},
			'D':{'A':true},
		}])
	})
	it("sorts more than 10 nodes",()=>{
		const result=makeNodeLayers({
			'A0':{},
			'A1':{},
			'A2':{},
			'A3':{},
			'A4':{},
			'A5':{},
			'A6':{},
			'A7':{},
			'A8':{},
			'A9':{},
			'B0':{},
			'C':{'A2':true},
			'D':{'B0':true},
		},{
			'A0':true,
			'A1':true,
			'A2':true,
			'A3':true,
			'A4':true,
			'A5':true,
			'A6':true,
			'A7':true,
			'A8':true,
			'A9':true,
			'B0':true,
			'C':true,
			'D':true,
		})
		assert.deepEqual(result,[[
			['A0','A1','A2','A3','A4','A5','A6','A7','A8','A9','B0'],
			['C','D'],
		],{
			'A0':{},
			'A1':{},
			'A2':{},
			'A3':{},
			'A4':{},
			'A5':{},
			'A6':{},
			'A7':{},
			'A8':{},
			'A9':{},
			'B0':{},
			'C':{'A2':true},
			'D':{'B0':true},
		}])
	})
})
