import * as xml from '../../ast';
import {NodeSet} from './NodeSet';
import {ExecutableNode} from './ExecutableNode';

export class ContextSelector extends ExecutableNode<xml.Node> {
	protected executeConcrete(context: NodeSet<xml.Node>): NodeSet<xml.Node> {
		throw 'not implemented';
	}
}