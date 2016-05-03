/// Contains test cases for ambiguous (or, generally 'tricky' to parse) XML strings.

import * as test from '../../src/test';
import * as xml from '../../src/index';
import '../../src/test/jsx';


class OpenAngleBracketInTextNodeContent extends test.UnitTest {
	protected async performTest() {
		const textContent = '123<456',
			  ast = await xml.Parser.parseStringToAst(`<a>${textContent}</a>`);
		const wrapperNode = ast.getChildAtIndex(0) as xml.ast.ContainerNode<xml.ast.TextNode>;
		await this.assert(wrapperNode instanceof xml.ast.Node, 'correct outer ast node type');
		await this.assert(wrapperNode.tagName === 'a', 'outer ast node has correct tag name');
		const textNode = wrapperNode.getChildAtIndex(0);
		await this.assert(textNode instanceof xml.ast.Node, 'text node exists');
		await this.assert(textNode instanceof xml.ast.TextNode, 'text node has correct ast node type');
		await this.assert(textNode.content === textContent, 'text node has correct content');
	}
}


class OpenAngleBracketInCommentNodeContent extends test.UnitTest {
	protected async performTest() {
		const textContent = '123<456',
			  ast = await xml.Parser.parseStringToAst(`<a><!--${textContent}--></a>`);
		const wrapperNode = ast.getChildAtIndex(0) as xml.ast.ContainerNode<xml.ast.CommentNode>;
		await this.assert(wrapperNode instanceof xml.ast.Node, 'correct outer ast node type');
		await this.assert(wrapperNode.tagName === 'a', 'outer ast node has correct tag name');
		const commentNode = wrapperNode.getChildAtIndex(0);
		await this.assert(commentNode instanceof xml.ast.Node, 'comment node exists');
		await this.assert(commentNode instanceof xml.ast.CommentNode, 'comment node has correct ast node type');
		await this.assert(commentNode.content === textContent, 'comment node has correct content');
	}
}


class OpenAngleBracketInCDataSectionNodeContent extends test.UnitTest {
	protected async performTest() {
		const textContent = '123<456',
			  ast = await xml.Parser.parseStringToAst(`<a><![CDATA[${textContent}]]></a>`);
		const wrapperNode = ast.getChildAtIndex(0) as xml.ast.ContainerNode<xml.ast.CDataSectionNode>;
		await this.assert(wrapperNode instanceof xml.ast.Node, 'correct outer ast node type');
		await this.assert(wrapperNode.tagName === 'a', 'outer ast node has correct tag name');
		const cdataNode = wrapperNode.getChildAtIndex(0);
		await this.assert(cdataNode instanceof xml.ast.Node, 'cdata node exists');
		await this.assert(cdataNode instanceof xml.ast.CDataSectionNode, 'cdata node has correct ast node type');
		await this.assert(cdataNode.content === textContent, 'cdata node has correct content');
	}
}


@TestRunner.testName('Ambiguous Parsing')
export class TestRunner extends test.TestRunner {
	constructor() {
		super();
		this.add(
			new OpenAngleBracketInTextNodeContent(),
			new OpenAngleBracketInCommentNodeContent(),
			new OpenAngleBracketInCDataSectionNodeContent()
		);
	}
}