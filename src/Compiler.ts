import {DocumentNode} from './ast/DocumentNode';
import {IStringificationParams} from './ast/IStringificationParams';
import {Parser} from './parser/Parser';

export abstract class Compiler {
	/**
	 * Parses an XML string and returns the parser object that parsed it.
	 */
	public static async parseXml(xmlString: string): Promise<Parser> {
		return Parser.parseString(xmlString);
	}
	
	
	/**
	 * Parses an XML string and returns the a syntax tree.
	 */
	public static async parseXmlToAst(xmlString: string): Promise<DocumentNode> {
		return Parser.parseStringToAst(xmlString);
	}
	
	
	/**
	 * Parses an XML string to a syntax tree, then serializes it to formatted XML.
	 */
	public static async formatXmlString(xmlString: string, formattingOptions: IStringificationParams): Promise<string> {
		return (await Parser.parseStringToAst(xmlString)).toFormattedString(formattingOptions);
	}
}