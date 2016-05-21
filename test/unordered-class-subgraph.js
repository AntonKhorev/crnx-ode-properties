'use strict'

const assert=require('assert')
const UnorderedClassGraph=require('../src/unordered-class-subgraph')

const convertParentsToData=(parents)=>{
	const data={}
	for (let id in parents) {
		data[id]={
			parents: parents[id],
		}
	}
	return data
}

describe("convertParentsToData",()=>{
	it("validated parents to data conversion",()=>{
		const data=convertParentsToData({
			'A':{},
			'B':{'A':true},
			'C':{'A':true},
		})
		assert.deepEqual(data,{
			'A': {
				parents: {},
			},
			'B': {
				parents: {'A':true},
			},
			'C': {
				parents: {'A':true},
			},
		})
	})
})

describe("UnorderedClassSubgraph",()=>{
	it("selects node from node",()=>{
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData({
			'A':{},
		}),{
			'A':true,
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			'A':{},
		})
	})
	it("selects 2 nodes from 2 nodes",()=>{
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData({
			'A':{},
			'B':{},
		}),{
			'A':true,
			'B':true,
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			'A':{},
			'B':{},
		})
	})
	it("selects 2 nodes (reversed) from 2 nodes",()=>{
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData({
			'B':{},
			'A':{},
		}),{
			'B':true,
			'A':true,
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			'A':{},
			'B':{},
		})
	})
	it("selects chain from chain",()=>{
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData({
			'A':{},
			'B':{'A':true},
		}),{
			'A':true,
			'B':true,
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			'A':{},
			'B':{'A':true},
		})
	})
	it("selects node from chain",()=>{
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData({
			'A':{},
			'B':{'A':true},
		}),{
			'B':true,
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			'B':{},
		})
	})
	it("selects 2 chains from 2 chains",()=>{
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData({
			'A':{},
			'B':{},
			'C':{'A':true},
			'D':{'B':true},
		}),{
			'A':true,
			'B':true,
			'C':true,
			'D':true,
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			'A':{},
			'B':{},
			'C':{'A':true},
			'D':{'B':true},
		})
	})
	it("selects 2 chains (reversed) from 2 chains",()=>{
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData({
			'A':{},
			'B':{},
			'C':{'B':true},
			'D':{'A':true},
		}),{
			'A':true,
			'B':true,
			'C':true,
			'D':true,
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			'A':{},
			'B':{},
			'C':{'B':true},
			'D':{'A':true},
		})
	})
	it("selects fork from fork",()=>{
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData({
			'A':{},
			'B':{'A':true},
			'C':{'A':true},
		}),{
			'A':true,
			'B':true,
			'C':true,
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			'A':{},
			'B':{'A':true},
			'C':{'A':true},
		})
	})
	it("selects chain from fork",()=>{
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData({
			'A':{},
			'B':{'A':true},
			'C':{'A':true},
		}),{
			'A':true,
			'C':true,
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			'A':{},
			'C':{'A':true},
		})
	})
	it("selects 2 nodes from fork",()=>{
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData({
			'A':{},
			'B':{'A':true},
			'C':{'A':true},
		}),{
			'B':true,
			'C':true,
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			'B':{},
			'C':{},
		})
	})
	it("selects diamond from diamond",()=>{
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData({
			'A':{},
			'B':{'A':true},
			'C':{'A':true},
			'D':{'B':true,'C':true},
		}),{
			'A':true,
			'B':true,
			'C':true,
			'D':true,
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			'A':{},
			'B':{'A':true},
			'C':{'A':true},
			'D':{'B':true,'C':true},
		})
	})
	it("selects 3-chain from diamond",()=>{
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData({
			'A':{},
			'B':{'A':true},
			'C':{'A':true},
			'D':{'B':true,'C':true},
		}),{
			'A':true,
			'B':true,
			'D':true,
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			'A':{},
			'B':{'A':true},
			'D':{'B':true},
		})
	})
	it("selects И-shape from И-shape",()=>{
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData({
			'A':{},
			'B':{},
			'C':{'A':true,'B':true},
			'D':{'B':true},
		}),{
			'A':true,
			'B':true,
			'C':true,
			'D':true,
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			'A':{},
			'B':{},
			'C':{'A':true,'B':true},
			'D':{'B':true},
		})
	})
})
