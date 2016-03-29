'use strict'

const assert=require('assert')
const cellLayout=require('../src/cell-layout')

describe("cellLayout",()=>{
	it("makes layout for node",()=>{
		const result=cellLayout([
			['A'],
		],[
		])
		assert.deepEqual(result,[[ // node layers/rows
			[{node:'A'}], // node cols
		],[ // arc layers
		]])
	})
})
