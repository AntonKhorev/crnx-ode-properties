'use strict'

module.exports=(depthList,parents)=>{ // TODO would prefer ordered parents list
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
			for (let j=depthList[i].length-1;j>=0;j--) {
				const node=depthList[i][j]
				const parentXs=Object.keys(parents[node]).sort().map(parentNode=>xs[parentNode])
				arcs.push([parentXs,[xs[node]]])
			}
			for (let j=1;j<arcs.length;j++) {
				if (String(arcs[j-1][0])===String(arcs[j][0])) { // sloppy but should be ok for numbers, was already used indirectly for sorting in depth list
					arcs[j-1][1]=merge(arcs[j-1][1],arcs[j][1]) // merge children - parents already merged
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
