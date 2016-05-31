import * as xml from '../../ast';
import {NodeSet} from './NodeSet';
import {Selector} from './Selector';
import {ContextSelector} from './ContextSelector';
import {Predicate} from './Predicate';

export class NodeSelector extends Selector<xml.SelfClosingNode | xml.ContainerNode<xml.Node>> {
	/**
	 * The namespace prefix to select.
	 */
	public namespacePrefix: string;
	
	
	/**
	 * The tag name to select.
	 */
	public tagName: string;
	
	
	/**
	 * Returns the selector's context.
	 * @override
	 */
	public getContext(): ContextSelector {
		return super.getContext();
	}
	
	
	/**
	 * Sets the selector's context.
	 * @chainable
	 * @override
	 * @param context The new context for the selector.
	 */
	public setContext(context: ContextSelector) {
		super.setContext(context);
		return this;
	}
	
	
	/**
	 * Returns whether the selector has a specified context.
	 * @override
	 */
	public hasSpecifiedContext(): boolean {
		return super.hasSpecifiedContext();
	}
	
	
	/**
	 * Returns the selector's predicate.
	 * @override
	 */
	public getPredicate(): Predicate {
		return super.getPredicate();
	}
	
	
	/**
	 * Sets the selector's predicate.
	 * @chainable
	 * @override
	 * @param predicate The new predicate for the selector.
	 */
	public setPredicate(predicate: Predicate) {
		super.setPredicate(predicate);
		return this;
	}
	
	
	/**
	 * Returns whether the selector has a specified predicate.
	 * @override
	 */
	public hasSpecifiedPredicate(): boolean {
		return super.hasSpecifiedPredicate();
	}
	
	
	protected applyNodeIdentifier(context: NodeSet<xml.Node>): NodeSet<xml.SelfClosingNode | xml.ContainerNode<xml.Node>> {
		return context.filter(node => node.namespacePrefix === this.namespacePrefix && node.tagName === this.tagName);
	}
}