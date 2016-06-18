'use strict'

const assert=require('assert')
const UnorderedClassSubgraph=require('../src/unordered-class-subgraph')
const TrLayout=require('../src/tr-layout')

const makeClassSubgraph=(classData,classColumns)=>{
	const visibleNodes={}
	classColumns.forEach(id=>visibleNodes[id]=true)
	return new UnorderedClassSubgraph(classData,visibleNodes)
}

describe("TrLayout",()=>{
	it("skips row if trait is not present",()=>{
		const classData={
			A: {
				parents: {},
				traits: {
					prop: {},
				},
			},
			B: {
				parents: {
					A: true,
				},
				traits: {
					prop: {},
				},
			},
			C: {
				parents: {
					B: true,
				},
				traits: {
					prop: {},
				},
			},
		}
		const classColumns=['A','B','C']
		const classSubgraph=makeClassSubgraph(classData,classColumns)
		const trLayout=new TrLayout(classSubgraph,classData,classColumns)
		assert.equal(trLayout.getSubtreeLayout(
			['no-such-prop']
		),null)
	})
	it("supports redefined trait",()=>{
		const classData={
			A: {
				parents: {},
				traits: {
					prop: {},
				},
			},
			B: {
				parents: {
					A: true,
				},
				traits: {
					prop: {},
				},
			},
			C: {
				parents: {
					B: true,
				},
				traits: {
					prop: {},
				},
			},
		}
		const classColumns=['A','B','C']
		const classSubgraph=makeClassSubgraph(classData,classColumns)
		const trLayout=new TrLayout(classSubgraph,classData,classColumns)
		assert.deepEqual(trLayout.getSubtreeLayout(
			['prop']
		),[
			[
				['A','prop'],
			],
			[
				['B','prop'],
			],
			[
				['C','prop'],
			],
		])
	})
	it("supports redefined trait group",()=>{
		const classData={
			A: {
				parents: {},
				traits: {
					subprop1: {},
					subprop2: {},
				},
			},
			B: {
				parents: {
					A: true,
				},
				traits: {
					subprop1: {},
					subprop2: {},
				},
			},
			C: {
				parents: {
					B: true,
				},
				traits: {
					subprop1: {},
					subprop2: {},
				},
			},
		}
		const classColumns=['A','B','C']
		const classSubgraph=makeClassSubgraph(classData,classColumns)
		const trLayout=new TrLayout(classSubgraph,classData,classColumns)
		assert.deepEqual(trLayout.getSubtreeLayout(
			['prop',[
				['subprop1'],
				['subprop2'],
			]]
		),[
			[
				['A','subprop1'],
				['A','subprop2'],
			],
			[
				['B','subprop1'],
				['B','subprop2'],
			],
			[
				['C','subprop1'],
				['C','subprop2'],
			],
		])
	})
	it("supports skipped trait",()=>{
		const classData={
			A: {
				parents: {},
				traits: {
					prop: {},
				},
			},
			B: {
				parents: {
					A: true,
				},
				traits: {},
			},
			C: {
				parents: {
					B: true,
				},
				traits: {
					prop: {},
				},
			},
		}
		const classColumns=['A','B','C']
		const classSubgraph=makeClassSubgraph(classData,classColumns)
		const trLayout=new TrLayout(classSubgraph,classData,classColumns)
		assert.deepEqual(trLayout.getSubtreeLayout(
			['prop']
		),[
			[
				['A','prop'],
			],
			[],
			[
				['C','prop'],
			],
		])
	})
	it("supports inherited trait",()=>{
		const classData={
			A: {
				parents: {},
				traits: {
					prop: {},
				},
			},
			B: {
				parents: {
					A: true,
				},
				traits: {},
			},
			C: {
				parents: {
					B: true,
				},
				traits: {
					prop: {},
				},
			},
		}
		const classColumns=['B','C']
		const classSubgraph=makeClassSubgraph(classData,classColumns)
		const trLayout=new TrLayout(classSubgraph,classData,classColumns)
		assert.deepEqual(trLayout.getSubtreeLayout(
			['prop']
		),[
			[
				['A','prop'],
			],
			[
				['C','prop'],
			],
		])
	})
	it("supports fork-inherited trait",()=>{
		const classData={
			A: {
				parents: {},
				traits: {
					prop: {},
				},
			},
			B: {
				parents: {},
				traits: {
					prop: {},
				},
			},
			C: {
				parents: {
					A: true,
					B: true,
				},
				traits: {},
			},
		}
		const classColumns=['C']
		const classSubgraph=makeClassSubgraph(classData,classColumns)
		const trLayout=new TrLayout(classSubgraph,classData,classColumns)
		assert.deepEqual(trLayout.getSubtreeLayout(
			['prop']
		),[
			[
				['A','prop'],
				['B','prop'],
			],
		])
	})
	it("supports diamond-inherited trait",()=>{
		const classData={
			A: {
				parents: {},
				traits: {
					prop: {},
				},
			},
			B: {
				parents: {
					A: true,
				},
				traits: {},
			},
			C: {
				parents: {
					A: true,
				},
				traits: {},
			},
			D: {
				parents: {
					B: true,
					C: true,
				},
				traits: {},
			},
		}
		const classColumns=['D']
		const classSubgraph=makeClassSubgraph(classData,classColumns)
		const trLayout=new TrLayout(classSubgraph,classData,classColumns)
		assert.deepEqual(trLayout.getSubtreeLayout(
			['prop']
		),[
			[
				['A','prop'],
			],
		])
	})
	it("supports diamond-inherited trait with one parent visible",()=>{
		const classData={
			A: {
				parents: {},
				traits: {
					prop: {},
				},
			},
			B: {
				parents: {
					A: true,
				},
				traits: {},
			},
			C: {
				parents: {
					A: true,
				},
				traits: {},
			},
			D: {
				parents: {
					B: true,
					C: true,
				},
				traits: {},
			},
		}
		const classColumns=['C','D']
		const classSubgraph=makeClassSubgraph(classData,classColumns)
		const trLayout=new TrLayout(classSubgraph,classData,classColumns)
		assert.deepEqual(trLayout.getSubtreeLayout(
			['prop']
		),[
			[
				['A','prop'],
			],
			[],
		])
	})
	it("skips diamond-inherited trait when parent with trait is visible",()=>{
		const classData={
			A: {
				parents: {},
				traits: {
					prop: {},
				},
			},
			B: {
				parents: {
					A: true,
				},
				traits: {},
			},
			C: {
				parents: {
					A: true,
				},
				traits: {
					prop: {},
				},
			},
			D: {
				parents: {
					B: true,
					C: true,
				},
				traits: {},
			},
		}
		const classColumns=['C','D']
		const classSubgraph=makeClassSubgraph(classData,classColumns)
		const trLayout=new TrLayout(classSubgraph,classData,classColumns)
		assert.deepEqual(trLayout.getSubtreeLayout(
			['prop']
		),[
			[
				['C','prop'],
			],
			[],
		])
	})
	it("displays diamond-inherited trait for parent when different parent with trait is invisible",()=>{
		const classData={
			A: {
				parents: {},
				traits: {
					prop: {},
				},
			},
			B: {
				parents: {
					A: true,
				},
				traits: {},
			},
			C: {
				parents: {
					A: true,
				},
				traits: {
					prop: {},
				},
			},
			D: {
				parents: {
					B: true,
					C: true,
				},
				traits: {},
			},
		}
		const classColumns=['B','D']
		const classSubgraph=makeClassSubgraph(classData,classColumns)
		const trLayout=new TrLayout(classSubgraph,classData,classColumns)
		assert.deepEqual(trLayout.getSubtreeLayout(
			['prop']
		),[
			[
				['A','prop'],
			],
			[
				['C','prop'],
			],
		])
	})
	context("on chain with closed trait",()=>{
		const classData={
			A: {
				parents: {},
				traits: {
					prop: {},
				},
			},
			B: {
				parents: {
					A: true,
				},
				traits: {},
			},
			C: {
				parents: {
					B: true,
				},
				traits: {
					prop: { close: true },
				},
			},
			D: {
				parents: {
					C: true,
				},
				traits: {},
			},
		}
		it("displays closed trait when defining ancestor is visible",()=>{
			const classColumns=['A','B','C','D']
			const classSubgraph=makeClassSubgraph(classData,classColumns)
			const trLayout=new TrLayout(classSubgraph,classData,classColumns)
			assert.deepEqual(trLayout.getSubtreeLayout(
				['prop']
			),[
				[
					['A','prop'],
				],
				[],
				[
					['C','prop'],
				],
				[],
			])
		})
		it("displays closed trait when inheriting ancestor is visible",()=>{
			const classColumns=['B','C','D']
			const classSubgraph=makeClassSubgraph(classData,classColumns)
			const trLayout=new TrLayout(classSubgraph,classData,classColumns)
			assert.deepEqual(trLayout.getSubtreeLayout(
				['prop']
			),[
				[
					['A','prop'],
				],
				[
					['C','prop'],
				],
				[],
			])
		})
		it("displays closed trait on child when inheriting ancestor is visible",()=>{
			const classColumns=['B','D']
			const classSubgraph=makeClassSubgraph(classData,classColumns)
			const trLayout=new TrLayout(classSubgraph,classData,classColumns)
			assert.deepEqual(trLayout.getSubtreeLayout(
				['prop']
			),[
				[
					['A','prop'],
				],
				[
					['C','prop'],
				],
			])
		})
		it("skips closed trait when defining/inheriting ancestors are hidden",()=>{
			const classColumns=['C','D']
			const classSubgraph=makeClassSubgraph(classData,classColumns)
			const trLayout=new TrLayout(classSubgraph,classData,classColumns)
			assert.deepEqual(trLayout.getSubtreeLayout(
				['prop']
			),null)
		})
	})
	context("on diamond with closed trait",()=>{
		const classData={
			A: {
				parents: {},
				traits: {
					prop: {},
				},
			},
			B: {
				parents: {
					A: true,
				},
				traits: {},
			},
			C: {
				parents: {
					A: true,
				},
				traits: {
					prop: { close: true },
				},
			},
			D: {
				parents: {
					B: true,
					C: true,
				},
				traits: {},
			},
		}
		it("displays closed trait when defining ancestor is visible",()=>{
			const classColumns=['A','B','C','D']
			const classSubgraph=makeClassSubgraph(classData,classColumns)
			const trLayout=new TrLayout(classSubgraph,classData,classColumns)
			assert.deepEqual(trLayout.getSubtreeLayout(
				['prop']
			),[
				[
					['A','prop'],
				],
				[],
				[
					['C','prop'],
				],
				[],
			])
		})
		it("displays closed trait on child when inheriting non-closing-side ancestor is visible",()=>{
			const classColumns=['B','D']
			const classSubgraph=makeClassSubgraph(classData,classColumns)
			const trLayout=new TrLayout(classSubgraph,classData,classColumns)
			assert.deepEqual(trLayout.getSubtreeLayout(
				['prop']
			),[
				[
					['A','prop'],
				],
				[
					['C','prop'],
				],
			])
		})
		it("skips closed trait when defining/inheriting ancestors are hidden",()=>{
			const classColumns=['C','D']
			const classSubgraph=makeClassSubgraph(classData,classColumns)
			const trLayout=new TrLayout(classSubgraph,classData,classColumns)
			assert.deepEqual(trLayout.getSubtreeLayout(
				['prop']
			),null)
		})
	})
	context("on chain with compared trait",()=>{
		const classData={
			A: {
				parents: {},
				traits: {
					prop: { compare: true },
				},
			},
			B: {
				parents: {
					A: true,
				},
				traits: {},
			},
			C: {
				parents: {
					B: true,
				},
				traits: {
					prop: {},
				},
			},
			D: {
				parents: {
					C: true,
				},
				traits: {},
			},
		}
		it("displays compared trait when defining descendant is visible",()=>{
			const classColumns=['A','B','C','D']
			const classSubgraph=makeClassSubgraph(classData,classColumns)
			const trLayout=new TrLayout(classSubgraph,classData,classColumns)
			assert.deepEqual(trLayout.getSubtreeLayout(
				['prop']
			),[
				[
					['A','prop'],
				],
				[],
				[
					['C','prop'],
				],
				[],
			])
		})
		it("displays compared trait when inheriting descendant is visible",()=>{
			const classColumns=['A','D']
			const classSubgraph=makeClassSubgraph(classData,classColumns)
			const trLayout=new TrLayout(classSubgraph,classData,classColumns)
			assert.deepEqual(trLayout.getSubtreeLayout(
				['prop']
			),[
				[
					['A','prop'],
				],
				[
					['C','prop'],
				],
			])
		})
		it("displays compared trait on child when inheriting descendant is visible",()=>{
			const classColumns=['B','D']
			const classSubgraph=makeClassSubgraph(classData,classColumns)
			const trLayout=new TrLayout(classSubgraph,classData,classColumns)
			assert.deepEqual(trLayout.getSubtreeLayout(
				['prop']
			),[
				[
					['A','prop'],
				],
				[
					['C','prop'],
				],
			])
		})
		it("skips compared trait when defining/inheriting descendants are hidden",()=>{
			const classColumns=['A','B']
			const classSubgraph=makeClassSubgraph(classData,classColumns)
			const trLayout=new TrLayout(classSubgraph,classData,classColumns)
			assert.deepEqual(trLayout.getSubtreeLayout(
				['prop']
			),null)
		})
	})
})
