import * as test from '../../../src/test';
import * as xml from '../../../src/index';


abstract class ParserTest extends test.UnitTest {
	protected async parseXPathQuery(xpathString: string): Promise<xml.xpath.ast.Expression> {
		return xml.xpath.parser.Parser.parseXPathQueryToAst(xpathString);
	}
}


class EmptyParsing extends ParserTest {
	protected async performTest() {
		const ast = await this.parseXPathQuery('');
		await this.assert(ast instanceof xml.xpath.ast.Expression, 'parser always generates an expression ast node');
	}
}


class TagNameWithoutNamespacePrefixSelector extends ParserTest {
	protected async performTest() {
		const expression = await this.parseXPathQuery('test'),
			  selector = <xml.xpath.ast.NodeSelector>expression.getAllParts()[0];
		await this.assert(expression.getNumberOfParts() === 1, 'expression has correct number of parts');
		await this.assert(selector instanceof xml.xpath.ast.NodeSelector, 'selector has correct type');
		await this.assert(selector.namespacePrefix === undefined, 'selector has correct namespace prefix');
		await this.assert(selector.tagName === 'test', 'selector has correct tag name');
	}
}


class TagNameWithNamespacePrefixSelector extends ParserTest {
	protected async performTest() {
		const expression = await this.parseXPathQuery('foo:bar'),
			  selector = <xml.xpath.ast.NodeSelector>expression.getAllParts()[0];
		await this.assert(expression.getNumberOfParts() === 1, 'expression has correct number of parts');
		await this.assert(selector instanceof xml.xpath.ast.NodeSelector, 'selector has correct type');
		await this.assert(selector.namespacePrefix === 'foo', 'selector has correct namespace prefix');
		await this.assert(selector.tagName === 'bar', 'selector has correct tag name');
	}
}


class SimpleWildcardSelector extends ParserTest {
	protected async performTest() {
		const expression = await this.parseXPathQuery('*'),
			  selector = <xml.xpath.ast.WildcardSelector>expression.getAllParts()[0];
		await this.assert(expression.getNumberOfParts() === 1, 'expression has correct number of parts');
		await this.assert(selector instanceof xml.xpath.ast.WildcardSelector, 'selector has correct type');
		await this.assert(selector.type === xml.xpath.ast.WildcardSelectorType.ElementNodes, 'selector has correct wildcard type');
	}
}


@TestRunner.testName('Basic XPath Parsing')
export class TestRunner extends test.TestRunner {
	constructor() {
		super();
		this.add(
			new EmptyParsing(),
			new TagNameWithoutNamespacePrefixSelector(),
			new TagNameWithNamespacePrefixSelector(),
			new SimpleWildcardSelector()
		);
	}
}