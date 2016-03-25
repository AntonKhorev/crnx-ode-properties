'use strict'

const assert=require('assert')
const depthList=require('../src/depth-list')

describe("depthList",()=>{
	it("selects one node from one node",()=>{
		const result=depthList({
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
	it("selects node chain from node chain",()=>{
		const result=depthList({
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
})
