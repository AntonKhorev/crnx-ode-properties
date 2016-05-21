'use strict'

const assert=require('assert')
const TrLayout=require('../src/tr-layout')

describe("TrLayout",()=>{
	it("skips row if trait is not present",()=>{
		const trLayout=new TrLayout(
			['A','B','C'],
			{
				A: {
					parents: {},
					traits: {
						prop: [['main',['stuff a']]],
					},
				},
				B: {
					parents: {
						A: true,
					},
					traits: {
						prop: [['main',['stuff b']]],
					},
				},
				C: {
					parents: {
						B: true,
					},
					traits: {
						prop: [['main',['stuff c']]],
					},
				},
			}
		)
		assert.equal(trLayout.getSubtreeLayout(
			['no-such-prop']
		),null)
	})
	it("supports redefined trait",()=>{
		const trLayout=new TrLayout(
			['A','B','C'],
			{
				A: {
					parents: {},
					traits: {
						prop: [['main',['stuff a']]],
					},
				},
				B: {
					parents: {
						A: true,
					},
					traits: {
						prop: [['main',['stuff b']]],
					},
				},
				C: {
					parents: {
						B: true,
					},
					traits: {
						prop: [['main',['stuff c']]],
					},
				},
			}
		)
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
		const trLayout=new TrLayout(
			['A','B','C'],
			{
				A: {
					parents: {},
					traits: {
						subprop1: [['main',['stuff a1']]],
						subprop2: [['main',['stuff a2']]],
					},
				},
				B: {
					parents: {
						A: true,
					},
					traits: {
						subprop1: [['main',['stuff b1']]],
						subprop2: [['main',['stuff b2']]],
					},
				},
				C: {
					parents: {
						B: true,
					},
					traits: {
						subprop1: [['main',['stuff c1']]],
						subprop2: [['main',['stuff c2']]],
					},
				},
			}
		)
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
		const trLayout=new TrLayout(
			['A','B','C'],
			{
				A: {
					parents: {},
					traits: {
						prop: [['main',['stuff a']]],
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
						prop: [['main',['stuff c']]],
					},
				},
			}
		)
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
		const trLayout=new TrLayout(
			['B','C'],
			{
				A: {
					parents: {},
					traits: {
						prop: [['main',['stuff a']]],
					},
				},
				B: {
					parents: {
						A: true,
					},
					traits: {
					},
				},
				C: {
					parents: {
						B: true,
					},
					traits: {
						prop: [['main',['stuff c']]],
					},
				},
			}
		)
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
		const trLayout=new TrLayout(
			['C'],
			{
				A: {
					parents: {},
					traits: {
						prop: [['main',['stuff a']]],
					},
				},
				B: {
					parents: {},
					traits: {
						prop: [['main',['stuff b']]],
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
		)
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
		const trLayout=new TrLayout(
			['D'],
			{
				A: {
					parents: {},
					traits: {
						prop: [['main',['stuff a']]],
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
		)
		assert.deepEqual(trLayout.getSubtreeLayout(
			['prop']
		),[
			[
				['A','prop'],
			],
		])
	})
	it("supports diamond-inherited trait with one parent visible",()=>{
		const trLayout=new TrLayout(
			['C','D'],
			{
				A: {
					parents: {},
					traits: {
						prop: [['main',['stuff a']]],
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
		)
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
		const trLayout=new TrLayout(
			['C','D'],
			{
				A: {
					parents: {},
					traits: {
						prop: [['main',['stuff a']]],
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
						prop: [['main',['stuff c']]],
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
		)
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
		const trLayout=new TrLayout(
			['B','D'],
			{
				A: {
					parents: {},
					traits: {
						prop: [['main',['stuff a']]],
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
						prop: [['main',['stuff c']]],
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
		)
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
	/*
	context("on chain with closed trait",()=>{
		const classData={
			A: {
				parents: {},
				traits: {
					prop: [['main',['stuff a']]],
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
					prop: [
						['note',['need no stuff a']],
						['close'],
					],
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
			const trLayout=new TrLayout(
				['A','B','C','D'],
				classData
			)
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
			const trLayout=new TrLayout(
				['B','C','D'],
				classData
			)
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
			const trLayout=new TrLayout(
				['B','D'],
				classData
			)
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
			const trLayout=new TrLayout(
				['C','D'],
				classData
			)
			assert.deepEqual(trLayout.getSubtreeLayout(
				['prop']
			),[
				[],
				[],
			])
		})
	})
	context("on diamond with closed trait",()=>{
		const classData={
			A: {
				parents: {},
				traits: {
					prop: [['main',['stuff a']]],
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
					prop: [
						['note',['need no stuff a']],
						['close'],
					],
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
			const trLayout=new TrLayout(
				['A','B','C','D'],
				classData
			)
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
			const trLayout=new TrLayout(
				['B','D'],
				classData
			)
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
			const trLayout=new TrLayout(
				['C','D'],
				classData
			)
			assert.deepEqual(trLayout.getSubtreeLayout(
				['prop']
			),[
				[],
				[],
			])
		})
	})
	*/
})
