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
			A:{},
			B:{A:true},
			C:{A:true},
		})
		assert.deepEqual(data,{
			A: {
				parents: {},
			},
			B: {
				parents: {A:true},
			},
			C: {
				parents: {A:true},
			},
		})
	})
})

describe("UnorderedClassSubgraph",()=>{
	it("selects node from node",()=>{
		const dag={
			A:{},
		}
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData(dag),{
			A:true,
		})
		assert.deepEqual(unorderedClassGraph.allParents,dag)
		assert.deepEqual(unorderedClassGraph.allChildren,{
			A:{},
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			A:{},
		})
		assert.deepEqual(unorderedClassGraph.integratedAncestors,{
			A:{
				A:{},
			},
		})
	})
	it("selects 2 nodes from 2 nodes",()=>{
		const dag={
			A:{},
			B:{},
		}
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData(dag),{
			A:true,
			B:true,
		})
		assert.deepEqual(unorderedClassGraph.allParents,dag)
		assert.deepEqual(unorderedClassGraph.allChildren,{
			A:{},
			B:{},
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			A:{},
			B:{},
		})
		assert.deepEqual(unorderedClassGraph.integratedAncestors,{
			A:{
				A:{},
			},
			B:{
				B:{},
			},
		})
	})
	it("selects chain from chain",()=>{
		const dag={
			A:{},
			B:{A:true},
		}
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData(dag),{
			A:true,
			B:true,
		})
		assert.deepEqual(unorderedClassGraph.allParents,dag)
		assert.deepEqual(unorderedClassGraph.allChildren,{
			A:{B:true},
			B:{},
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			A:{},
			B:{A:true},
		})
		assert.deepEqual(unorderedClassGraph.integratedAncestors,{
			A:{
				A:{},
			},
			B:{
				B:{},
			},
		})
	})
	it("selects node from chain",()=>{
		const dag={
			A:{},
			B:{A:true},
		}
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData(dag),{
			B:true,
		})
		assert.deepEqual(unorderedClassGraph.allParents,dag)
		assert.deepEqual(unorderedClassGraph.allChildren,{
			A:{B:true},
			B:{},
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			B:{},
		})
		assert.deepEqual(unorderedClassGraph.integratedAncestors,{
			B:{
				A:{},
				B:{A:true},
			},
		})
	})
	it("selects 2 chains from 2 chains",()=>{
		const dag={
			A:{},
			B:{},
			C:{A:true},
			D:{B:true},
		}
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData(dag),{
			A:true,
			B:true,
			C:true,
			D:true,
		})
		assert.deepEqual(unorderedClassGraph.allParents,dag)
		assert.deepEqual(unorderedClassGraph.allChildren,{
			A:{C:true},
			B:{D:true},
			C:{},
			D:{},
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			A:{},
			B:{},
			C:{A:true},
			D:{B:true},
		})
		assert.deepEqual(unorderedClassGraph.integratedAncestors,{
			A:{
				A:{},
			},
			B:{
				B:{},
			},
			C:{
				C:{},
			},
			D:{
				D:{},
			},
		})
	})
	it("selects fork from fork",()=>{
		const dag={
			A:{},
			B:{A:true},
			C:{A:true},
		}
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData(dag),{
			A:true,
			B:true,
			C:true,
		})
		assert.deepEqual(unorderedClassGraph.allParents,dag)
		assert.deepEqual(unorderedClassGraph.allChildren,{
			A:{B:true,C:true},
			B:{},
			C:{},
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			A:{},
			B:{A:true},
			C:{A:true},
		})
		assert.deepEqual(unorderedClassGraph.integratedAncestors,{
			A:{
				A:{},
			},
			B:{
				B:{},
			},
			C:{
				C:{},
			},
		})
	})
	it("selects chain from fork",()=>{
		const dag={
			A:{},
			B:{A:true},
			C:{A:true},
		}
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData(dag),{
			A:true,
			C:true,
		})
		assert.deepEqual(unorderedClassGraph.allParents,dag)
		assert.deepEqual(unorderedClassGraph.allChildren,{
			A:{B:true,C:true},
			B:{},
			C:{},
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			A:{},
			C:{A:true},
		})
		assert.deepEqual(unorderedClassGraph.integratedAncestors,{
			A:{
				A:{},
			},
			C:{
				C:{},
			},
		})
	})
	it("selects 2 nodes from fork",()=>{
		const dag={
			A:{},
			B:{A:true},
			C:{A:true},
		}
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData(dag),{
			B:true,
			C:true,
		})
		assert.deepEqual(unorderedClassGraph.allParents,dag)
		assert.deepEqual(unorderedClassGraph.allChildren,{
			A:{B:true,C:true},
			B:{},
			C:{},
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			B:{},
			C:{},
		})
		assert.deepEqual(unorderedClassGraph.integratedAncestors,{
			B:{
				A:{},
				B:{A:true},
			},
			C:{
				A:{},
				C:{A:true},
			},
		})
	})
	it("selects diamond from diamond",()=>{
		const dag={
			A:{},
			B:{A:true},
			C:{A:true},
			D:{B:true,C:true},
		}
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData(dag),{
			A:true,
			B:true,
			C:true,
			D:true,
		})
		assert.deepEqual(unorderedClassGraph.allParents,dag)
		assert.deepEqual(unorderedClassGraph.allChildren,{
			A:{B:true,C:true},
			B:{D:true},
			C:{D:true},
			D:{},
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			A:{},
			B:{A:true},
			C:{A:true},
			D:{B:true,C:true},
		})
		assert.deepEqual(unorderedClassGraph.integratedAncestors,{
			A:{
				A:{},
			},
			B:{
				B:{},
			},
			C:{
				C:{},
			},
			D:{
				D:{},
			},
		})
	})
	it("selects 3-chain from diamond",()=>{
		const dag={
			A:{},
			B:{A:true},
			C:{A:true},
			D:{B:true,C:true},
		}
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData(dag),{
			A:true,
			B:true,
			D:true,
		})
		assert.deepEqual(unorderedClassGraph.allParents,dag)
		assert.deepEqual(unorderedClassGraph.allChildren,{
			A:{B:true,C:true},
			B:{D:true},
			C:{D:true},
			D:{},
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			A:{},
			B:{A:true},
			D:{B:true},
		})
		assert.deepEqual(unorderedClassGraph.integratedAncestors,{
			A:{
				A:{},
			},
			B:{
				B:{},
			},
			D:{
				C:{},
				D:{C:true},
			},
		})
	})
	it("selects И-shape from И-shape",()=>{
		const dag={
			A:{},
			B:{},
			C:{A:true,B:true},
			D:{B:true},
		}
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData(dag),{
			A:true,
			B:true,
			C:true,
			D:true,
		})
		assert.deepEqual(unorderedClassGraph.allParents,dag)
		assert.deepEqual(unorderedClassGraph.allChildren,{
			A:{C:true},
			B:{C:true,D:true},
			C:{},
			D:{},
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			A:{},
			B:{},
			C:{A:true,B:true},
			D:{B:true},
		})
		assert.deepEqual(unorderedClassGraph.integratedAncestors,{
			A:{
				A:{},
			},
			B:{
				B:{},
			},
			C:{
				C:{},
			},
			D:{
				D:{},
			},
		})
	})
	it("selects chain and node from a-shape",()=>{
		const dag={
			A:{},
			B:{A:true},
			C:{A:true},
			D:{B:true,C:true},
			E:{C:true},
		}
		const unorderedClassGraph=new UnorderedClassGraph(convertParentsToData(dag),{
			B:true,
			D:true,
			E:true,
		})
		assert.deepEqual(unorderedClassGraph.allParents,dag)
		assert.deepEqual(unorderedClassGraph.allChildren,{
			A:{B:true,C:true},
			B:{D:true},
			C:{D:true,E:true},
			D:{},
			E:{},
		})
		assert.deepEqual(unorderedClassGraph.visibleParents,{
			B:{},
			D:{B:true},
			E:{},
		})
		assert.deepEqual(unorderedClassGraph.integratedAncestors,{
			B:{
				A:{},
				B:{A:true},
			},
			D:{
				C:{},
				D:{C:true},
			},
			E:{
				A:{},
				C:{A:true},
				E:{C:true},
			},
		})
	})
})
