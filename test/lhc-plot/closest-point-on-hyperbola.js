'use strict'

const chai=require('chai')
const expect=chai.expect
chai.use(require('chai-roughly'))

const getClosestPointOnHyperbola=require('../../src/lhc-plot/closest-point-on-hyperbola')

describe("getClosestPointOnHyperbola",()=>{
	context("with positive C",()=>{
		it("finds a point closest to (2,2) on x=y line",()=>{
			const result=getClosestPointOnHyperbola(1,2,2)
			expect(result).to.roughly.deep.equal([1,1])
		})
		it("finds a point closest to (0,0) on x=y line",()=>{
			const result=getClosestPointOnHyperbola(1,0,0)
			expect(result).to.roughly.deep.equal([1,1])
		})
		it("finds a point closest to (2,0.5)",()=>{
			const result=getClosestPointOnHyperbola(1,2,0.5)
			expect(result).to.roughly.deep.equal([2,0.5])
		})
		it("finds a point closest to (1,0)",()=>{
			const result=getClosestPointOnHyperbola(1,1,0)
			expect(result).to.roughly.deep.equal([1.380277569097612,0.72449195900052])
		})
		it("finds a point closest to (-2,-2) on x=y line",()=>{
			const result=getClosestPointOnHyperbola(1,-2,-2)
			expect(result).to.roughly.deep.equal([-1,-1])
		})
	})
	context("with negative C",()=>{
		it("finds a point closest to (2,-2) on x=y line",()=>{
			const result=getClosestPointOnHyperbola(-1,2,-2)
			expect(result).to.roughly.deep.equal([1,-1])
		})
	})
	context("with zero C",()=>{
		it("snaps to x axis",()=>{
			const result=getClosestPointOnHyperbola(0,2,-1)
			expect(result).to.roughly.deep.equal([2,0])
		})
		it("snaps to y axis",()=>{
			const result=getClosestPointOnHyperbola(0,1,-2)
			expect(result).to.roughly.deep.equal([0,-2])
		})
	})
})
