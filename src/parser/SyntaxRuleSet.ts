import {TagSyntaxRule} from './TagSyntaxRule';

export class SyntaxRuleSet {
	public hasTagSyntaxRule(rule: TagSyntaxRule): boolean {
		return this.tagSyntaxRules.indexOf(rule) !== -1;
	}
	
	
	public getAllTagSyntaxRules(): TagSyntaxRule[] {
		return [].concat(this.tagSyntaxRules);
	}
	
	
	/**
	 * @chainable
	 */
	public addTagSyntaxRule(rule: TagSyntaxRule) {
		if (!this.hasTagSyntaxRule(rule)) {
			this.tagSyntaxRules.push(rule);
		}
		return this;
	}
	
	
	/**
	 * @chainable
	 */
	public addTagSyntaxRules(...rules: TagSyntaxRule[]) {
		rules.forEach(rule => this.addTagSyntaxRule(rule));
		return this;
	}
	
	
	private tagSyntaxRules: TagSyntaxRule[] = [];
}