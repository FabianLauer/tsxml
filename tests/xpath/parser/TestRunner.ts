import * as test from '../../../src/test';
import * as basicParsing from './basicParsing';

@TestRunner.testName('XPath Parser Tests')
export class TestRunner extends test.TestRunner {
	constructor() {
		super();
		this.add(
			new basicParsing.TestRunner()
		);
	}
}