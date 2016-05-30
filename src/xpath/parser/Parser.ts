import * as ast from '../ast';

/**
 * XPath expression parser.
 */
export class Parser {
	/**
	 * Parses an XPath query to an ast object.
	 * @param queryString The XPath query to parse.
	 */
	public static parseXPathQueryToAst(queryString: string): ast.Expression {
		const parser = new Parser(queryString);
		parser.parseComplete();
		return parser.getAst();
	}
	
	
	/**
	 * Creates an XPath parser object. **Use the static method `parseXPathQueryToAst(...)` instead of instantiating manually.**
	 * @param stringToParse The XPath query to parse.
	 */
	constructor(private stringToParse: string) { }
	
	
	/**
	 * Returns the parsed syntax tree.
	 */
	public getAst(): ast.Expression {
		return this.ast;
	}
	
	
	/**
	 * Parses the complete XPath query.
	 */
	public parseComplete(): void {
		while (!this.isAtEnd()) {
			this.parseNext();
		}
	}
	
	
	protected getCurrentTokenIndex(): number {
		return this.currentTokenIndex;
	}
	
	
	protected getTokenAtIndex(index: number): string {
		return this.stringToParse[index];
	}
	
	
	protected getCurrentToken(): string {
		return this.getTokenAtIndex(this.getCurrentTokenIndex());
	}
	
	
	protected isAtEnd(): boolean {
		return this.currentTokenIndex >= this.stringToParse.length;
	}
	
	
	protected advanceBy(numberOfTokens: number): void {
		this.currentTokenIndex += numberOfTokens;
	}
	
	
	protected advance(): void {
		this.advanceBy(1);
	}
	
	
	/**
	 * Returns a range of tokens from the source string.
	 * @param startIndex The index of the first token in the requested range.
	 * @param endIndex The index of the last token in the requested range (inclusive).
	 */
	protected getTokenRange(startIndex: number, endIndex: number): string {
		/// TODO: Prevent this from returning ranges that go "beyond" the end of the source string.
		return this.stringToParse.slice(startIndex, endIndex);
	}
	
	
	/**
	 * Returns a range of tokens from the source string.
	 * @param startIndex The index of the first token in the requested range.
	 * @param length The length of the range to be returned.
	 */
	protected getTokenRangeStartingAt(startIndex: number, length: number): string {
		return this.stringToParse.slice(startIndex, startIndex + length);
	}
	
	
	/**
	 * Returns the token that follows the token the cursor is currently at.
	 */
	protected getNextToken(): string {
		return this.getTokenAtIndex(this.getCurrentTokenIndex() + 1);
	}
	
	
	/**
	 * Returns the token that preceeds the token the cursor is currently at.
	 */
	protected getPreviousToken(): string {
		return this.getTokenAtIndex(this.getCurrentTokenIndex() - 1);
	}
	
	
	/**
	 * Finds the first occurence of a certain token after in the source XML string after a certain token index and returns the index of the searched token.
	 * @param token The token to find.
	 * @param startIndex The index at which to start searching.
	 */
	protected findFirstOccurenceOfTokenAfterIndex(token: string, startIndex: number): number {
		return this.stringToParse.indexOf(token[0], startIndex);
	}
	
	
	/**
	 * Checks if a certain token occurs before the next occurence of another token.
	 * @param token The token to check if it occurs before `otherToken`.
	 * @param otherToken The token before which `token` must occur for this method to return `true`.
	 * @param startIndex The index at which to start searching for `token` and `otherToken`.
	 */
	protected doesTokenOccurBeforeNextOccurenceOfOtherToken(token: string, otherToken: string, startIndex: number): boolean {
		const tokenIndex = this.findFirstOccurenceOfTokenAfterIndex(token, startIndex),
			  otherTokenIndex = this.findFirstOccurenceOfTokenAfterIndex(otherToken, startIndex);
		if (tokenIndex < 0 || otherTokenIndex < 0) {
			return false;
		}
		return tokenIndex < otherTokenIndex;
	}
	
	
	protected getCurrentContainingExpression(): ast.Expression {
		return this.currentContainingExpression;
	}
	
	
	/**
	 * Checks whether a token is alphabetic. The test is case insensitive.
	 */
	protected static isAlphabeticToken(token: string): boolean {
		return /[a-z]/i.test(token[0]);
	}
	
	
	/**
	 * Checks whether an identifier starting at a certain index is a function call or not.
	 */
	protected isIdentifierAtIndexAFunctionCall(index: number): boolean {
		while (index + 1) {
			const token = this.getTokenAtIndex(index);
			if (token === '(') {
				return true;
			} else if (!Parser.isAlphabeticToken(token)) {
				return false;
			}
		}
		return false;
	}
	
	
	/**
	 * Parses from the current cursor position and determines what kind of syntax needs to be produced.
	 */
	protected parseNext(): void {
		switch (true) {
			case Parser.isAlphabeticToken(this.getCurrentToken()):
				if (this.isIdentifierAtIndexAFunctionCall(this.getCurrentTokenIndex())) {
					this.parseFunctionCall();
				} else {
					this.parseAlphabeticSelector();
				}
				break;
			default:
				throw new Error(`unable to parse from column ${this.getCurrentTokenIndex()}`);
				break;
		}
	}
	
	
	/**
	 * Parses from the beginning of an alphabetic selector.
	 */
	protected parseAlphabeticSelector(): void {
		const selector = new ast.NodeSelector();
		this.getCurrentContainingExpression().addPart(selector);
		throw 'not fully implemented';
	}
	
	
	/**
	 * Parses from the beginning of a function call.
	 */
	protected parseFunctionCall(): void {
		throw 'not implemented';
	}
	
	
	private ast = new ast.Expression();
	
	
	private currentContainingExpression = this.ast;
	
	
	private currentTokenIndex = 0;
}