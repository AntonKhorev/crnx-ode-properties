'use strict'

const assert=require('assert')
const getClosestPointOnHyperbola=require('../../src/lhc-plot/closestPointOnHyperbola')

describe("getClosestPointOnHyperbola",()=>{
	it("finds a point closest to (2,2) on x=y line",()=>{
		const result=getClosestPointOnHyperbola(1,2,2)
		assert.deepEqual(result,[1,1])
	})
	it("finds a point closest to (0,0) on x=y line",()=>{
		const result=getClosestPointOnHyperbola(1,0,0)
		assert.deepEqual(result,[1,1])
	})
	it("finds a point closest to (2,0.5)",()=>{
		const result=getClosestPointOnHyperbola(1,2,0.5)
		assert.deepEqual(result,[2,0.5])
	})
	it("finds a point closest to (1,0)",()=>{
		const result=getClosestPointOnHyperbola(1,1,0)
		assert.deepEqual(result,[1.380277569097612,0.72449195900052])
	})
})
