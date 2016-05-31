import * as xml from '../../ast';
import {NodeSet} from './NodeSet';
import {Selector} from './Selector';
import {WildcardSelectorType} from './WildcardSelectorType';

export class WildcardSelector extends Selector<xml.Node> {
	/**
	 * Creates a wildcard selector node.
	 * @param type The type of wildcard selector the created node represents.
	 */
	constructor(private type: WildcardSelectorType) {
		super();
	}
	
	
	public getWildcardSelectorType(): WildcardSelectorType {
		return this.type;
	}
	
	
	protected applyNodeIdentifier(context: NodeSet<xml.Node>): NodeSet<xml.Node> {
		return context;
	}
}