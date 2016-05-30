import * as test from '../../src/test';
import * as parser from './parser/basicParsing';

@TestRunner.testName('XPath Tests')
export class TestRunner extends test.TestRunner {
	constructor() {
		super();
		this.add(
			new parser.TestRunner()
		);
	}
}