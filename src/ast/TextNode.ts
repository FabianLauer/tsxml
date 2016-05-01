import {Node} from './Node';
import {IStringificationParams} from './IStringificationParams';

/**
 * Base class for all nodes that may contain child elements.
 */
export class TextNode extends Node {
	public content: string;
	
	
	protected stringify(params: IStringificationParams, nodeIndentDepth?: number): string {
		return `${Node.generateIndentString(params.indentChar, nodeIndentDepth)}${this.content || ''}${params.newlineChar}`;
	}
}