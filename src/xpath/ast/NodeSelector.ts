import * as xml from '../../ast';
import {NodeSet} from './NodeSet';
import {Selector} from './Selector';
import {ContextSelector} from './ContextSelector';
import {Predicate} from './Predicate';

export class NodeSelector extends Selector<xml.SelfClosingNode | xml.ContainerNode<xml.Node>> {
	/**
	 * Creates a node selector object.
	 */
	constructor() {
		super();
	}
	
	
	/**
	 * Returns the selector's context.
	 * @override
	 */
	protected getContext(): ContextSelector {
		return super.getContext();
	}
	
	
	/**
	 * Sets the selector's context.
	 * @chainable
	 * @override
	 * @param context The new context for the selector.
	 */
	protected setContext(context: ContextSelector) {
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
	protected getPredicate(): Predicate {
		return super.getPredicate();
	}
	
	
	/**
	 * Sets the selector's predicate.
	 * @chainable
	 * @override
	 * @param predicate The new predicate for the selector.
	 */
	protected setPredicate(predicate: Predicate) {
		super.setPredicate(predicate);
		return this;
	}
	
	
	/**
	 * Returns whether the selector has a specified predicate.
	 * @override
	 */
	protected hasSpecifiedPredicate(): boolean {
		return super.hasSpecifiedPredicate();
	}
	
	
	protected executeConcrete(context: NodeSet<xml.Node>): NodeSet<xml.SelfClosingNode | xml.ContainerNode<xml.Node>> {
		context = this.applyContextSelector(context);
		/// TODO: implement this method completely
		return this.applyPredicate(context);
	}
}