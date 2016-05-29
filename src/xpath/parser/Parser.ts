import {Expression} from '../ast/Expression';

/**
 * XPath expression parser.
 */
export class Parser {
	/**
	 * Parses an XPath query to an ast object.
	 * @param queryString The XPath query to parse.
	 */
	public static parseXPathQueryToAst(queryString: string): Expression {
		const parser = new Parser(queryString);
		parser.parseComplete();
		return parser.getAst();
	}
	
	
	/**
	 * Creates an XPath parser object. **Use the static method `parseXPathQueryToAst(...)` instead of instantiating manually.**
	 * @param queryString The XPath query to parse.
	 */
	constructor(private queryString: string) { }
	
	
	/**
	 * Returns the parsed syntax tree.
	 */
	public getAst(): Expression {
		return this.ast;
	}
	
	
	/**
	 * Parses the complete XPath query.
	 */
	public parseComplete(): void {
		
	}
	
	
	private ast: Expression;
}