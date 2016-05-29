import * as xml from '../../ast';

export class NodeSet<TNodeType extends xml.Node> {
	/**
	 * Merges another node set's items into this node set.
	 * @chainable
	 */
	public merge(otherSet: NodeSet<TNodeType>) {
		throw 'not implemented';
		return this;
	}
}