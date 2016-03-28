'use strict'

const isEqual=require('lodash.isequal')

module.exports=(depthList,parents)=>{
	const merge=(a,b)=>{ // can also use lodash union and sort
		const c=[]
		let i=0, j=0
		while (i<a.length || j<b.length) {
			if (j>=b.length) {
				c.push(a[i++])
			} else if (i>=a.length) {
				c.push(b[j++])
			} else if (a[i]<b[j]) {
				c.push(a[i++])
			} else if (a[i]>b[j]) {
				c.push(b[j++])
			} else {
				c.push(a[i++])
				j++
			}
		}
		return c
	}
	const arcRows=[]
	const xs={}
	let x=0
	for (let i=0;i<depthList.length;i++) {
		depthList[i].forEach(node=>{
			xs[node]=x++
		})
		if (i>0) {
			const arcs=[]
			depthList[i].forEach(node=>{
				const parentXs=Object.keys(parents[node]).map(parentNode=>xs[parentNode])
				arcs.push([parentXs,[xs[node]]])
			})
			arcs.sort().reverse()
			for (let j=1;j<arcs.length;j++) {
				if (isEqual(arcs[j-1][0],arcs[j][0])) {
					arcs[j-1][1]=merge(arcs[j-1][1],arcs[j][1])
					arcs.splice(j,1)
					if (j>1) j-=2
					continue
				}
				if (isEqual(arcs[j-1][1],arcs[j][1])) {
					arcs[j-1][0]=merge(arcs[j-1][0],arcs[j][0])
					arcs.splice(j,1)
					if (j>1) j-=2
					continue
				}
			}
			arcRows.push(arcs)
		}
	}
	return arcRows
}
