import * as test from '../../src/test';
import * as basicParsing from './basicParsing';
import * as complexParsing from './complexParsing';
import * as ambiguousParsing from './ambiguousParsing';
import * as syntaxRules from './syntaxRules';

@TestRunner.testName('Parser Tests')
export class TestRunner extends test.TestRunner {
	constructor() {
		super();
		this.add(
			new basicParsing.TestRunner(),
			new complexParsing.TestRunner(),
			new ambiguousParsing.TestRunner(),
			new syntaxRules.TestRunner()
		);
	}
}