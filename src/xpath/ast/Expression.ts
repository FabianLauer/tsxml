import * as xml from '../../ast';
import {NodeSet} from './NodeSet';
import {ExecutableNode} from './ExecutableNode';

export class Expression extends ExecutableNode<xml.Node> {
	/**
	 * Adds a sub-expression to an expression.
	 * @chainable
	 */
	public addSubExpression(subExpression: Expression) {
		this.subExpressions.push(subExpression);
		return this;
	}
	
	
	/**
	 * Returns all sub-expressions of an expression.
	 */
	public getSubExpressions(): Expression[] {
		return [].concat(this.subExpressions);
	}
	
	
	protected executeConcrete(context: NodeSet<xml.Node>): NodeSet<xml.Node> {
		const result = new NodeSet<xml.Node>();
		this.subExpressions.forEach(subExpression => result.merge(subExpression.execute(context)));
		return result;
	}
	
	
	private subExpressions: Expression[] = [];
}