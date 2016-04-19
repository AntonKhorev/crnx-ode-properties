'use strict'

// TODO fake lodash
const sum=arr=>arr.reduce((a,b)=>a+b)
//const times=(n,fn)=>Array(n).map((v,i)=>fn(i))
const times=(n,fn)=>{
	var arr=Array(n)
	for (var i=0;i<n;i++) {
		arr[i]=fn(i)
	}
	return arr
}
const head=arr=>arr[0]
const last=arr=>arr[arr.length-1]

module.exports=(nodeLabelLayers,arcLocationLayers)=>{
	const layoutWidth=sum(nodeLabelLayers.map(x=>x.length))
	const makeBlankRow=()=>times(layoutWidth,()=>({}))
	const nodeLayoutLayers=[], arcLayoutLayers=[]
	const drawArcUp=(i,j,k)=>{
		for (;i>=0;i--) {
			for (j-=1;j>=0;j--) {
				arcLayoutLayers[i][j][k].bt=true
			}
			if (nodeLayoutLayers[i][k].node!==undefined) {
				return
			}
			nodeLayoutLayers[i][k].bt=true
			if (i<=0) {
				return
			}
			j=arcLayoutLayers[i-1].length
		}
	}
	const drawArcDown=(i,j,k)=>{
		for (j+=1;j<arcLayoutLayers[i].length;j++) {
			arcLayoutLayers[i][j][k].bt=true
		}
	}
	let x=0
	for (let i=0;i<nodeLabelLayers.length;i++) {
		nodeLayoutLayers.push(makeBlankRow())
		nodeLabelLayers[i].forEach(node=>{
			nodeLayoutLayers[i][x++].node=node
		})
		if (i>=arcLocationLayers.length) continue
		arcLayoutLayers.push([])
		for (let j=0;j<arcLocationLayers[i].length;j++) {
			arcLayoutLayers[i].push(makeBlankRow())
		}
		for (let j=0;j<arcLocationLayers[i].length;j++) {
			const parentLocations=arcLocationLayers[i][j][0]
			const childLocations=arcLocationLayers[i][j][1]
			let pi=0, ci=0
			for (let k=0;k<layoutWidth;k++) {
				if (k>head(parentLocations) && k<last(childLocations)) {
					arcLayoutLayers[i][j][k].rl=true
				}
				if (k==parentLocations[pi]) {
					pi++
					arcLayoutLayers[i][j][k].rt=true
					drawArcUp(i,j,k)
				}
				if (k==childLocations[ci]) {
					ci++
					arcLayoutLayers[i][j][k].bl=true
					drawArcDown(i,j,k)
				}
			}
		}
	}
	return [nodeLayoutLayers,arcLayoutLayers]
}
