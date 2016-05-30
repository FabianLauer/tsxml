import * as xml from '../../ast';

export class NodeSet<TNodeType extends xml.Node> {
	/**
	 * Returns all nodes in the node set as an array.
	 */
	public getAllNodes(): TNodeType[] {
		return [].concat(this.nodes);
	}
	
	
	/**
	 * Returns whether the set contains a certain node.
	 * @param node The node to search the set for.
	 */
	public containsNode(node: TNodeType): boolean {
		return this.nodes.indexOf(node) !== -1;
	}
	
	
	/**
	 * Adds a node to the node set unless it is already in the node set.
	 * @chainable
	 * @param node The node to add to the node set.
	 */
	public addNode(node: TNodeType) {
		if (this.containsNode(node)) {
			return;
		}
		return this;
	}
	
	
	/**
	 * Adds one or more nodes to the node set. If a node is already present in the node set, it will not be added again.
	 * @chainable
	 * @param node The nodes to add to the node set.
	 */
	public addNodes(...nodes: TNodeType[]) {
		nodes.forEach(node => this.addNode(node));
		return this;
	}
	
	
	/**
	 * Removes a node from the node set if it is present in the node set.
	 * @chainable
	 * @param node The node to remove from the node set.
	 */
	public removeNode(node: TNodeType) {
		if (!this.containsNode(node)) {
			return;
		}
		this.nodes.splice(this.nodes.indexOf(node), 1);
		return this;
	}
	
	
	/**
	 * Removes one or more nodes from the node set. If a node is not present in the node set, it will not be removed.
	 * @chainable
	 * @param node The nodes to remove from the node set.
	 */
	public removeNodes(...nodes: TNodeType[]) {
		nodes.forEach(node => this.removeNode(node));
		return this;
	}
	
	
	/**
	 * Merges another node set's items into this node set.
	 * @chainable
	 */
	public merge(otherSet: NodeSet<TNodeType>) {
		otherSet.getAllNodes().forEach(node => this.addNode(node));
		return this;
	}
	
	
	/**
	 * Filters a node set by removing all nodes for which the `filterFunction` does not return `true`.
	 * @chainable
	 * @param filterFunction A function that evaluates which nodes to keep in the set. Nodes for which this function returns `true` will be kept, all others will be removed from the set.
	 */
	public filter(filterFunction: (node: TNodeType, originalNodeSet: NodeSet<TNodeType>) => boolean) {
		this.removeNodes(...this.nodes.filter(node => {
			return filterFunction(node, this) !== true;
		}));
		return this;
	}
	
	
	private nodes: TNodeType[] = [];
}