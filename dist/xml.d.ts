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
    insertChildAt(child: TChildNode, index: number): this;
    /**
     * @chainable
     */
    removeChildAt(index: number): this;
    /**
     * @chainable
     */
    insertChildBefore(child: TChildNode, referenceChild: TChildNode): this;
    /**
     * @chainable
     */
    insertChildAfter(child: TChildNode, referenceChild: TChildNode): this;
    /**
     * @chainable
     */
    prependChild(child: TChildNode): this;
    /**
     * @chainable
     */
    appendChild(child: TChildNode): this;
    /**
     * @chainable
     */
    replaceChild(oldChild: TChildNode, newChild: TChildNode): this;
    forEachChildNode(fn: (childNode: TChildNode, index: number) => void): void;
    isSubtreeIdenticalTo(otherNode: ContainerNode<TChildNode>): boolean;
    /**
     * Checks whether a node is identical to another node by comparing tag names, attribute names and values and subtree.
     */
    isIdenticalTo(otherNode: ContainerNode<TChildNode>): boolean;
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
    parentNode: ContainerNode<any>;
    getAllAttributeNames(): string[];
    getNumberOfAttributes(): number;
    hasAttribute(attrName: string): boolean;
    getAttribute<TValue>(attrName: string, namespaceName?: string): IAttribute<TValue>;
    /**
     * @chainable
     */
    setAttribute<TValue>(attrName: string, value: IAttribute<TValue>, namespaceName?: string): this;
    /**
     * @chainable
     */
    removeAttribute(attrName: string, namespaceName?: string): this;
    toFormattedString(stringificationParams?: IStringificationParams): string;
    toString(): string;
    isTagNameAndNamespaceIdenticalTo(otherNode: Node): boolean;
    isAttributeListIdenticalTo(otherNode: Node): boolean;
    /**
     * Checks whether a node is identical to another node by comparing tag names, attribute names and values.
     */
    isIdenticalTo(otherNode: Node): boolean;
    protected static joinAttributeNameWithNamespacePrefix(attrName: string, namespaceName: string): string;
    protected static changeParentNode(childNode: Node, newParentNode: ContainerNode<any>): void;
    protected static removeParentNode(childNode: Node): void;
    protected static generateIndentString(indentChar: string, indentDepth: number): string;
    protected stringify(params: IStringificationParams, nodeIndentDepth?: number): string;
    protected stringifyAttributes(nodeIndentDepth: number): string;
    protected stringifyAttribute(attrName: string, attrValue: any): string;
    private static mergeObjects<TObject>(baseObject, overlayObject);
    private _parentNode;
    private attrList;
}


export declare class SelfClosingNode extends Node {
}


export declare class VoidNode extends Node {
    /**
     * @override
     */
    protected stringify(params: IStringificationParams, nodeIndentDepth?: number): string;
}


/**
 * Base class for all nodes that may contain child elements.
 */
export declare class TextNode extends Node {
    content: string;
    getContentLines(): string[];
    /**
     * Returns whether the text content contains line breaks.
     */
    isContentMultiLine(): boolean;
    isContentIdenticalTo(otherNode: TextNode): boolean;
    /**
     * Checks whether a node is identical to another node by comparing tag names, attribute names and values and content.
     */
    isIdenticalTo(otherNode: TextNode): boolean;
    protected static makeContentStringComparable(contentString: string): string;
    protected stringify(params: IStringificationParams, nodeIndentDepth?: number): string;
    protected stringifyContent(params: IStringificationParams, nodeIndentDepth?: number): string;
    protected stringifyMultiLineContent(params: IStringificationParams, nodeIndentDepth?: number): string;
    protected stringifySingleLineContent(params: IStringificationParams, nodeIndentDepth?: number): string;
}


export declare class CommentNode extends TextNode {
    /**
     * @override
     */
    protected stringify(params: IStringificationParams, nodeIndentDepth?: number): string;
    /**
     * @override
     */
    protected stringifyMultiLineContent(params: IStringificationParams, nodeIndentDepth?: number): string;
    /**
     * @override
     */
    protected stringifySingleLineContent(params: IStringificationParams, nodeIndentDepth?: number): string;
}


export declare class CDataSectionNode extends TextNode {
}


export declare class DeclarationOpenerNode extends Node {
    getNumberOfSystemLiterals(): number;
    getIndexOfSystemLiteral(literal: string): number;
    getSystemLiteralAtIndex(literalIndex: number): string;
    getAllSystemLiterals(): string[];
    hasSystemLiteral(literal: string): boolean;
    /**
     * @chainable
     */
    insertIntoSystemLiteralList(literal: string, index: number): this;
    /**
     * @chainable
     */
    prependToSystemLiteralList(literal: string): this;
    /**
     * @chainable
     */
    appendToSystemLiteralList(literal: string): this;
    /**
     * @chainable
     */
    removeSystemLiteralAtIndex(index: number): this;
    /**
     * @chainable
     */
    removeSystemLiteral(literal: string): this;
    /**
     * @chainable
     * @override
     */
    setAttribute<TValue>(attrName: string, value: IAttribute<TValue>, namespaceName?: string): this;
    /**
     * @chainable
     * @override
     */
    removeAttribute(attrName: string, namespaceName?: string): this;
    isSystemLiteralListIdenticalTo(otherNode: DeclarationOpenerNode): boolean;
    /**
     * Checks whether a node is identical to another node by comparing tag names, attribute names and values and content.
     * @override
     */
    isIdenticalTo(otherNode: DeclarationOpenerNode): boolean;
    /**
     * @override
     */
    protected stringify(params: IStringificationParams, nodeIndentDepth?: number): string;
    protected stringifyAttributesAndSystemLiterals(params: IStringificationParams, nodeIndentDepth?: number): string;
    private appendSystemLiteralIndexToOrderList(literalIndex);
    private removeSystemLiteralIndexFromOrderList(literalIndex);
    private appendAttributeToOrderList(attrNameWithNamespace);
    private removeAttributeFromOrderList(attrNameWithNamespace);
    private systemLiterals;
    private literalAndAttrOrder;
}


export declare class ProcessingInstructionNode extends Node {
    /**
     * @override
     */
    protected stringify(params: IStringificationParams, nodeIndentDepth?: number): string;
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
    IllegalSelfClose = 5,
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
 * Enumerates all tag closing modes. Bitmap.
 */
export declare enum TagCloseMode {
    /**
     * Indicates that a tag can be closed by a close tag, such as `<div></div>`.
     */
    Tag = 1,
    /**
     * Indicates that a tag can self-close, such as `<br />`.
     */
    SelfClose = 2,
    /**
     * Indicates that a tag does not need to close, such as `<meta>`.
     */
    Void = 4,
}


/**
 * Defines all possible permissions and restrictions for one or more tags.
 */
export declare class TagSyntaxRule {
    private tagNames;
    /**
     * Creates a new syntax rule for a certain tag name.
     * @param tagName The tag name to create the syntax rule for.
     */
    static createForTagName(tagName: string): TagSyntaxRule;
    /**
     * Creates a new syntax rule for one or more tag names.
     * @param tagName The tag name to create the syntax rule for.
     */
    static createForTagNames(...tagNames: string[]): TagSyntaxRule;
    /**
     * Creates a new tag syntax rule object. **Use static method `createForTagName` instead.**
     */
    constructor(tagNames: string[]);
    /**
     * Returns all tag names a rule applies to.
     */
    getTagNames(): string[];
    /**
     * Checks whether a rule applies to a certain tag name. This method is case sensitive.
     * @param tagName The tag name to check.
     */
    appliesToTagName(tagName: string): boolean;
    /**
     * Returns a rule's current close mode or close modes.
     */
    getCloseMode(): TagCloseMode;
    /**
     * Sets the rule's allowed tag close modes. This can be a single mode or a combination of modes.
     * @example
     *     rule.setCloseMode(TagCloseMode.SelfClose);
     *     rule.setCloseMode(TagCloseMode.SelfClose | TagCloseMode.Void);
     * @chainable
     * @param mode The close mode to set.
     */
    setCloseMode(mode: TagCloseMode): this;
    private closeMode;
}


export declare class SyntaxRuleSet {
    /**
     * Creates an instance of the syntax rule set class this static method is called on.
     */
    static createInstance(): SyntaxRuleSet;
    static isSyntaxRuleSetClass(candidate: typeof SyntaxRuleSet): boolean;
    hasTagSyntaxRule(rule: TagSyntaxRule): boolean;
    getAllTagSyntaxRules(): TagSyntaxRule[];
    /**
     * @chainable
     */
    addTagSyntaxRule(rule: TagSyntaxRule): this;
    /**
     * @chainable
     */
    addTagSyntaxRules(...rules: TagSyntaxRule[]): this;
    private static _syntaxRuleSetBrand_;
    private tagSyntaxRules;
}


/**
 * Parsers create a syntax tree from an XML string. Use the static methods `parse*()` instead of using `new Parser()`.
 */
export declare class Parser {
    private stringToParse;
    /**
     * Creates a new parser object. Use the static methods `create*()` or `parse*()` instead of instantiating manually.
     */
    constructor(stringToParse: string);
    /**
     * Creates a parser object, but does not begin parsing.
     */
    static createForXmlString(stringToParse: string): Parser;
    /**
     * Parses an XML string and returns the parser object that parsed the string.
     * @see Parser.parseStringToAst(...)
     * @param stringToParse The XML string to be parsed.
     * @param ruleSet The sytnax rule set to apply to the parser. Optional. The parser falls back to default XML parsing rules when no other rules are provided.
     */
    static parseString(stringToParse: string, ruleSet?: SyntaxRuleSet | typeof SyntaxRuleSet): Promise<Parser>;
    /**
     * Parses an XML string and returns a syntax tree.
     * @see Parser.parseString(...)
     * @param stringToParse The XML string to be parsed.
     * @param ruleSet The sytnax rule set to apply to the parser. Optional. The parser falls back to default XML parsing rules when no other rules are provided.
     */
    static parseStringToAst(stringToParse: string, ruleSet?: SyntaxRuleSet | typeof SyntaxRuleSet): Promise<DocumentNode>;
    getDefaultTagSyntaxRule(): TagSyntaxRule;
    /**
     * @chainable
     */
    setDefaultTagSyntaxRule(rule: TagSyntaxRule): void;
    getTagSyntaxRuleForTagName(tagName: string): TagSyntaxRule;
    hasTagSyntaxRuleForTagName(tagName: string): boolean;
    /**
     * @chainable
     */
    addTagSyntaxRule(rule: TagSyntaxRule): this;
    /**
     * @chainable
     */
    addTagSyntaxRules(...rules: TagSyntaxRule[]): this;
    /**
     * @chainable
     */
    removeTagSyntaxRuleForTagName(tagName: string): this;
    /**
     * @chainable
     */
    removeTagSyntaxRulesForTagNames(tagNames: string[]): this;
    /**
     * Applies all rules defined by a syntax rule set to the parser.
     * @chainable
     * @param ruleSet The syntax rule set to apply.
     */
    applySyntaxRuleSet(ruleSet: SyntaxRuleSet | typeof SyntaxRuleSet): this;
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
    protected static isSingularCloseMode(closeMode: TagCloseMode): boolean;
    protected static createDefaultTagSyntaxRule(): TagSyntaxRule;
    protected getOverrideOrDefaultTagSyntaxRuleForTagName(tagName: string): TagSyntaxRule;
    /**
     * Returns all tag close modes allowed for a certain tag name. The returned modes are either defined by tag syntax rules or fall back to the default if no syntax rule for the given tag name exists.
     */
    protected getAllowedTagCloseModesForTagName(tagName: string): TagCloseMode;
    protected isCloseModeAllowedForTagName(tagName: string, closeMode: TagCloseMode): boolean;
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
    protected static createContainerNodeFromOtherNode<TChildNode extends Node>(node: Node): ContainerNode<TChildNode>;
    protected static createVoidNodeFromOtherNode(node: Node): VoidNode;
    protected parseCompleteOpeningTagInto(node: Node, allowDescendingIntoNewContainerNode: boolean, allowSystemLiterals: boolean): void;
    protected parseEndOfNonSelfClosingOpeningTag(node: Node, allowDescendingIntoNewContainerNode: boolean): void;
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
    private defaultTagSyntaxRule;
    private tagSyntaxRules;
    private ast;
    private tokenMatrix;
    private currentContainerNode;
    private currentTokenIndex;
}


export declare class Html5 extends SyntaxRuleSet {
    static Loose: typeof Html5;
    static Strict: typeof Html5;
    constructor(allowVoidElementsToSelfClose?: boolean);
}






export declare abstract class Compiler {
    /**
     * Parses an XML string and returns the parser object that parsed it.
     */
    static parseXml(xmlString: string, ruleSet?: SyntaxRuleSet | typeof SyntaxRuleSet): Promise<Parser>;
    /**
     * Parses an XML string and returns the a syntax tree.
     */
    static parseXmlToAst(xmlString: string, ruleSet?: SyntaxRuleSet | typeof SyntaxRuleSet): Promise<DocumentNode>;
    /**
     * Parses an XML string to a syntax tree, then serializes it to formatted XML.
     */
    static formatXmlString(xmlString: string, formattingOptions?: IStringificationParams, ruleSet?: SyntaxRuleSet | typeof SyntaxRuleSet): Promise<string>;
}


