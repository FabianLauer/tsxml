import * as test from '../../src/test';
import * as xml from '../../src/index';


class AttributeProxyPropertyDefinition extends test.UnitTest {
	protected async performTest() {
		const testValue = 'test value';
		class SampleNode extends xml.ast.Node {
			@xml.ast.Node.attributeProxyProperty
			public testAttribute = testValue;
		}
		const node = new SampleNode();
		await this.assert(node.testAttribute === testValue, 'property has correct value after definition');
		await this.assert(node.getAttribute('testAttribute') === testValue, 'attribute has correct value after definition');
	}
}


@TestRunner.testName('Decorators')
export class TestRunner extends test.TestRunner {
	constructor() {
		super();
		this.add(
			new AttributeProxyPropertyDefinition()
		);
	}
}