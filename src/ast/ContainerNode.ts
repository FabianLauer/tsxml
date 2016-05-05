import {Node} from './Node';
import {IAttribute} from './IAttribute';
import {IStringificationParams} from './IStringificationParams';

/**
 * Base class for all nodes that may contain child elements.
 */
export class ContainerNode<TChildNode extends Node> extends Node {
	public childNodes: TChildNode[] = [];
	
	
	public getNumberOfChildren(): number {
		return this.childNodes.length;
	}
	
	
	public getChildAtIndex(index: number): TChildNode {
		return this.childNodes[index];
	}
	
	
	public getIndexOfChild(child: TChildNode): number {
		return this.childNodes.indexOf(child);
	}
	
	
	public hasChild(child: TChildNode): boolean {
		return this.getIndexOfChild(child) !== -1;
	}
	
	
	/**
	 * @chainable
	 */
	public insertChildAt(child: TChildNode, index: number): ContainerNode<TChildNode> {
		Node.changeParentNode(child, this);
		this.childNodes.splice(index, 0, child);
		return this;
	}
	
	
	/**
	 * @chainable
	 */
	public removeChildAt(index: number): ContainerNode<TChildNode> {
		const removedNode = this.childNodes.splice(index, 1)[0];
		Node.removeParentNode(removedNode);
		return this;
	}
	
	
	/**
	 * @chainable
	 */
	public insertChildBefore(child: TChildNode, referenceChild: TChildNode): ContainerNode<TChildNode> {
		if (!this.hasChild(referenceChild)) {
			throw new Error('Can not insert child: reference child not found.');
		}
		this.insertChildAt(child, this.getIndexOfChild(referenceChild));
		return this;
	}
	
	
	/**
	 * @chainable
	 */
	public insertChildAfter(child: TChildNode, referenceChild: TChildNode): ContainerNode<TChildNode> {
		if (!this.hasChild(referenceChild)) {
			throw new Error('Can not insert child: reference child not found.');
		}
		this.insertChildAt(child, this.getIndexOfChild(referenceChild) + 1);
		return this;
	}
	
	
	/**
	 * @chainable
	 */
	public prependChild(child: TChildNode): ContainerNode<TChildNode> {
		this.insertChildAt(child, 0);
		return this;
	}
	
	
	/**
	 * @chainable
	 */
	public appendChild(child: TChildNode): ContainerNode<TChildNode> {
		this.insertChildAt(child, this.getNumberOfChildren());
		return this;
	}
	
	
	/**
	 * @chainable
	 */
	public replaceChild(oldChild: TChildNode, newChild: TChildNode): ContainerNode<TChildNode> {
		const index = this.getIndexOfChild(oldChild);
		this.removeChildAt(index);
		this.insertChildAt(newChild, index);
		return this;
	}
	
	
	public forEachChildNode(fn: (childNode: TChildNode, index: number) => void): void {
		(<TChildNode[]>this.childNodes).forEach((childNode, index) => fn(childNode, index));
	}
	
	
	/**
	 * @override
	 */
	protected stringify(params: IStringificationParams, nodeIndentDepth?: number): string {
		nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
		return `${Node.generateIndentString(params.indentChar, nodeIndentDepth)}<${this.tagName}${this.stringifyAttributes(nodeIndentDepth)}>${this.stringifyAllChildNodes(params, nodeIndentDepth + 1)}${Node.generateIndentString(params.indentChar, nodeIndentDepth)}</${this.tagName}>\n`;
	}
	
	
	protected stringifyAllChildNodes(params: IStringificationParams, nodeIndentDepth?: number): string {
		var xml = params.newlineChar;
		this.forEachChildNode(childNode => {
			xml += this.stringifyChildNode(childNode, params, nodeIndentDepth + 1);
		});
		return xml;
	}
	
	
	protected stringifyChildNode(childNode: TChildNode, params: IStringificationParams, nodeIndentDepth?: number): string {
		return (<any>childNode).stringify(params, nodeIndentDepth);
	}
}