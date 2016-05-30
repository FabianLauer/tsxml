import * as test from '../../../src/test';
import * as queries from './queries';

@TestRunner.testName('XPath AST Tests')
export class TestRunner extends test.TestRunner {
	constructor() {
		super();
		this.add(
			new queries.TestRunner()
		);
	}
}