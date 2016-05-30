import * as test from '../../../src/test';
import * as xml from '../../../src/index';


class EmptyParsing extends test.UnitTest {
	protected async performTest() {
		const ast = await xml.xpath.parser.Parser.parseXPathQueryToAst('');
		await this.assert(ast instanceof xml.xpath.ast.Expression, 'parser always generates an expression ast node');
	}
}


@TestRunner.testName('Basic XPath Parsing')
export class TestRunner extends test.TestRunner {
	constructor() {
		super();
		this.add(
			new EmptyParsing()
		);
	}
}