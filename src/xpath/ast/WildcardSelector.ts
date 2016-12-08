import * as xml from '../../ast';
import {NodeSet} from './NodeSet';
import {Selector} from './Selector';
import {WildcardSelectorType} from './WildcardSelectorType';

export class WildcardSelector extends Selector<xml.Node> {
	/**
	 * Creates a wildcard selector node.
	 * @param type The type of wildcard selector the created node represents.
	 */
	constructor(public type: WildcardSelectorType) {
		super();
	}
	
	
	public getWildcardSelectorType(): WildcardSelectorType {
		return this.type;
	}
	
	
	protected applyNodeIdentifier(context: NodeSet<xml.Node>): NodeSet<xml.Node> {
		/// TODO: Implement this method.
		if (this.type & WildcardSelectorType.Attributes) {
		}
		if (!(this.type & WildcardSelectorType.ElementNodes)) {
		}
		return context;
	}
}