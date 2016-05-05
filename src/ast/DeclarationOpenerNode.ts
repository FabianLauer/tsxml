import {Node} from './Node';
import {IStringificationParams} from './IStringificationParams';

export class DeclarationOpenerNode extends Node {
	public systemLiterals: string[] = [];
	
	
	public isSystemLiteralListIdenticalTo(otherNode: DeclarationOpenerNode): boolean {
		if (this.systemLiterals.length !== otherNode.systemLiterals.length) {
			return false;
		}
		for (let i = 0; i < this.systemLiterals.length; i++) {
			if (this.systemLiterals[i] !== otherNode.systemLiterals[i]) {
				return false;
			}
		}
		return true;
	}
	
	
	/**
	 * Checks whether a node is identical to another node by comparing tag names, attribute names and values and content.
	 */
	public isIdenticalTo(otherNode: DeclarationOpenerNode): boolean {
		return super.isIdenticalTo(otherNode) && this.isSystemLiteralListIdenticalTo(otherNode);
	}
	
	
	/**
	 * @override
	 */
	protected stringify(params: IStringificationParams, nodeIndentDepth?: number): string {
		nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
		return `${Node.generateIndentString(params.indentChar, nodeIndentDepth)}<!${this.tagName}${this.stringifyAttributes(nodeIndentDepth)}${this.stringifySystemLiterals()}>${params.newlineChar}`;
	}
	
	
	private stringifySystemLiterals(): string {
		if (this.systemLiterals.length > 0) {
			return ' ' + this.systemLiterals.map<string>(literal => `"${literal}"`).join(' ');
		}
		return '';
	}
}