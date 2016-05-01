// Reads a file, formats it and prints the result to the stdout.
// Usage:
//    node fileFormatter.js path/to/file

/// <reference path="../typings/node/node" />
import * as fs from 'fs';
import * as xml from '../src/index';

(async () => {
	const PATH_TO_FILE = process.argv[2];
	const formattedXml = (await xml.Parser.parseStringToAst(fs.readFileSync(PATH_TO_FILE) + '')).toFormattedString({
		indentChar: '  ',
		newlineChar: '\n',
		attrParen: '"'
	});
	process.stdout.write(formattedXml + '\n');
})();