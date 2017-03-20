'use strict'

const detailsPolyfill=require('crnx-base/details-polyfill')

const mathjaxDetailsFixAndPolyfill=function(){
	detailsPolyfill.apply(this)
	$(this).on('toggle',function(){
		// mathjax common html renderer needs this to set correct font size
		// have to do it on every details opening, not just once b/c user can request redraw at any time
		// closed <details> behave like display:none; see http://stackoverflow.com/questions/36779037/mathjax-2-6-font-size-in-hidden-elements
		if ($(this).attr('open')) { // can't test for prop('open') when it's polyfilled
			MathJax.Hub.Queue(["Rerender",MathJax.Hub,this])
		}
	})
}

// produces array of <tr>'s in this.$trs
class TraitRowsOutput {
	constructor(i18n,theadLayout,trLayout,traitData,classData,traitAlignmentLevel,notation) {
		const writeTraitItem=(forClassId,fromClassId,traitId,selectedForm)=>{
			const trait=classData[fromClassId].traits[traitId]
			//if (!trait.contents) return // impossible? TODO check if it's possible
			const getTitle=()=>{
				if (trait.title!==undefined) {
					return trait.title
				} else if (trait.compare) {
					return "Property comparable to <em>"+i18n('trait.'+traitId)+"</em>"
				} else {
					return i18n('trait.'+traitId)
				}
			}
			const $trait=$("<details class='trait'>").append(
				$("<summary>").append(getTitle())
			).each(mathjaxDetailsFixAndPolyfill)
			const rec=(line)=>{
				if (typeof line == 'string') {
					return $("<div class='line'>").append(line)
				} else if (typeof line == 'function') {
					return line()
				} else if (line.type=='derivation' || line.type=='proof' || line.type=='example' || line.type=='case') {
					return $("<details>").append(
						$("<summary>").append(line.title!==undefined ? line.title : line.type),
						line.content.map(rec)
					).each(mathjaxDetailsFixAndPolyfill)
				} else if (line.type=='switch') {
					return $("<div class='"+line.type+"'>").append(
						$("<div class='condition'>").append(line.title!==undefined ? line.title : line.type,':'),
						$("<div class='cases'>").append(
							line.content.map(rec)
						)
					)
				} else {
					return $("<div class='"+line.type+"'>").append(
						line.content.map(rec)
					)
				}
			}
			let hasSelectedForm=false
			for (let selectedFormType of selectedForm.split(',')) {
				if (trait.contents[selectedFormType]!==undefined) {
					$trait.append(trait.contents[selectedFormType](notation))
					hasSelectedForm=true
					break
				}
			}
			if (!hasSelectedForm) {
				let preferredForm
				for (let form of classData[fromClassId].forms) {
					if (form.is.split(',').includes(trait.formType)) {
						preferredForm=form
					}
				}
				$trait.append(
					rec({type:'note',content:[
						"when equation is written as"+(forClassId!=fromClassId ? " <em>"+classData[fromClassId].htmlName+"</em>:" : ":"),
						"\\["+preferredForm.equation(notation)+"\\]",
					]}),
					trait.contents[trait.formType](notation)
				)
			}
			return $trait
		}
		const writeTraitCell=(forClassId,traitCell)=>{
			const $cell=$("<td>")
			if (traitCell.length>0) {
				// TODO put trait+form logic into TrLayout
				const selectedForm=classData[forClassId].forms[0].is // TODO pass to ctor
				const selectedFormTypes=selectedForm.split(',')
				let traitCellFitting=traitCell.filter(([fromClassId,traitId])=>{
					const trait=classData[fromClassId].traits[traitId]
					return selectedFormTypes.some(selectedFormType=>trait.contents[selectedFormType]!==undefined)
				})
				if (traitCellFitting.length==0) {
					traitCellFitting=traitCell
				}
				$cell.append(traitCellFitting.map(([fromClassId,traitId])=>{
					return writeTraitItem(forClassId,fromClassId,traitId,selectedForm)
				}))
			}
			return $cell
		}
		const writeTraitRow=(traitSubtree)=>{
			const traitCells=trLayout.getSubtreeLayout(traitSubtree)
			if (!traitCells) return null
			return $("<tr>").append(traitCells.map(
				(traitCell,i)=>writeTraitCell(theadLayout.columns[i],traitCell)
			))
		}
		this.$trs=[]
		const rec=(traitSubtree,depth)=>{
			const traitId=traitSubtree[0]
			const traitChildren=traitSubtree[1]
			if (depth>=traitAlignmentLevel || !traitChildren) {
				this.$trs.push(writeTraitRow(traitSubtree))
			} else {
				traitChildren.forEach(traitChild=>rec(traitChild,depth+1))
			}
		}
		rec(['root',traitData],0)
	}
	updateForm(classId,form) {
		// TODO
		console.log('called updateForm',classId,form)
	}
}

module.exports=TraitRowsOutput
