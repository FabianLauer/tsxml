import * as xml from '../../ast';
import {Node} from './Node';
import {NodeSet} from './NodeSet';

export abstract class ExecutableNode<TResult extends xml.Node> extends Node {
	/**
	 * @final
	 */
	public execute(context: NodeSet<xml.Node>): NodeSet<TResult> {
		return this.executeConcrete(context);
	}
	
	
	protected abstract executeConcrete(context: NodeSet<xml.Node>): NodeSet<TResult>;
}