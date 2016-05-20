///
/// README:
/// The tests in this file cover node nesting instead of just simple nodes. All tests in this
/// file use **default syntax rules only**, no syntax rule overrides are allowed here.
/// To keep code and tests readable, test names contain the structure they test, such as:
///     Nesting_1_2v_2sc_2c
/// The numbers represent nodes on a certain nesting level, the 'v' and 'sc' stands for either
/// 'void' or 'self closing' elements. The example test name from above would represent a node
/// structure such as:
///     <A>             1
///         <B>         2v
///         <C/>        2sc
///         <!-- -->    2c
///     </A>
/// If there's no shortcut on a number, it just means the node is a "normal", non-self-closing node.
///
/// Here are all shortcuts:
///     sc    self closing node
///     v     void node (self closing without slash)
///     c     comment node
///     txt   text node
///     mdo   markup declaration opener node (e.g. a doctype)
///     pi    processing instruction node (e.g. <?svg...)
///

import * as test from '../../src/test';
import * as xml from '../../src/index';
import '../../src/test/jsx';


class Nesting_1_2c extends test.UnitTest {
	protected async performTest() {
		const content = 'some comment content with 123 numbers and a\nline break',
			  ast = await xml.Parser.parseStringToAst(`<a><!--${content}--></a>`);
		const wrapperNode = ast.getChildAtIndex(0) as xml.ast.ContainerNode<xml.ast.CommentNode>;
		await this.assert(wrapperNode instanceof xml.ast.ContainerNode, 'outer ast node has correct ast node type');
		await this.assert(wrapperNode.tagName === 'a', 'outer ast node has correct tag name');
		await this.assert(wrapperNode.getNumberOfChildren() === 1, 'outer ast node has expected number of child nodes');
		const commentNode = wrapperNode.getChildAtIndex(0);
		await this.assert(commentNode instanceof xml.ast.CommentNode, 'comment ast node has correct ast node type');
		await this.assert(commentNode.content === content, 'comment ast node has correct text content');
	}
}


class Nesting_1_2 extends test.UnitTest {
	protected async performTest() {
		const ast = await xml.Parser.parseStringToAst(
			<alpha>
				<beta></beta>
			</alpha> as any
		);
		const wrapperNode = ast.getChildAtIndex(0) as xml.ast.ContainerNode<xml.ast.ContainerNode<any>>;
		await this.assert(wrapperNode instanceof xml.ast.ContainerNode, 'outer ast node has correct ast node type');
		await this.assert(wrapperNode.tagName === 'alpha', 'outer ast node has correct tag name');
		await this.assert(wrapperNode.getNumberOfChildren() === 1, 'outer ast node has expected number of child nodes');
		const innerNode = wrapperNode.getChildAtIndex(0);
		await this.assert(innerNode instanceof xml.ast.ContainerNode, 'inner ast node has correct ast node type');
		await this.assert(innerNode.tagName === 'beta', 'inner ast node has correct tag name');
	}
}


class Nesting_1_2sc extends test.UnitTest {
	protected async performTest() {
		const ast = await xml.Parser.parseStringToAst(
			<alpha>
				<beta />
			</alpha> as any
		);
		const alpha = ast.getChildAtIndex(0) as xml.ast.ContainerNode<any>;
		await this.assert(alpha instanceof xml.ast.ContainerNode, 'outer ast node has correct ast node type');
		await this.assert(alpha.tagName === 'alpha', 'outer ast node has correct tag name');
		const beta = alpha.getChildAtIndex(0);
		await this.assert(beta instanceof xml.ast.SelfClosingNode, 'inner ast node has correct ast node type');
		await this.assert(beta.tagName === 'beta', 'inner ast node has correct tag name');
	}
}


class Nesting_1mdo_1_2sc extends test.UnitTest {
	protected async performTest() {
		const ast = await xml.Parser.parseStringToAst(`
			<!DOCTYPE>
			<alpha>
				<beta />
			</alpha>
		`);
		const mdo = ast.getChildAtIndex(0) as xml.ast.DeclarationOpenerNode;
		await this.assert(mdo instanceof xml.ast.DeclarationOpenerNode, 'mdo ast node has correct ast node type');
		await this.assert(mdo.tagName === 'DOCTYPE', 'mdo ast node has correct tag name');
		const alpha = ast.getChildAtIndex(1) as xml.ast.ContainerNode<any>;
		await this.assert(alpha instanceof xml.ast.ContainerNode, 'outer ast node has correct ast node type');
		await this.assert(alpha.tagName === 'alpha', 'outer ast node has correct tag name');
		const beta = alpha.getChildAtIndex(0);
		await this.assert(beta instanceof xml.ast.SelfClosingNode, 'inner ast node has correct ast node type');
		await this.assert(beta.tagName === 'beta', 'inner ast node has correct tag name');
	}
}


class Nesting_1c_1mdo_1_2sc extends test.UnitTest {
	protected async performTest() {
		const commentContent = ' a test comment ',
			  ast = await xml.Parser.parseStringToAst(`
			<!--${commentContent}-->
			<!DOCTYPE>
			<alpha>
				<beta />
			</alpha>
		`);
		const comment = ast.getChildAtIndex(0) as xml.ast.CommentNode;
		await this.assert(comment instanceof xml.ast.CommentNode, 'comment ast node has correct ast node type');
		await this.assert(comment.content === commentContent, 'comment ast node has correct text content');
		const mdo = ast.getChildAtIndex(1) as xml.ast.DeclarationOpenerNode;
		await this.assert(mdo instanceof xml.ast.DeclarationOpenerNode, 'mdo ast node has correct ast node type');
		await this.assert(mdo.tagName === 'DOCTYPE', 'mdo ast node has correct tag name');
		const alpha = ast.getChildAtIndex(2) as xml.ast.ContainerNode<any>;
		await this.assert(alpha instanceof xml.ast.ContainerNode, 'outer ast node has correct ast node type');
		await this.assert(alpha.tagName === 'alpha', 'outer ast node has correct tag name');
		const beta = alpha.getChildAtIndex(0);
		await this.assert(beta instanceof xml.ast.SelfClosingNode, 'inner ast node has correct ast node type');
		await this.assert(beta.tagName === 'beta', 'inner ast node has correct tag name');
	}
}


class Nesting_1_2sc_2sc extends test.UnitTest {
	protected async performTest() {
		const ast = await xml.Parser.parseStringToAst(
			<alpha>
				<beta />
				<gamma />
			</alpha> as any
		);
		const alpha = ast.getChildAtIndex(0) as xml.ast.ContainerNode<any>;
		await this.assert(alpha instanceof xml.ast.ContainerNode, 'outer ast node has correct ast node type');
		await this.assert(alpha.tagName === 'alpha', 'outer ast node has correct tag name');
		const beta = alpha.getChildAtIndex(0);
		await this.assert(beta instanceof xml.ast.SelfClosingNode, 'inner ast node has correct ast node type');
		await this.assert(beta.tagName === 'beta', 'inner ast node has correct tag name');
		const gamma = alpha.getChildAtIndex(1);
		await this.assert(gamma instanceof xml.ast.SelfClosingNode, 'inner ast node has correct ast node type');
		await this.assert(gamma.tagName === 'gamma', 'inner ast node has correct tag name');
	}
}


class Nesting_1_2sc_2sc_2c_2sc extends test.UnitTest {
	protected async performTest() {
		const commentContent = 'a simple test comment',
			ast = await xml.Parser.parseStringToAst(`
			<alpha>
				<beta />
				<gamma />
				<!--${commentContent}-->
				<delta />
			</alpha>
		`);
		const alpha = ast.getChildAtIndex(0) as xml.ast.ContainerNode<any>;
		await this.assert(alpha instanceof xml.ast.ContainerNode, 'outer ast node has correct ast node type');
		await this.assert(alpha.tagName === 'alpha', 'outer ast node has correct tag name');
		const beta = alpha.getChildAtIndex(0);
		await this.assert(beta instanceof xml.ast.SelfClosingNode, 'inner ast node has correct ast node type');
		await this.assert(beta.tagName === 'beta', 'inner ast node has correct tag name');
		const gamma = alpha.getChildAtIndex(1);
		await this.assert(gamma instanceof xml.ast.SelfClosingNode, 'inner ast node has correct ast node type');
		await this.assert(gamma.tagName === 'gamma', 'inner ast node has correct tag name');
		const comment = alpha.getChildAtIndex(2) as xml.ast.CommentNode;
		await this.assert(comment instanceof xml.ast.CommentNode, 'comment ast node has correct ast node type');
		await this.assert(comment.content === commentContent, 'comment ast node has correct text content');
		const delta = alpha.getChildAtIndex(3);
		await this.assert(delta instanceof xml.ast.SelfClosingNode, 'inner ast node has correct ast node type');
		await this.assert(delta.tagName === 'delta', 'inner ast node has correct tag name');
	}
}


class Nesting_1_2_3_4sc extends test.UnitTest {
	protected async performTest() {
		const ast = await xml.Parser.parseStringToAst(
			<alpha>
				<beta>
					<gamma>
						<delta />
					</gamma>
				</beta>
			</alpha> as any
		);
		const alpha = ast.getChildAtIndex(0) as xml.ast.ContainerNode<any>;
		await this.assert(alpha instanceof xml.ast.ContainerNode, 'outer ast node has correct ast node type');
		await this.assert(alpha.tagName === 'alpha', 'outer ast node has correct tag name');
		const beta = alpha.getChildAtIndex(0) as xml.ast.ContainerNode<any>;
		await this.assert(beta instanceof xml.ast.ContainerNode, 'inner ast node has correct ast node type');
		await this.assert(beta.tagName === 'beta', 'inner ast node has correct tag name');
		const gamma = beta.getChildAtIndex(0) as xml.ast.ContainerNode<any>;
		await this.assert(gamma instanceof xml.ast.ContainerNode, 'inner ast node has correct ast node type');
		await this.assert(gamma.tagName === 'gamma', 'inner ast node has correct tag name');
		const delta = gamma.getChildAtIndex(0) as xml.ast.ContainerNode<any>;
		await this.assert(delta instanceof xml.ast.SelfClosingNode, 'inner ast node has correct ast node type');
		await this.assert(delta.tagName === 'delta', 'inner ast node has correct tag name');
	}
}


class NestingWithAttributes_1_2_3_2_2sc extends test.UnitTest {
	protected async performTest() {
		const ast = await xml.Parser.parseStringToAst(
			<alpha a="true">
				<beta>
					<gamma></gamma>
				</beta>
				<delta></delta>
				<epsilon></epsilon>
				<zeta foo="bar" />
			</alpha> as any
		);
		const alpha = ast.getChildAtIndex(0) as xml.ast.ContainerNode<any>;
		await this.assert(alpha instanceof xml.ast.ContainerNode, 'outer ast node has correct ast node type');
		await this.assert(alpha.tagName === 'alpha', 'outer ast node has correct tag name');
		await this.assert(alpha.getAttribute('a') === 'true', 'outer ast node has correct attribute value');
		const beta = alpha.getChildAtIndex(0) as xml.ast.ContainerNode<any>;
		await this.assert(beta instanceof xml.ast.ContainerNode, 'inner ast node has correct ast node type');
		await this.assert(beta.tagName === 'beta', 'inner ast node has correct tag name');
		const gamma = beta.getChildAtIndex(0) as xml.ast.ContainerNode<any>;
		await this.assert(gamma instanceof xml.ast.ContainerNode, `inner ast node has correct ast node type, got: ${gamma.constructor.name}`);
		await this.assert(gamma.tagName === 'gamma', 'inner ast node has correct tag name');
		const delta = alpha.getChildAtIndex(1) as xml.ast.ContainerNode<any>;
		await this.assert(delta instanceof xml.ast.ContainerNode, 'inner ast node has correct ast node type');
		await this.assert(delta.tagName === 'delta', 'inner ast node has correct tag name');
		const epsilon = alpha.getChildAtIndex(2) as xml.ast.ContainerNode<any>;
		await this.assert(epsilon instanceof xml.ast.ContainerNode, 'inner ast node has correct ast node type');
		await this.assert(epsilon.tagName === 'epsilon', 'inner ast node has correct tag name');
		const zeta = alpha.getChildAtIndex(3);
		await this.assert(zeta instanceof xml.ast.SelfClosingNode, 'inner ast node has correct ast node type');
		await this.assert(zeta.tagName === 'zeta', 'inner ast node has correct tag name');
		await this.assert(zeta.getAttribute('foo') === 'bar', 'inner ast node has correct attribute value');
	}
}


class NestingWithAttributes_1_2_3txt_2_2sc extends test.UnitTest {
	protected async performTest() {
		const textContent = 'sample text node content',
			ast = await xml.Parser.parseStringToAst(
			<alpha a="true">
				<beta>
					<gamma>{textContent}</gamma>
				</beta>
				<delta></delta>
				<epsilon></epsilon>
				<zeta foo="bar" />
			</alpha> as any
		);
		const alpha = ast.getChildAtIndex(0) as xml.ast.ContainerNode<any>;
		await this.assert(alpha instanceof xml.ast.ContainerNode, 'outer ast node has correct ast node type');
		await this.assert(alpha.tagName === 'alpha', 'outer ast node has correct tag name');
		await this.assert(alpha.getAttribute('a') === 'true', 'outer ast node has correct attribute value');
		const beta = alpha.getChildAtIndex(0) as xml.ast.ContainerNode<any>;
		await this.assert(beta instanceof xml.ast.ContainerNode, 'inner ast node has correct ast node type');
		await this.assert(beta.tagName === 'beta', 'inner ast node has correct tag name');
		const gamma = beta.getChildAtIndex(0) as xml.ast.ContainerNode<any>;
		await this.assert(gamma instanceof xml.ast.ContainerNode, 'inner ast node has correct ast node type');
		await this.assert(gamma.tagName === 'gamma', 'inner ast node has correct tag name');
		const text = gamma.getChildAtIndex(0) as xml.ast.TextNode;
		await this.assert(text instanceof xml.ast.TextNode, 'text ast node has correct ast node type');
		await this.assert(text.content.replace(/^ */, '').replace(/ *$/, '') === textContent, 'text ast node has correct text content');
		const delta = alpha.getChildAtIndex(1) as xml.ast.ContainerNode<any>;
		await this.assert(delta instanceof xml.ast.ContainerNode, 'inner ast node has correct ast node type');
		await this.assert(delta.tagName === 'delta', 'inner ast node has correct tag name');
		const epsilon = alpha.getChildAtIndex(2) as xml.ast.ContainerNode<any>;
		await this.assert(epsilon instanceof xml.ast.ContainerNode, 'inner ast node has correct ast node type');
		await this.assert(epsilon.tagName === 'epsilon', 'inner ast node has correct tag name');
		const zeta = alpha.getChildAtIndex(3);
		await this.assert(zeta instanceof xml.ast.SelfClosingNode, 'inner ast node has correct ast node type');
		await this.assert(zeta.tagName === 'zeta', 'inner ast node has correct tag name');
		await this.assert(zeta.getAttribute('foo') === 'bar', 'inner ast node has correct attribute value');
	}
}


@TestRunner.testName('Complex Parsing')
export class TestRunner extends test.TestRunner {
	constructor() {
		super();
		this.add(
			new Nesting_1_2c(),
			new Nesting_1_2(),
			new Nesting_1_2sc(),
			new Nesting_1mdo_1_2sc(),
			new Nesting_1c_1mdo_1_2sc(),
			new Nesting_1_2sc_2sc(),
			new Nesting_1_2sc_2sc_2c_2sc(),
			new Nesting_1_2_3_4sc(),
			new NestingWithAttributes_1_2_3_2_2sc(),
			new NestingWithAttributes_1_2_3txt_2_2sc()
		);
	}
}