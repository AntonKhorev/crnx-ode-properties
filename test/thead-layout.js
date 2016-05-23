'use strict'

const assert=require('assert')
const UnorderedClassSubgraph=require('../src/unordered-class-subgraph')
const TheadLayout=require('../src/thead-layout')

describe("TheadLayout",()=>{
	context("with 1 node",()=>{
		const subgraph=new UnorderedClassSubgraph({
			A: {
				parents: {},
			},
		},{
			A: true,
		})
		const layout=new TheadLayout(subgraph)
		it("has columns",()=>{
			assert.deepEqual(layout.columns,
				['A']
			)
		})
		it("has node layers",()=>{
			assert.deepEqual(layout.nodeLayers,[
				[{node:'A'}],
			])
		})
		it("has arc layers",()=>{
			assert.deepEqual(layout.arcLayers,[
			])
		})
		it("has parents array",()=>{
			assert.deepEqual(layout.columnParents,{
				A: [],
			})
		})
	})
	context("with fork",()=>{
		const subgraph=new UnorderedClassSubgraph({
			B: {
				parents: {},
			},
			A: {
				parents: {},
			},
			C: {
				parents: {
					B: true,
					A: true,
				},
			},
		},{
			B: true,
			A: true,
			C: true,
		})
		const layout=new TheadLayout(subgraph)
		it("has parents array",()=>{
			assert.deepEqual(layout.columnParents,{
				A: [],
				B: [],
				C: ['A','B'],
			})
		})
	})
})
