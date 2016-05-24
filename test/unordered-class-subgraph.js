'use strict'

const assert=require('assert')
const UnorderedClassSubgraph=require('../src/unordered-class-subgraph')

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
		const unorderedClassSubraph=new UnorderedClassSubgraph(convertParentsToData(dag),{
			A:true,
		})
		assert.deepEqual(unorderedClassSubraph.allParents,dag)
		assert.deepEqual(unorderedClassSubraph.allChildren,{
			A:{},
		})
		assert.deepEqual(unorderedClassSubraph.visibleParents,{
			A:{},
		})
		assert.deepEqual(unorderedClassSubraph.visibleChildren,{
			A:{},
		})
		assert.deepEqual(unorderedClassSubraph.integratedAncestors,{
			A:{
				A:{},
			},
		})
		assert.deepEqual(unorderedClassSubraph.visibleDepthNodes,[
			{A:true},
		])
	})
	it("selects 2 nodes from 2 nodes",()=>{
		const dag={
			A:{},
			B:{},
		}
		const unorderedClassSubraph=new UnorderedClassSubgraph(convertParentsToData(dag),{
			A:true,
			B:true,
		})
		assert.deepEqual(unorderedClassSubraph.allParents,dag)
		assert.deepEqual(unorderedClassSubraph.allChildren,{
			A:{},
			B:{},
		})
		assert.deepEqual(unorderedClassSubraph.visibleParents,{
			A:{},
			B:{},
		})
		assert.deepEqual(unorderedClassSubraph.visibleChildren,{
			A:{},
			B:{},
		})
		assert.deepEqual(unorderedClassSubraph.integratedAncestors,{
			A:{
				A:{},
			},
			B:{
				B:{},
			},
		})
		assert.deepEqual(unorderedClassSubraph.visibleDepthNodes,[
			{A:true,B:true},
		])
	})
	it("selects chain from chain",()=>{
		const dag={
			A:{},
			B:{A:true},
		}
		const unorderedClassSubraph=new UnorderedClassSubgraph(convertParentsToData(dag),{
			A:true,
			B:true,
		})
		assert.deepEqual(unorderedClassSubraph.allParents,dag)
		assert.deepEqual(unorderedClassSubraph.allChildren,{
			A:{B:true},
			B:{},
		})
		assert.deepEqual(unorderedClassSubraph.visibleParents,{
			A:{},
			B:{A:true},
		})
		assert.deepEqual(unorderedClassSubraph.visibleChildren,{
			A:{B:true},
			B:{},
		})
		assert.deepEqual(unorderedClassSubraph.integratedAncestors,{
			A:{
				A:{},
			},
			B:{
				B:{},
			},
		})
		assert.deepEqual(unorderedClassSubraph.visibleDepthNodes,[
			{A:true},
			{B:true},
		])
	})
	it("selects node from chain",()=>{
		const dag={
			A:{},
			B:{A:true},
		}
		const unorderedClassSubraph=new UnorderedClassSubgraph(convertParentsToData(dag),{
			B:true,
		})
		assert.deepEqual(unorderedClassSubraph.allParents,dag)
		assert.deepEqual(unorderedClassSubraph.allChildren,{
			A:{B:true},
			B:{},
		})
		assert.deepEqual(unorderedClassSubraph.visibleParents,{
			B:{},
		})
		assert.deepEqual(unorderedClassSubraph.visibleChildren,{
			B:{},
		})
		assert.deepEqual(unorderedClassSubraph.integratedAncestors,{
			B:{
				A:{},
				B:{A:true},
			},
		})
		assert.deepEqual(unorderedClassSubraph.visibleDepthNodes,[
			{B:true},
		])
	})
	it("selects fork from fork",()=>{
		const dag={
			A:{},
			B:{A:true},
			C:{A:true},
		}
		const unorderedClassSubraph=new UnorderedClassSubgraph(convertParentsToData(dag),{
			A:true,
			B:true,
			C:true,
		})
		assert.deepEqual(unorderedClassSubraph.allParents,dag)
		assert.deepEqual(unorderedClassSubraph.allChildren,{
			A:{B:true,C:true},
			B:{},
			C:{},
		})
		assert.deepEqual(unorderedClassSubraph.visibleParents,{
			A:{},
			B:{A:true},
			C:{A:true},
		})
		assert.deepEqual(unorderedClassSubraph.visibleChildren,{
			A:{B:true,C:true},
			B:{},
			C:{},
		})
		assert.deepEqual(unorderedClassSubraph.integratedAncestors,{
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
		assert.deepEqual(unorderedClassSubraph.visibleDepthNodes,[
			{A:true},
			{B:true,C:true},
		])
	})
	it("selects chain from fork",()=>{
		const dag={
			A:{},
			B:{A:true},
			C:{A:true},
		}
		const unorderedClassSubraph=new UnorderedClassSubgraph(convertParentsToData(dag),{
			A:true,
			C:true,
		})
		assert.deepEqual(unorderedClassSubraph.allParents,dag)
		assert.deepEqual(unorderedClassSubraph.allChildren,{
			A:{B:true,C:true},
			B:{},
			C:{},
		})
		assert.deepEqual(unorderedClassSubraph.visibleParents,{
			A:{},
			C:{A:true},
		})
		assert.deepEqual(unorderedClassSubraph.visibleChildren,{
			A:{C:true},
			C:{},
		})
		assert.deepEqual(unorderedClassSubraph.integratedAncestors,{
			A:{
				A:{},
			},
			C:{
				C:{},
			},
		})
		assert.deepEqual(unorderedClassSubraph.visibleDepthNodes,[
			{A:true},
			{C:true},
		])
	})
	it("selects 2 nodes from fork",()=>{
		const dag={
			A:{},
			B:{A:true},
			C:{A:true},
		}
		const unorderedClassSubraph=new UnorderedClassSubgraph(convertParentsToData(dag),{
			B:true,
			C:true,
		})
		assert.deepEqual(unorderedClassSubraph.allParents,dag)
		assert.deepEqual(unorderedClassSubraph.allChildren,{
			A:{B:true,C:true},
			B:{},
			C:{},
		})
		assert.deepEqual(unorderedClassSubraph.visibleParents,{
			B:{},
			C:{},
		})
		assert.deepEqual(unorderedClassSubraph.visibleChildren,{
			B:{},
			C:{},
		})
		assert.deepEqual(unorderedClassSubraph.integratedAncestors,{
			B:{
				A:{},
				B:{A:true},
			},
			C:{
				A:{},
				C:{A:true},
			},
		})
		assert.deepEqual(unorderedClassSubraph.visibleDepthNodes,[
			{B:true,C:true},
		])
	})
	it("selects diamond from diamond",()=>{
		const dag={
			A:{},
			B:{A:true},
			C:{A:true},
			D:{B:true,C:true},
		}
		const unorderedClassSubraph=new UnorderedClassSubgraph(convertParentsToData(dag),{
			A:true,
			B:true,
			C:true,
			D:true,
		})
		assert.deepEqual(unorderedClassSubraph.allParents,dag)
		assert.deepEqual(unorderedClassSubraph.allChildren,{
			A:{B:true,C:true},
			B:{D:true},
			C:{D:true},
			D:{},
		})
		assert.deepEqual(unorderedClassSubraph.visibleParents,{
			A:{},
			B:{A:true},
			C:{A:true},
			D:{B:true,C:true},
		})
		assert.deepEqual(unorderedClassSubraph.visibleChildren,{
			A:{B:true,C:true},
			B:{D:true},
			C:{D:true},
			D:{},
		})
		assert.deepEqual(unorderedClassSubraph.integratedAncestors,{
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
		assert.deepEqual(unorderedClassSubraph.visibleDepthNodes,[
			{A:true},
			{B:true,C:true},
			{D:true},
		])
	})
	it("selects 3-chain from diamond",()=>{
		const dag={
			A:{},
			B:{A:true},
			C:{A:true},
			D:{B:true,C:true},
		}
		const unorderedClassSubraph=new UnorderedClassSubgraph(convertParentsToData(dag),{
			A:true,
			B:true,
			D:true,
		})
		assert.deepEqual(unorderedClassSubraph.allParents,dag)
		assert.deepEqual(unorderedClassSubraph.allChildren,{
			A:{B:true,C:true},
			B:{D:true},
			C:{D:true},
			D:{},
		})
		assert.deepEqual(unorderedClassSubraph.visibleParents,{
			A:{},
			B:{A:true},
			D:{B:true},
		})
		assert.deepEqual(unorderedClassSubraph.visibleChildren,{
			A:{B:true},
			B:{D:true},
			D:{},
		})
		assert.deepEqual(unorderedClassSubraph.integratedAncestors,{
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
		assert.deepEqual(unorderedClassSubraph.visibleDepthNodes,[
			{A:true},
			{B:true},
			{D:true},
		])
	})
	it("selects chain and node from a-shape",()=>{
		const dag={
			A:{},
			B:{A:true},
			C:{A:true},
			D:{B:true,C:true},
			E:{C:true},
		}
		const unorderedClassSubraph=new UnorderedClassSubgraph(convertParentsToData(dag),{
			B:true,
			D:true,
			E:true,
		})
		assert.deepEqual(unorderedClassSubraph.allParents,dag)
		assert.deepEqual(unorderedClassSubraph.allChildren,{
			A:{B:true,C:true},
			B:{D:true},
			C:{D:true,E:true},
			D:{},
			E:{},
		})
		assert.deepEqual(unorderedClassSubraph.visibleParents,{
			B:{},
			D:{B:true},
			E:{},
		})
		assert.deepEqual(unorderedClassSubraph.visibleChildren,{
			B:{D:true},
			D:{},
			E:{},
		})
		assert.deepEqual(unorderedClassSubraph.integratedAncestors,{
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
		assert.deepEqual(unorderedClassSubraph.visibleDepthNodes,[
			{B:true,E:true},
			{D:true},
		])
	})
})
