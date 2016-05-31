import * as xml from '../../ast';
import {NodeSet} from './NodeSet';
import {ExecutableNode} from './ExecutableNode';
import {ContextSelector} from './ContextSelector';
import {Predicate} from './Predicate';

export abstract class Selector<TResult extends xml.Node> extends ExecutableNode<TResult> {
	/**
	 * Returns the selector's context.
	 */
	protected getContext(): ContextSelector {
		return this.context;
	}
	
	
	/**
	 * Sets the selector's context.
	 * @chainable
	 * @param context The new context for the selector.
	 */
	protected setContext(context: ContextSelector) {
		this.context = context;
		return this;
	}
	
	
	/**
	 * Returns whether the selector has a specified context.
	 */
	protected hasSpecifiedContext(): boolean {
		return this.context instanceof ContextSelector;
	}
	
	
	/**
	 * Returns the selector's predicate.
	 */
	protected getPredicate(): Predicate {
		return this.predicate;
	}
	
	
	/**
	 * Sets the selector's predicate.
	 * @chainable
	 * @param predicate The new predicate for the selector.
	 */
	protected setPredicate(predicate: Predicate) {
		this.predicate = predicate;
		return this;
	}
	
	
	/**
	 * Returns whether the selector has a specified predicate.
	 */
	protected hasSpecifiedPredicate(): boolean {
		return this.predicate instanceof Predicate;
	}
	
	
	protected applyContextSelector(context: NodeSet<xml.Node>): NodeSet<xml.Node> {
		if (this.hasSpecifiedContext()) {
			return this.getContext().execute(context);
		}
		return context;
	}
	
	
	protected applyPredicate(context: NodeSet<xml.Node>): NodeSet<xml.Node> {
		if (this.hasSpecifiedPredicate()) {
			return this.getPredicate().execute(context);
		}
		return context;
	}
	
	
	protected executeConcrete(context: NodeSet<xml.Node>): NodeSet<TResult> {
		context = this.applyContextSelector(context);
		context = this.applyNodeIdentifier(context);
		return <NodeSet<TResult>>this.applyPredicate(context);
	}
	
	
	protected abstract applyNodeIdentifier(context: NodeSet<xml.Node>): NodeSet<TResult>;
	
	
	private context: ContextSelector;
	
	
	private predicate: Predicate;
}