'use strict'

// TODO include in notation.js

const tex=require('./tex')

class TexDepvar {
	//abstract:
	// _(...ii)
	// toString()
	// parallelExpression(template)
	// firstComponentExpressionPreamble(template)
	// firstComponentExpression(template)
	// restDiffComponentExpressionContent()(nt) // TODO remove nt
	// ICLinearSystemSolution([a,b,c,d],[k1,k2])(nt)
	// generalLinearSolution([k1,k2],[exp1,exp2],[a11,a12,a21,a22],[b11,b12,b21,b22])(systemLineBreak,vectorLineBreak,expInFront)(nt)
	matMul(mata,matb) {
		if (matb!==undefined) {
			const [a11,a12,a21,a22]=mata
			const [b11,b12,b21,b22]=matb
			return [
				tex.sum([a11,b11,'+',a12,b21],o=>'{'+o+'}'),
				tex.sum([a11,b12,'+',a12,b22],o=>'{'+o+'}'),
				tex.sum([a21,b11,'+',a22,b21],o=>'{'+o+'}'),
				tex.sum([a21,b12,'+',a22,b22],o=>'{'+o+'}'),
			]
		} else {
			return mata
		}
	}
}

module.exports=TexDepvar
