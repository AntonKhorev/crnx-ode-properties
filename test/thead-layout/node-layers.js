'use strict'

const assert=require('assert')
const makeNodeLayers=require('../../src/thead-layout/node-layers')

describe("makeNodeLayers",()=>{
	it("selects node",()=>{
		const result=makeNodeLayers({
			A:{},
		},[
			{A:true},
		])
		assert.deepEqual(result,[
			['A'],
		])
	})
	it("selects 2 nodes",()=>{
		const result=makeNodeLayers({
			A:{},
			B:{},
		},[
			{A:true,B:true}
		])
		assert.deepEqual(result,[
			['A','B'],
		])
	})
	it("selects 2 nodes (reversed)",()=>{
		const result=makeNodeLayers({
			B:{},
			A:{},
		},[
			{B:true,A:true}
		])
		assert.deepEqual(result,[
			['A','B'],
		])
	})
	it("selects chain",()=>{
		const result=makeNodeLayers({
			A:{},
			B:{A:true},
		},[
			{A:true},
			{B:true},
		])
		assert.deepEqual(result,[
			['A'],
			['B'],
		])
	})
	it("selects 2 chains",()=>{
		const result=makeNodeLayers({
			A:{},
			B:{},
			C:{A:true},
			D:{B:true},
		},[
			{A:true,B:true},
			{C:true,D:true},
		])
		assert.deepEqual(result,[
			['A','B'],
			['C','D'],
		])
	})
	it("selects 2 chains (reversed)",()=>{
		const result=makeNodeLayers({
			A:{},
			B:{},
			C:{B:true},
			D:{A:true},
		},[
			{A:true,B:true},
			{C:true,D:true},
		])
		assert.deepEqual(result,[
			['A','B'],
			['D','C'],
		])
	})
	it("selects fork",()=>{
		const result=makeNodeLayers({
			A:{},
			B:{A:true},
			C:{A:true},
		},[
			{A:true},
			{B:true,C:true},
		])
		assert.deepEqual(result,[
			['A'],
			['B','C'],
		])
	})
	it("selects diamond",()=>{
		const result=makeNodeLayers({
			A:{},
			B:{A:true},
			C:{A:true},
			D:{B:true,C:true},
		},[
			{A:true},
			{B:true,C:true},
			{D:true},
		])
		assert.deepEqual(result,[
			['A'],
			['B','C'],
			['D'],
		])
	})
	it("selects И-shape from И-shape",()=>{
		const result=makeNodeLayers({
			A:{},
			B:{},
			C:{A:true,B:true},
			D:{B:true},
		},[
			{A:true,B:true},
			{C:true,D:true},
		])
		assert.deepEqual(result,[
			['A','B'],
			['C','D'],
		])
	})
	it("selects N-shape from alpha-shape",()=>{
		const result=makeNodeLayers({
			A:{},
			B:{},
			C:{A:true,B:true},
			D:{A:true},
		},[
			{A:true,B:true},
			{C:true,D:true},
		])
		assert.deepEqual(result,[
			['A','B'],
			['D','C'],
		])
	})
	it("sorts more than 10 nodes",()=>{
		const result=makeNodeLayers({
			A0:{},
			A1:{},
			A2:{},
			A3:{},
			A4:{},
			A5:{},
			A6:{},
			A7:{},
			A8:{},
			A9:{},
			B0:{},
			C:{A2:true},
			D:{B0:true},
		},[
			{A0:true,A1:true,A2:true,A3:true,A4:true,A5:true,A6:true,A7:true,A8:true,A9:true,B0:true},
			{C:true,D:true},
		])
		assert.deepEqual(result,[
			['A0','A1','A2','A3','A4','A5','A6','A7','A8','A9','B0'],
			['C','D'],
		])
	})
})
