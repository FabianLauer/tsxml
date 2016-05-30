import * as xml from '../../ast';
import {NodeSet} from './NodeSet';
import {ExecutableNode} from './ExecutableNode';

export abstract class PredicateOperation extends ExecutableNode<xml.Node> {
	protected executeConcrete(context: NodeSet<xml.Node>): NodeSet<xml.Node> {
		throw 'not implemented';
	}
}