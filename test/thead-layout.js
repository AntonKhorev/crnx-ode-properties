'use strict'

const assert=require('assert')
const TheadLayout=require('../src/thead-layout')

describe("TheadLayout",()=>{
	context("with 1 node",()=>{
		const layout=new TheadLayout({
			'A':{},
		},{
			'A':true,
		})
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
