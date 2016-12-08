import * as xml from '../../ast';
import {NodeSet} from './NodeSet';
import {ExecutableNode} from './ExecutableNode';
import {PredicateOperation} from './PredicateOperation';

export class Predicate extends ExecutableNode<xml.Node> {
	/**
	 * Adds a predicate operation to the predicate.
	 * @chainable
	 */
	public addOperation(operation: PredicateOperation) {
		this.operations.push(operation);
	}
	
	
	protected executeConcrete(context: NodeSet<xml.Node>): NodeSet<xml.Node> {
		this.operations.forEach(operation => {
			context = operation.execute(context);
		});
		return context;
	}
	
	
	private operations: PredicateOperation[] = [];
}