import * as test from '../../src/test';
import * as basicParsing from './basicParsing';
import * as complexParsing from './complexParsing';

@TestRunner.testName('Parser Tests')
export class TestRunner extends test.TestRunner {
	constructor() {
		super();
		this.add(
			new basicParsing.TestRunner(),
			new complexParsing.TestRunner()
		);
	}
}