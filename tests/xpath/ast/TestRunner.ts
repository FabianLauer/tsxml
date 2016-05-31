import * as test from '../../../src/test';
import * as execution from './execution';

@TestRunner.testName('XPath AST Tests')
export class TestRunner extends test.TestRunner {
	constructor() {
		super();
		this.add(
			new execution.TestRunner()
		);
	}
}