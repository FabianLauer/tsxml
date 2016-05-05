import * as test from '../src/test';
import * as parser from './parser/TestRunner';
import * as real from './real/TestRunner';
import * as serialisation from './serialisation/TestRunner';

(async () => {
	const parserTestRunner = new parser.TestRunner(),
		  realTestRunner = new real.TestRunner(),
		  serialisationTestRunner = new serialisation.TestRunner();
	new test.CliRenderer(parserTestRunner);
	await parserTestRunner.run();
	new test.CliRenderer(serialisationTestRunner);
	await serialisationTestRunner.run();
	new test.CliRenderer(realTestRunner);
	await realTestRunner.run();
})();