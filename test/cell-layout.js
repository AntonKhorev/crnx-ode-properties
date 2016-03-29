'use strict'

const assert=require('assert')
const cellLayout=require('../src/cell-layout')

describe("cellLayout",()=>{
	it("makes layout for node",()=>{
		const result=cellLayout([ // node layers/rows
			['A'],
		],[ // arc layers
		])
		assert.deepEqual(result,[[ // node layers/rows
			[{node:'A'}],
		],[ // arc layers
		]])
	})
	it("makes layout for diamond",()=>{
		const result=cellLayout([ // node layers/rows
			['A'],
			['B','C'],
			['D'],
		],[ // arc layers
			[ // arc rows
				[[0],[1,2]],
			],
			[ // arc rows
				[[1,2],[3]],
			],
		])
		assert.deepEqual(result,[[ // node layers/rows
			[{node:'A'},{},{},{}],
			[{},{node:'B'},{node:'C'},{}],
			[{},{},{},{node:'D'}],
		],[ // arc layers
			[ // arc rows
				[{rt:true},{rl:true,bl:true},{bl:true},{}],
			],
			[ // arc rows
				[{},{rt:true},{rl:true,rt:true},{bl:true}],
			],
		]])
	})
})
