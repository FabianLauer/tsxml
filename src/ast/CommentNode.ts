import {TextNode} from './TextNode';
import {IStringificationParams} from './IStringificationParams';

export class CommentNode extends TextNode {
	/**
	 * @override
	 */
	protected stringify(params: IStringificationParams, nodeIndentDepth?: number): string {
		nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
		return `${CommentNode.generateIndentString(params.indentChar, nodeIndentDepth)}<!--${this.stringifyContent(params, nodeIndentDepth)}-->${params.newlineChar}`;
	}
}