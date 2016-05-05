import {Node} from './Node';
import {IStringificationParams} from './IStringificationParams';

/**
 * Base class for all nodes that may contain child elements.
 */
export class TextNode extends Node {
	public content: string;
	
	
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
		return `${Node.generateIndentString(params.indentChar, nodeIndentDepth)}${this.content || ''}${params.newlineChar}`;
	}
}