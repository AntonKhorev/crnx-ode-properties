'use strict'

const chai=require('chai')
const expect=chai.expect
chai.use(require('chai-roughly'))

const updateMatrixElementsForTrDet=require('../../src/lhc-plot/matrix-elements-for-tr-det')

describe("updateMatrixElementsForTrDet",()=>{
	it("changes trace of I",()=>{
		const result=updateMatrixElementsForTrDet(1,0,0,1,4,4)
		expect(result).to.roughly.deep.equal([2,0,0,2])
	})
	it("changes det of I",()=>{
		const result=updateMatrixElementsForTrDet(1,0,0,1,2,0)
		expect(result).to.roughly.deep.equal([1,1,1,1])
	})
	it("results in correct tr and det for arbitrary matrix elements",()=>{
		const result=updateMatrixElementsForTrDet(345,237,785,892,893,931)
		const tr=result[0]+result[3]
		const det=result[0]*result[3]-result[1]*result[2]
		expect([tr,det]).to.roughly.deep.equal([893,931])
	})
})
