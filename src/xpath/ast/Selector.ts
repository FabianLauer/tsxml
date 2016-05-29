import * as xml from '../../ast';
import {ExecutableNode} from './ExecutableNode';
import {Context} from './Context';
import {Predicate} from './Predicate';

export abstract class Selector<TResult extends xml.Node> extends ExecutableNode<TResult> {
	/**
	 * Returns the selector's context.
	 */
	protected getContext(): Context {
		return this.context;
	}
	
	
	/**
	 * Sets the selector's context.
	 * @chainable
	 * @param context The new context for the selector.
	 */
	protected setContext(context: Context) {
		this.context = context;
		return this;
	}
	
	
	/**
	 * Returns whether the selector has a specified context.
	 */
	protected hasSpecifiedContext(): boolean {
		return this.context instanceof Context;
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
	
	
	private context: Context;
	
	
	private predicate: Predicate;
}