import {TagCloseMode} from '../TagCloseMode';
import {TagSyntaxRule} from '../TagSyntaxRule';
import {SyntaxRuleSet} from '../SyntaxRuleSet';

export class Html5 extends SyntaxRuleSet {
	constructor() {
		super();
		// see https://www.w3.org/TR/html-markup/syntax.html#syntax-elements
		const voidTagSyntaxRule = TagSyntaxRule.createForTagNames(
			'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'
		);
		voidTagSyntaxRule.setCloseMode(TagCloseMode.Void);
		this.addTagSyntaxRule(voidTagSyntaxRule);
	}
}