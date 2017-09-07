'use strict'

// TODO include in notation.js

const TexScalarDepvar=require('./tex-scalar-depvar')
const TexVectorDepvar=require('./tex-vector-depvar')

class TexVector2Depvar extends TexVectorDepvar {
	_(...ii) {
		return new TexVector2Depvar(this.X,this.x,[...this.subscripts,...ii])
	}
	restDiffComponentExpressionContent() {
		const x=new TexScalarDepvar(this.x,this.subscripts)
		return nt=>[
			`find other component by differentiating \\( ${x} \\):`,
			`\\[ ${this} = \\begin{bmatrix}`+
				`${x} \\\\`+
				`${nt.dd(x,'t',1)}`+
			`\\end{bmatrix} \\]`,
		]
	}
}

module.exports=TexVector2Depvar
