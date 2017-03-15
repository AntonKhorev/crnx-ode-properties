'use strict'

const traits=[
	['entity',[
		['associatedHomogeneousEquation'],
		['characteristicEquation'],
		['halfLife'],
	]],
	['property',[
		['isoclineProperty'],
		['solutionRelation',[
			['shiftSolutionRelation'],
			['linearitySolutionRelation',[ // linear and affine properties of solutions
				['solutionSpaceBasis'],
				['homogeneitySolutionRelation'],
				['additivitySolutionRelation'],
				['twoLinearCombinationSolutionRelation'],
				['nLinearCombinationSolutionRelation'],
				['twoAffineCombinationSolutionRelation'],
				['nAffineCombinationSolutionRelation'],
				['associatedSolutionRelation'],
			]]
		]],
	]],
	['transform',[
		['orderReduction'], // TODO remove
	]],
	['solutionMethod',[
		['generalSolutionMethod'],
		['phaseSolutionMethod'],
		['equilibriumSolutionMethod'],
		['testSolutionMethod'],
	]],
	['plot'],
]

// class entries:
//	forms = array of forms
//	traits = dictionary of traits
//	...TODO complete...
// obsolete class entries:
//	equation = tex equation of primary form
//	vectorEquation
//	hasForm = use this value as form type instead of class id

// form entries:
//	is = array of form types (common types are t,x,xy,xi,X,resolved_*,system_*,vector_*)
//	equation
//	notes = (nt => array)

// trait entries:
//	title = redefine title
//	formType = preferred form type; defaults to last (most specific) form type of first form; this form type will be used when content is not available for requested form
//	content = contents for preferred form type; used to omit lengthier contents entry
//	contents = dictionary of (form type : content)
//	close = children don't need to inherit this trait; display it only if parents have it displayed
//	compare = show only if other classes have this property without compare entry
// obsolete trait entries:
//	form = have to present the equation in which this trait was defined
//		if true: form type is equal to class id
//		otherwise: object: { formType1:true, formType2:true, ... }; usually lists children forms

const classes={}
const merge=(mergedClasses)=>{
	for (let id in mergedClasses) {
		classes[id]=mergedClasses[id]
	}
}
merge(require('./data/equations-1st'))
merge(require('./data/equations-2nd'))
merge(require('./data/equations-nth'))
merge(require('./data/systems'))

module.exports={traits,classes}
