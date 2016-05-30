/// Tests correct execution of XPath queries with manually built queries.
import * as test from '../../../src/test';
import * as xml from '../../../src/index';


abstract class QueryTest<TResult extends xml.ast.Node> extends test.UnitTest {
	protected abstract getXmlString(): string;
	
	
	protected abstract getXPathString(): string;
	
	
	protected async prepareTest(): Promise<void> {
		await this.executeXPathQuery();
	}
	
	
	protected get xpathResult() {
		return this._xpathResult;
	}
	
	
	protected get xmlDocument() {
		return this._xmlDocument;
	}
	
	
	private async parseXml(): Promise<void> {
		this._xmlDocument = await xml.Parser.parseStringToAst(this.getXmlString());
	}
	
	
	private async executeXPathQuery(): Promise<void> {
		await this.parseXml();
		const nodeSet = new xml.xpath.ast.NodeSet<xml.ast.Node>().addNode(this.xmlDocument);
		this._xpathResult = <xml.xpath.ast.NodeSet<TResult>>xml.xpath.parser.Parser.parseXPathQueryToAst(this.getXPathString()).execute(nodeSet);
	}
	
	
	private _xmlDocument: xml.ast.DocumentNode;
	
	
	private _xpathResult: xml.xpath.ast.NodeSet<TResult>;
}


class SingleSelfClosingNode extends QueryTest<xml.ast.SelfClosingNode> {
	protected getXmlString(): string {
		return '<alpha />';
	}
	
	
	protected getXPathString(): string {
		return 'alpha';
	}
	
	
	protected async performTest() {
		await this.prepareTest();
		await this.assert(this.xpathResult.getNumberOfNodes() === 1, 'correct number of nodes');
		await this.assert(this.xpathResult.getAllNodes()[0] === this.xmlDocument.getChildAtIndex(0), 'correct node');
	}
}


class SingleContainerNode extends SingleSelfClosingNode {
	/**
	 * @override
	 */
	protected getXmlString(): string {
		return '<alpha></alpha>';
	}
}


@TestRunner.testName('XPath AST Queries')
export class TestRunner extends test.TestRunner {
	constructor() {
		super();
		this.add(
			new SingleSelfClosingNode(),
			new SingleContainerNode()
		);
	}
}