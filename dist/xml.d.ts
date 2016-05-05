export declare abstract class Attribute<TValue> {
    static create<TValue>(value: TValue): Attribute<TValue>;
    valueOf(): TValue;
    toString(): string;
    protected value: TValue;
}


export declare type IAttribute<TValue> = TValue | Attribute<TValue>;

export interface IStringificationParams {
    indentChar?: string;
    newlineChar?: string;
    attrParen?: string;
}


/**
 * Base class for all nodes that may contain child elements.
 */
export declare class ContainerNode<TChildNode extends Node> extends Node {
    childNodes: TChildNode[];
    getNumberOfChildren(): number;
    getChildAtIndex(index: number): TChildNode;
    getIndexOfChild(child: TChildNode): number;
    hasChild(child: TChildNode): boolean;
    /**
     * @chainable
     */
    insertChildAt(child: TChildNode, index: number): ContainerNode<TChildNode>;
    /**
     * @chainable
     */
    removeChildAt(index: number): ContainerNode<TChildNode>;
    /**
     * @chainable
     */
    insertChildBefore(child: TChildNode, referenceChild: TChildNode): ContainerNode<TChildNode>;
    /**
     * @chainable
     */
    insertChildAfter(child: TChildNode, referenceChild: TChildNode): ContainerNode<TChildNode>;
    /**
     * @chainable
     */
    prependChild(child: TChildNode): ContainerNode<TChildNode>;
    /**
     * @chainable
     */
    appendChild(child: TChildNode): ContainerNode<TChildNode>;
    forEachChildNode(fn: (childNode: TChildNode, index: number) => void): void;
    /**
     * @override
     */
    protected stringify(params: IStringificationParams, nodeIndentDepth?: number): string;
    protected stringifyAllChildNodes(params: IStringificationParams, nodeIndentDepth?: number): string;
    protected stringifyChildNode(childNode: TChildNode, params: IStringificationParams, nodeIndentDepth?: number): string;
}


/**
 * Base class for all nodes.
 */
export declare abstract class Node {
    /**
     * The default formatting options for stringification.
     */
    static defaultStringificationParams: IStringificationParams;
    namespacePrefix: string;
    tagName: string;
    id: IAttribute<string>;
    parentNode: ContainerNode<any>;
    getAllAttributeNames(): string[];
    hasAttribute(attrName: string): boolean;
    getAttribute<TValue>(attrName: string, namespaceName?: string): IAttribute<TValue>;
    /**
     * @chainable
     */
    setAttribute<TValue>(attrName: string, value: IAttribute<TValue>, namespaceName?: string): Node;
    toFormattedString(stringificationParams?: IStringificationParams): string;
    toString(): string;
    /**
     * Decorator.
     */
    protected static attributeProxyProperty<TValue>(attrName: string, ...alternativeAttrNames: string[]): (target: Node, name: string) => void;
    protected static changeParentNode(childNode: Node, newParentNode: ContainerNode<any>): void;
    protected static removeParentNode(childNode: Node): void;
    protected static generateIndentString(indentChar: string, indentDepth: number): string;
    protected stringify(params: IStringificationParams, nodeIndentDepth?: number): string;
    protected stringifyAttributes(nodeIndentDepth: number): string;
    private static mergeObjects<TObject>(baseObject, overlayObject);
    private _parentNode;
    private attrList;
}


/**
 * Base class for all nodes that may contain child elements.
 */
export declare class TextNode extends Node {
    content: string;
    protected stringify(params: IStringificationParams, nodeIndentDepth?: number): string;
}


export declare class CommentNode extends TextNode {
}


export declare class CDataSectionNode extends TextNode {
}


export declare class DeclarationOpenerNode extends Node {
    systemLiterals: string[];
    protected stringify(params: IStringificationParams, nodeIndentDepth?: number): string;
}


export declare class ProcessingInstructionNode extends Node {
}


export declare class DocumentNode extends ContainerNode<Node> {
    /**
     * @override
     */
    protected stringify(params: IStringificationParams, nodeIndentDepth?: number): string;
    protected stringifyAllChildNodes(params: IStringificationParams, nodeIndentDepth?: number): string;
}



export declare enum SyntaxErrorCode {
    Unknown = 0,
    UnexpectedToken = 1,
    MissingTagNameAfterNamespacePrefix = 2,
    MissingAttrNameAfterAttrPrefix = 3,
    IllegalNamespacePrefix = 4,
}


export declare class SyntaxError extends Error {
    private errorCode;
    private line;
    private column;
    private source;
    constructor(errorCode: SyntaxErrorCode, line: number, column: number, source: string, message: string);
    static getSyntaxErrorCodeName(errorCode: SyntaxErrorCode): string;
    getMessage(): string;
    getErrorCode(): SyntaxErrorCode;
    getErrorName(): string;
    getLine(): number;
    getColumn(): number;
    toString(): string;
    private getTokenAt(line, column);
}


/**
 * Parsers create a syntax tree from an XML string. Use the static methods `parse*()` instead of using `new Parser()`.
 */
export declare class Parser {
    private stringToParse;
    /**
     * Creates a new parser object. Use the static methods `parse*()` instead of instantiating manually.
     */
    constructor(stringToParse: string);
    /**
     * Parses an XML string and returns the parser object that parsed the string.
     * @see Parser.parseStringToAst(...)
     */
    static parseString(stringToParse: string): Promise<Parser>;
    /**
     * Parses an XML string and returns a syntax tree.
     * @see Parser.parseString(...)
     */
    static parseStringToAst(stringToParse: string): Promise<DocumentNode>;
    /**
     * Returns the syntax tree object the parser creates.
     */
    getAst(): DocumentNode;
    parseComplete(): void;
    protected getCurrentLine(): number;
    protected getCurrentColumn(): number;
    protected getCurrentTokenIndex(): number;
    protected isAtEndOfInput(): boolean;
    protected getTokenAtIndex(index: number): string;
    protected getCurrentToken(): string;
    protected getTokenRange(startIndex: number, endIndex: number): string;
    protected getTokenRangeStartingAt(startIndex: number, length: number): string;
    protected getNextToken(): string;
    protected getPreviousToken(): string;
    protected findFirstOccurenceOfTokenAfterIndex(token: string, startIndex: number): number;
    protected doesTokenOccurBeforeNextOccurenceOfOtherToken(token: string, otherToken: string, startIndex: number): boolean;
    protected getCurrentContainerNode(): ContainerNode<any>;
    protected createSyntaxError(errorCode: SyntaxErrorCode, line: number, column: number, message: string): SyntaxError;
    protected createSyntaxErrorAtCurrentToken(errorCode: SyntaxErrorCode, message: string): SyntaxError;
    protected createUnexpectedTokenSyntaxErrorAtCurrentToken(message?: string): SyntaxError;
    protected raiseError(error: Error): void;
    protected static isAlphabeticToken(token: string): boolean;
    protected static isNumericToken(token: string): boolean;
    protected static isWhitespaceToken(token: string): boolean;
    protected static isTokenLegalInTagNameOrTagNameNamespacePrefix(token: string): boolean;
    protected static isTokenLegalInAttributeNameOrAttributeNameNameNamespacePrefix(token: string): boolean;
    protected moveByNumberOfTokens(numberOfTokens: number): void;
    protected goBackByNumberOfTokens(numberOfTokens: number): void;
    protected goBackToPreviousToken(): void;
    protected advanceByNumberOfTokens(numberOfTokens: number): void;
    protected advanceToNextToken(): void;
    protected parseFromCurrentToken(): void;
    /**
     * Called when the parser is at an open angle bracket (`<`) and needs to decide how to parse upcoming tokens. This method looks ahead to decide
     * whether the open angle bracket is the beginning of an XML tag, or if it's the beginning of text node content, so either:
     *     <foo...
     *     ^       here
     * or:
     *     <foo><</foo>
     *          ^ here
     *
     * Keep in mind that this method must *only* be called in these two cases, all other possible occurances of open angle brackets are handled in
     * more specific methods (namely when parsing CDATA or comments), which are not ambiguous (comments and CDATA nodes have delimiters that clearly
     * indicate where their content begins and ends, text nodes do not have this).
     * The same goes for attributes: An open angle bracket in a properly quoted attribute string is always going to be parsed as an attribute value.
     * An open angle bracket in an attribute value *that is not enclosed by quotes* is always a syntax error:
     *     <foo bar="1<2" />
     *                ^       OK, but does not concern this method
     *     <foo bar=1<2 />
     *               ^        NOT OK, always a syntax error. Also doesn't concern this method.
     */
    protected parseFromOpenAngleBracket(): void;
    /**
     * Creates a new text node, appends it to the ast and parses all upcoming text into it. Stops parsing at the first character that can not be
     * considered text anymore.
     */
    protected parseIntoNewTextNode(): void;
    protected parseFromBeginningOfTag(): void;
    protected parseFromBeginningOfNormalNode(): void;
    protected parseFromBeginningOfCloseTag(): void;
    protected parseFromBeginningOfDeclarationOpenerNode(): void;
    protected parseFromBeginningOfProcessingInstructionNode(): void;
    /**
     * Parses a CDATA section.
     * @see https://www.w3.org/TR/xml/#sec-cdata-sect
     */
    protected parseFromBeginningOfCDataSectionNode(): void;
    protected parseFromBeginningOfCommentNode(): void;
    protected parseCompleteOpeningTagInto(node: Node, allowDescendingIntoNewNode: boolean, allowSystemLiterals: boolean): void;
    /**
     * Parses a tag name into an AST node. Supports namespace prefixes.
     * @param node The AST node to parse the tag name into.
     */
    protected parseTagNameInto(node: Node): void;
    protected parseAttributeListInto(node: Node, allowSystemLiterals: boolean): void;
    protected parseLiteral(): string;
    protected parseAttribute(): {
        name: string;
        value: string;
    };
    private getTokenMatrix();
    private createTokenMatrix();
    private ast;
    private tokenMatrix;
    private currentContainerNode;
    private currentTokenIndex;
}


export declare abstract class Compiler {
    /**
     * Parses an XML string and returns the parser object that parsed it.
     */
    static parseXml(xmlString: string): Promise<Parser>;
    /**
     * Parses an XML string and returns the a syntax tree.
     */
    static parseXmlToAst(xmlString: string): Promise<DocumentNode>;
    /**
     * Parses an XML string to a syntax tree, then serializes it to formatted XML.
     */
    static formatXmlString(xmlString: string, formattingOptions: IStringificationParams): Promise<string>;
}


