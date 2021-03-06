'use strict'

const assert=require('assert')
const makeCellLayers=require('../../src/thead-layout/cell-layers')

describe("makeCellLayers",()=>{
	it("makes layout for node",()=>{
		const result=makeCellLayers([ // node layers/rows
			['A'],
		],[ // arc layers
		])
		assert.deepEqual(result,[[ // node layers/rows
			[{node:'A'}],
		],[ // arc layers
		]])
	})
	it("makes layout for diamond",()=>{
		const result=makeCellLayers([ // node layers/rows
			['A'],
			['B','C'],
			['D'],
		],[ // arc layers
			[ // arc rows
				[[0],[1,2]],
			],[
				[[1,2],[3]],
			]
		])
		assert.deepEqual(result,[[ // node layers/rows
			[{node:'A',b:true},{},{},{}],
			[{},{node:'B',b:true,t:true},{node:'C',b:true,t:true},{}],
			[{},{},{},{node:'D',t:true}],
		],[ // arc layers
			[ // arc rows
				[{rt:true},{rl:true,bl:true},{bl:true},{}],
			],[
				[{},{rt:true},{rl:true,rt:true},{bl:true}],
			]
		]])
	})
	it("makes layout for N-shape",()=>{
		const result=makeCellLayers([ // node layers/rows
			['A','B'],
			['C','D'],
		],[ // arc layers
			[ // arc rows
				[[0,1],[3]],
				[[0],[2]],
			]
		])
		assert.deepEqual(result,[[ // node layers/rows
			[{node:'A',b:true},{node:'B',b:true},{},{}],
			[{},{},{node:'C',t:true},{node:'D',t:true}],
		],[ // arc layers
			[ // arc rows
				[{bt:true,rt:true},{rl:true,rt:true},{rl:true},{bl:true}],
				[{rt:true},{rl:true},{bl:true},{bt:true}],
			]
		]])
	})
	it("makes layout with vertical arcs going through node layers",()=>{
		const result=makeCellLayers([ // node layers/rows
			['A'],
			['B','C'],
			['D'],
			['E'],
		],[ // arc layers
			[ // arc rows
				[[0],[1,2]],
			],[
				[[2],[3]],
			],[
				[[0,3],[4]],
			]
		])
		assert.deepEqual(result,[[ // node layers/rows
			[{node:'A',b:true},{},{},{},{}],
			[{bt:true},{node:'B',t:true},{node:'C',b:true,t:true},{},{}],
			[{bt:true},{},{},{node:'D',b:true,t:true},{}],
			[{},{},{},{},{node:'E',t:true}],
		],[ // arc layers
			[ // arc rows
				[{bt:true,rt:true},{rl:true,bl:true},{bl:true},{},{}],
			],[
				[{bt:true},{},{rt:true},{bl:true},{}],
			],[
				[{rt:true},{rl:true},{rl:true},{rl:true,rt:true},{bl:true}],
			]
		]])
	})
})
