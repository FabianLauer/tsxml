import * as test from '../../src/test';
import * as ast from './ast/TestRunner';
import * as parser from './parser/TestRunner';

@TestRunner.testName('XPath Tests')
export class TestRunner extends test.TestRunner {
	constructor() {
		super();
		this.add(
			new ast.TestRunner(),
			new parser.TestRunner()
		);
	}
}