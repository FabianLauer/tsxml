import * as xml from '../../ast';
import {NodeSet} from './NodeSet';
import {ExecutableNode} from './ExecutableNode';

export class Expression extends ExecutableNode<xml.Node> {
	/**
	 * Adds a part to an expression.
	 * @chainable
	 */
	public addPart(part: ExecutableNode<xml.Node>) {
		this.parts.push(part);
		return this;
	}
	
	
	/**
	 * Returns all parts of an expression.
	 */
	public getAllParts(): Array<ExecutableNode<xml.Node>> {
		return [].concat(this.parts);
	}
	
	
	protected executeConcrete(context: NodeSet<xml.Node>): NodeSet<xml.Node> {
		const result = new NodeSet<xml.Node>();
		this.getAllParts().forEach(part => result.merge(part.execute(context)));
		return result;
	}
	
	
	private parts: Array<ExecutableNode<xml.Node>> = [];
}