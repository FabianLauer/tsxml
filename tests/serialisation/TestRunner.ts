/// <reference path="../../typings/node/node" />
import * as fs from 'fs';
import * as test from '../../src/test';
import * as xml from '../../src/index';


abstract class FileTest extends test.UnitTest {
	protected abstract getFullPathToFile(): string;
	
	protected async performTest() {
		const serializedXml = FileTest.makeComparableString((await xml.Parser.parseStringToAst(await this.getSourceAsString())).toString());
		await this.assert(serializedXml === FileTest.makeComparableString(await this.getExpectationAsString()),
						  `serialized XML meets expectation, got: ${serializedXml}`);
		this.cleanup();
	}
	
	
	private static makeComparableString(str: string): string {
		return str.trim().replace(/^(\r?\n)+/, '').replace(/(\r?\n)+$/, '').trim();
	}
	
	
	private async getFileContentAsString(): Promise<string>  {
		if (typeof this.fileContent === 'string') {
			return this.fileContent;
		}
		return new Promise<string>((resolve: (contentAsString: string) => void, reject: (reason: any) => void) => {
			fs.readFile(this.getFullPathToFile(), (err: any, content: Buffer) => {
				if (err) {
					reject(err);
				} else {
					this.fileContent = content + '';
					resolve(this.fileContent);
				}
			});
		});
	}
	
	
	private async getSourceAsString(): Promise<string> {
		return (await this.getFileContentAsString()).split(FileTest.splitRegex)[1];
	}
	
	
	private async getExpectationAsString(): Promise<string> {
		return (await this.getFileContentAsString()).split(FileTest.splitRegex)[1];
	}
	
	
	private cleanup(): void {
		this.fileContent = undefined;
	}
	
	
	private static splitRegex = /\n@@ *EXPECTATION *@@/i;
	
	
	private fileContent: string;
}


@TestRunner.testName('Serialisation w/o Formatting')
export class TestRunner extends test.TestRunner {
	constructor() {
		super();
		this.prepareFileTestsForDirectory('xml/', FileTest);
	}
	
	
	private prepareFileTestsForDirectory(directoryPath: string, testBaseClass: typeof FileTest): void {
		const basePath = './tests/serialisation/';
		fs.readdirSync(basePath + directoryPath).forEach(path => {
			const fullPathToFile = basePath + directoryPath + path;
			if (!fs.statSync(fullPathToFile).isFile()) {
				return;
			}
			this.add(new (class extends testBaseClass {
				public get name() { return directoryPath + path; }
				protected getFullPathToFile() { return fullPathToFile; }
			}));
		});
	}
}