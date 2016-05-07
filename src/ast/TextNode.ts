import {Node} from './Node';
import {IStringificationParams} from './IStringificationParams';

/**
 * Base class for all nodes that may contain child elements.
 */
export class TextNode extends Node {
	public content: string;
	
	
	public getContentLines(): string[] {
		if (typeof this.content !== 'string' || this.content.length < 1) {
			return [];
		}
		return this.content.split(/\r?\n/);
	}
	
	
	/**
	 * Returns whether the text content contains line breaks.
	 */
	public isContentMultiline(): boolean {
		return this.getContentLines().length > 1;
	}
	
	
	public isContentIdenticalTo(otherNode: TextNode): boolean {
		return (this.content || '').trim() === (otherNode.content || '').trim();
	}
	
	
	/**
	 * Checks whether a node is identical to another node by comparing tag names, attribute names and values and content.
	 */
	public isIdenticalTo(otherNode: TextNode): boolean {
		return super.isIdenticalTo(otherNode) && this.isContentIdenticalTo(otherNode);
	}
	
	
	protected stringify(params: IStringificationParams, nodeIndentDepth?: number): string {
		return `${Node.generateIndentString(params.indentChar, nodeIndentDepth)}${this.stringifyContent(params, nodeIndentDepth)}${params.newlineChar}`;
	}
	
	
	protected stringifyContent(params: IStringificationParams, nodeIndentDepth?: number): string {
		if (this.isContentMultiline()) {
			return this.stringifyMultilineContent(params, nodeIndentDepth);
		}
		return ` ${(this.content || '').trim().replace(/\r?\n/g, ' ')} `;
	}
	
	
	private stringifyMultilineContent(params: IStringificationParams, nodeIndentDepth?: number): string {
		var stringifiedContent = '\n';
		nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
		stringifiedContent += this.getContentLines().map<string>(contentLine => {
			return Node.generateIndentString(params.indentChar, nodeIndentDepth + 1) + contentLine.trim();
		}).join(params.newlineChar);
		return stringifiedContent;
	}
}