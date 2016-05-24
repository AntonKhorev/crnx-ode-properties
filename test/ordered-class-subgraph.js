'use strict'

const assert=require('assert')
const UnorderedClassSubgraph=require('../src/unordered-class-subgraph')
const OrderedClassSubgraph=require('../src/ordered-class-subgraph')

const makeUnorderedSubgraph=(parents,visibleNodes)=>{
	const data={}
	for (let id in parents) {
		data[id]={
			parents: parents[id],
		}
	}
	return new UnorderedClassSubgraph(data,visibleNodes)
}

describe("OrderedClassSubgraph",()=>{
	context("with 1 node",()=>{
		const orderedClassSubgraph=new OrderedClassSubgraph(makeUnorderedSubgraph({
			A:{},
		},{
			A:true,
		}),['A'])
		it("has visible parents",()=>{
			assert.deepEqual(orderedClassSubgraph.visibleParents,{
				A:[],
			})
		})
	})
	context("with v-fork and reverse order",()=>{
		const orderedClassSubgraph=new OrderedClassSubgraph(makeUnorderedSubgraph({
			A:{},
			B:{},
			C:{A:true,B:true}
		},{
			A:true,
			B:true,
			C:true,
		}),['C','B','A'])
		it("has visible parents",()=>{
			assert.deepEqual(orderedClassSubgraph.visibleParents,{
				A:[],
				B:[],
				C:['B','A'],
			})
		})
	})
})
