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
	})
})
