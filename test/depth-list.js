'use strict'

const assert=require('assert')
const depthList=require('../src/depth-list')

describe("depthList",()=>{
	it("returns one node",()=>{
		const result=depthList({
			'A':{},
		},{
			'A':true,
		})
		assert.deepEqual(result,[
			[
				['A'],
			],
			{
				'A':{},
			}
		])
	})
})
