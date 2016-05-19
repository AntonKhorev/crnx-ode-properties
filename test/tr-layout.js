'use strict'

const assert=require('assert')
const makeTrLayout=require('../src/tr-layout')

describe("makeTrLayout",()=>{
	it("supports redefined trait",()=>{
		const trLayout=makeTrLayout(
			['prop'],
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
		assert.deepEqual(trLayout,[
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
		const trLayout=makeTrLayout(
			['prop',[
				['subprop1'],
				['subprop2'],
			]],
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
		assert.deepEqual(trLayout,[
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
		const trLayout=makeTrLayout(
			['prop'],
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
		assert.deepEqual(trLayout,[
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
		const trLayout=makeTrLayout(
			['prop'],
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
		assert.deepEqual(trLayout,[
			[
				['A','prop'],
			],
			[
				['C','prop'],
			],
		])
	})
	it("supports fork-inherited trait",()=>{
		const trLayout=makeTrLayout(
			['prop'],
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
		assert.deepEqual(trLayout,[
			[
				['A','prop'],
				['B','prop'],
			],
		])
	})
	it("supports diamond-inherited trait",()=>{
		const trLayout=makeTrLayout(
			['prop'],
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
		assert.deepEqual(trLayout,[
			[
				['A','prop'],
			],
		])
	})
	it("supports diamond-inherited trait with one parent visible",()=>{
		const trLayout=makeTrLayout(
			['prop'],
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
		assert.deepEqual(trLayout,[
			[
				['A','prop'],
			],
			[],
		])
	})
	it("skips diamond-inherited trait when parent with trait is visible",()=>{
		const trLayout=makeTrLayout(
			['prop'],
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
		assert.deepEqual(trLayout,[
			[
				['C','prop'],
			],
			[],
		])
	})
	it("displays diamond-inherited trait for parent when different parent with trait is invisible",()=>{
		const trLayout=makeTrLayout(
			['prop'],
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
		assert.deepEqual(trLayout,[
			[
				['A','prop'],
			],
			[
				['C','prop'],
			],
		])
	})
})
