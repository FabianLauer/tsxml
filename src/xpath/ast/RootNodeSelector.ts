import * as xml from '../../ast';
import {NodeSet} from './NodeSet';
import {NodeSelector} from './NodeSelector';
import {ContextSelector} from './ContextSelector';
import {Predicate} from './Predicate';

export class RootNodeSelector extends NodeSelector {
	/**
	 * Creates a root node selector object.
	 */
	constructor() {
		super();
	}
	
	
	/**
	 * Returns the selector's context.
	 * @override
	 */
	protected getContext(): ContextSelector {
		return undefined;
	}
	
	
	/**
	 * Sets the selector's context.
	 * @chainable
	 * @override
	 * @param context The new context for the selector.
	 */
	protected setContext(context: ContextSelector) {
		return this;
	}
	
	
	/**
	 * Returns whether the selector has a specified context.
	 * @override
	 */
	public hasSpecifiedContext(): boolean {
		return undefined;
	}
	
	
	/**
	 * Returns the selector's predicate.
	 * @override
	 */
	protected getPredicate(): Predicate {
		return undefined;
	}
	
	
	/**
	 * Sets the selector's predicate.
	 * @chainable
	 * @override
	 * @param predicate The new predicate for the selector.
	 */
	protected setPredicate(predicate: Predicate) {
		return this;
	}
	
	
	/**
	 * Returns whether the selector has a specified predicate.
	 * @override
	 */
	protected hasSpecifiedPredicate(): boolean {
		return undefined;
	}
	
	
	/**
	 * @override
	 */
	protected executeConcrete(context: NodeSet<xml.Node>): NodeSet<xml.SelfClosingNode | xml.ContainerNode<xml.Node>> {
		throw 'not implemented';
	}
}