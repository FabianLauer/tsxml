!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.xml=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = _promise2.default))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const Parser_1 = require('./parser/Parser');
class Compiler {
    /**
     * Parses an XML string and returns the parser object that parsed it.
     */
    static parseXml(xmlString) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            return Parser_1.Parser.parseString(xmlString);
        });
    }
    /**
     * Parses an XML string and returns the a syntax tree.
     */
    static parseXmlToAst(xmlString) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            return Parser_1.Parser.parseStringToAst(xmlString);
        });
    }
    /**
     * Parses an XML string to a syntax tree, then serializes it to formatted XML.
     */
    static formatXmlString(xmlString, formattingOptions) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            return (yield Parser_1.Parser.parseStringToAst(xmlString)).toFormattedString(formattingOptions);
        });
    }
}
exports.Compiler = Compiler;
},{"./parser/Parser":13,"babel-runtime/core-js/promise":19}],2:[function(require,module,exports){
"use strict";

const Attribute_1 = require('./ast/Attribute');
exports.Attribute = Attribute_1.Attribute;
const Node_1 = require('./ast/Node');
exports.Node = Node_1.Node;
const TextNode_1 = require('./ast/TextNode');
exports.TextNode = TextNode_1.TextNode;
const CommentNode_1 = require('./ast/CommentNode');
exports.CommentNode = CommentNode_1.CommentNode;
const CDataSectionNode_1 = require('./ast/CDataSectionNode');
exports.CDataSectionNode = CDataSectionNode_1.CDataSectionNode;
const DeclarationOpenerNode_1 = require('./ast/DeclarationOpenerNode');
exports.DeclarationOpenerNode = DeclarationOpenerNode_1.DeclarationOpenerNode;
const ProcessingInstructionNode_1 = require('./ast/ProcessingInstructionNode');
exports.ProcessingInstructionNode = ProcessingInstructionNode_1.ProcessingInstructionNode;
const ContainerNode_1 = require('./ast/ContainerNode');
exports.ContainerNode = ContainerNode_1.ContainerNode;
const DocumentNode_1 = require('./ast/DocumentNode');
exports.DocumentNode = DocumentNode_1.DocumentNode;
},{"./ast/Attribute":3,"./ast/CDataSectionNode":4,"./ast/CommentNode":5,"./ast/ContainerNode":6,"./ast/DeclarationOpenerNode":7,"./ast/DocumentNode":8,"./ast/Node":9,"./ast/ProcessingInstructionNode":10,"./ast/TextNode":11}],3:[function(require,module,exports){
"use strict";

class Attribute {
    static create(value) {
        return new class extends Attribute {
            constructor() {
                super(...arguments);
                this.value = value;
            }
        }();
    }
    valueOf() {
        return this.value;
    }
    toString() {
        return this.value + '';
    }
}
exports.Attribute = Attribute;
},{}],4:[function(require,module,exports){
"use strict";

const TextNode_1 = require('./TextNode');
class CDataSectionNode extends TextNode_1.TextNode {}
exports.CDataSectionNode = CDataSectionNode;
},{"./TextNode":11}],5:[function(require,module,exports){
"use strict";

const TextNode_1 = require('./TextNode');
class CommentNode extends TextNode_1.TextNode {}
exports.CommentNode = CommentNode;
},{"./TextNode":11}],6:[function(require,module,exports){
"use strict";

const Node_1 = require('./Node');
/**
 * Base class for all nodes that may contain child elements.
 */
class ContainerNode extends Node_1.Node {
    constructor() {
        super(...arguments);
        this.childNodes = [];
    }
    getNumberOfChildren() {
        return this.childNodes.length;
    }
    getChildAtIndex(index) {
        return this.childNodes[index];
    }
    getIndexOfChild(child) {
        return this.childNodes.indexOf(child);
    }
    hasChild(child) {
        return this.getIndexOfChild(child) !== -1;
    }
    /**
     * @chainable
     */
    insertChildAt(child, index) {
        Node_1.Node.changeParentNode(child, this);
        this.childNodes.splice(index, 0, child);
        return this;
    }
    /**
     * @chainable
     */
    removeChildAt(index) {
        const removedNode = this.childNodes.splice(index, 1)[0];
        Node_1.Node.removeParentNode(removedNode);
        return this;
    }
    /**
     * @chainable
     */
    insertChildBefore(child, referenceChild) {
        if (!this.hasChild(referenceChild)) {
            throw new Error('Can not insert child: reference child not found.');
        }
        this.insertChildAt(child, this.getIndexOfChild(referenceChild));
        return this;
    }
    /**
     * @chainable
     */
    insertChildAfter(child, referenceChild) {
        if (!this.hasChild(referenceChild)) {
            throw new Error('Can not insert child: reference child not found.');
        }
        this.insertChildAt(child, this.getIndexOfChild(referenceChild) + 1);
        return this;
    }
    /**
     * @chainable
     */
    prependChild(child) {
        this.insertChildAt(child, 0);
        return this;
    }
    /**
     * @chainable
     */
    appendChild(child) {
        this.insertChildAt(child, this.getNumberOfChildren());
        return this;
    }
    forEachChildNode(fn) {
        this.childNodes.forEach((childNode, index) => fn(childNode, index));
    }
    /**
     * @override
     */
    stringify(params, nodeIndentDepth) {
        nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
        return `${ Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth) }<${ this.tagName }${ this.stringifyAttributes(nodeIndentDepth) }>${ this.stringifyAllChildNodes(params, nodeIndentDepth + 1) }${ Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth) }</${ this.tagName }>\n`;
    }
    stringifyAllChildNodes(params, nodeIndentDepth) {
        var xml = params.newlineChar;
        this.forEachChildNode(childNode => {
            xml += this.stringifyChildNode(childNode, params, nodeIndentDepth + 1);
        });
        return xml;
    }
    stringifyChildNode(childNode, params, nodeIndentDepth) {
        return childNode.stringify(params, nodeIndentDepth);
    }
}
exports.ContainerNode = ContainerNode;
},{"./Node":9}],7:[function(require,module,exports){
"use strict";

const Node_1 = require('./Node');
class DeclarationOpenerNode extends Node_1.Node {
    constructor() {
        super(...arguments);
        this.systemLiterals = [];
    }
    stringify(params, nodeIndentDepth) {
        nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
        return `${ Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth) }<!${ this.tagName }${ this.stringifyAttributes(nodeIndentDepth) } ${ this.systemLiterals.join('') } />${ params.newlineChar }`;
    }
}
exports.DeclarationOpenerNode = DeclarationOpenerNode;
},{"./Node":9}],8:[function(require,module,exports){
"use strict";

const ContainerNode_1 = require('./ContainerNode');
class DocumentNode extends ContainerNode_1.ContainerNode {
    /**
     * @override
     */
    stringify(params, nodeIndentDepth) {
        nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
        return this.stringifyAllChildNodes(params, nodeIndentDepth);
    }
    stringifyAllChildNodes(params, nodeIndentDepth) {
        var xml = '';
        this.forEachChildNode(childNode => {
            xml += this.stringifyChildNode(childNode, params, nodeIndentDepth);
        });
        return xml;
    }
}
exports.DocumentNode = DocumentNode;
},{"./ContainerNode":6}],9:[function(require,module,exports){
"use strict";

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty = require("babel-runtime/core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = (0, _getOwnPropertyDescriptor2.default)(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && (0, _defineProperty2.default)(target, key, r), r;
};
/**
 * Base class for all nodes.
 */
class Node {
    constructor() {
        this.attrList = {};
    }
    /**
     * The default formatting options for stringification.
     */
    static get defaultStringificationParams() {
        return {
            attrParen: '"',
            indentChar: '\t',
            newlineChar: '\n'
        };
    }
    get parentNode() {
        return this._parentNode;
    }
    getAllAttributeNames() {
        return (0, _keys2.default)(this.attrList);
    }
    hasAttribute(attrName) {
        return this.getAllAttributeNames().indexOf(attrName) !== -1;
    }
    getAttribute(attrName, namespaceName) {
        if (typeof namespaceName !== 'undefined') {
            attrName = namespaceName + attrName;
        }
        return this.attrList[attrName];
    }
    /**
     * @chainable
     */
    setAttribute(attrName, value, namespaceName) {
        if (typeof namespaceName !== 'undefined') {
            attrName = namespaceName + attrName;
        }
        this.attrList[attrName] = value;
        return this;
    }
    toFormattedString(stringificationParams) {
        if (typeof stringificationParams === 'object' && stringificationParams !== null) {
            stringificationParams = Node.mergeObjects(Node.defaultStringificationParams, stringificationParams);
        } else {
            stringificationParams = Node.defaultStringificationParams;
        }
        return this.stringify(stringificationParams);
    }
    toString() {
        return this.stringify({
            indentChar: '',
            newlineChar: '',
            attrParen: '"'
        });
    }
    /**
     * Decorator.
     */
    static attributeProxyProperty(attrName) {
        for (var _len = arguments.length, alternativeAttrNames = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            alternativeAttrNames[_key - 1] = arguments[_key];
        }

        const attrNames = [attrName].concat(alternativeAttrNames);
        return (target, name) => {
            (0, _defineProperty2.default)(target, name, {});
            const property = (0, _getOwnPropertyDescriptor2.default)(target, name);
            property.get = () => {
                const firstAttrNameMatch = attrNames.find(attrName => target.hasAttribute(attrName));
                if (typeof firstAttrNameMatch === 'string') {
                    target.getAttribute(firstAttrNameMatch);
                }
                return undefined;
            };
            property.set = value => {
                target.setAttribute(attrName, value);
            };
            property.configurable = false;
            property.enumerable = false;
        };
    }
    static changeParentNode(childNode, newParentNode) {
        childNode._parentNode = newParentNode;
    }
    static removeParentNode(childNode) {
        childNode._parentNode = undefined;
    }
    static generateIndentString(indentChar, indentDepth) {
        indentDepth = Math.max(indentDepth || 0, 0);
        if (indentDepth === 0) {
            return '';
        }
        let indentString = '';
        while (indentDepth-- > 0) {
            indentString += indentChar;
        }
        return indentString;
    }
    stringify(params, nodeIndentDepth) {
        nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
        return `${ Node.generateIndentString(params.indentChar, nodeIndentDepth) }<${ this.tagName }${ this.stringifyAttributes(nodeIndentDepth) } />${ params.newlineChar }`;
    }
    stringifyAttributes(nodeIndentDepth) {
        var attrString = '';
        for (let attrName in this.attrList) {
            attrString += ` ${ attrName }="${ this.attrList[attrName] }"`;
        }
        return attrString;
    }
    static mergeObjects(baseObject, overlayObject) {
        for (let key in overlayObject) {
            baseObject[key] = overlayObject[key];
        }
        return baseObject;
    }
}
__decorate([Node.attributeProxyProperty('id', 'ID', 'Id', 'iD')], Node.prototype, "id", void 0);
exports.Node = Node;
},{"babel-runtime/core-js/object/define-property":16,"babel-runtime/core-js/object/get-own-property-descriptor":17,"babel-runtime/core-js/object/keys":18}],10:[function(require,module,exports){
"use strict";

const Node_1 = require('./Node');
class ProcessingInstructionNode extends Node_1.Node {}
exports.ProcessingInstructionNode = ProcessingInstructionNode;
},{"./Node":9}],11:[function(require,module,exports){
"use strict";

const Node_1 = require('./Node');
/**
 * Base class for all nodes that may contain child elements.
 */
class TextNode extends Node_1.Node {
    stringify(params, nodeIndentDepth) {
        return `${ Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth) }${ this.content || '' }${ params.newlineChar }`;
    }
}
exports.TextNode = TextNode;
},{"./Node":9}],12:[function(require,module,exports){
"use strict";

const ast = require('./ast');
exports.ast = ast;
const SyntaxErrorCode_1 = require('./parser/SyntaxErrorCode');
exports.SyntaxErrorCode = SyntaxErrorCode_1.SyntaxErrorCode;
const SyntaxError_1 = require('./parser/SyntaxError');
exports.SyntaxError = SyntaxError_1.SyntaxError;
const Parser_1 = require('./parser/Parser');
exports.Parser = Parser_1.Parser;
const Compiler_1 = require('./Compiler');
exports.Compiler = Compiler_1.Compiler;
},{"./Compiler":1,"./ast":2,"./parser/Parser":13,"./parser/SyntaxError":14,"./parser/SyntaxErrorCode":15}],13:[function(require,module,exports){
"use strict";

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = _promise2.default))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const ast = require('../ast');
const DocumentNode_1 = require('../ast/DocumentNode');
const ContainerNode_1 = require('../ast/ContainerNode');
const SyntaxErrorCode_1 = require('./SyntaxErrorCode');
const SyntaxError_1 = require('./SyntaxError');
/**
 * Parsers create a syntax tree from an XML string. Use the static methods `parse*()` instead of using `new Parser()`.
 */
class Parser {
    /**
     * Creates a new parser object. Use the static methods `parse*()` instead of instantiating manually.
     */
    constructor(stringToParse) {
        this.stringToParse = stringToParse;
        this.ast = new DocumentNode_1.DocumentNode();
        this.currentContainerNode = this.getAst();
        this.currentTokenIndex = 0;
    }
    /**
     * Parses an XML string and returns the parser object that parsed the string.
     * @see Parser.parseStringToAst(...)
     */
    static parseString(stringToParse) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            const parser = new Parser(stringToParse);
            parser.parseComplete();
            return parser;
        });
    }
    /**
     * Parses an XML string and returns a syntax tree.
     * @see Parser.parseString(...)
     */
    static parseStringToAst(stringToParse) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            return (yield Parser.parseString(stringToParse)).getAst();
        });
    }
    /**
     * Returns the syntax tree object the parser creates.
     */
    getAst() {
        return this.ast;
    }
    parseComplete() {
        // don't do anything if the source string is empty
        if (this.stringToParse.length < 1) {
            return;
        }
        while (!this.isAtEndOfInput()) {
            this.parseFromCurrentToken();
        }
    }
    getCurrentLine() {
        return this.getTokenMatrix()[this.getCurrentTokenIndex()].line;
    }
    getCurrentColumn() {
        return this.getTokenMatrix()[this.getCurrentTokenIndex()].column;
    }
    getCurrentTokenIndex() {
        return this.currentTokenIndex;
    }
    isAtEndOfInput() {
        return this.getCurrentTokenIndex() >= this.stringToParse.length;
    }
    getTokenAtIndex(index) {
        return this.stringToParse[index];
    }
    getCurrentToken() {
        return this.getTokenAtIndex(this.getCurrentTokenIndex());
    }
    getTokenRange(startIndex, endIndex) {
        return this.stringToParse.slice(startIndex, endIndex);
    }
    getTokenRangeStartingAt(startIndex, length) {
        return this.stringToParse.slice(startIndex, startIndex + length);
    }
    getNextToken() {
        return this.getTokenAtIndex(this.getCurrentTokenIndex() + 1);
    }
    getPreviousToken() {
        return this.getTokenAtIndex(this.getCurrentTokenIndex() - 1);
    }
    findFirstOccurenceOfTokenAfterIndex(token, startIndex) {
        return this.stringToParse.indexOf(token[0], startIndex);
    }
    doesTokenOccurBeforeNextOccurenceOfOtherToken(token, otherToken, startIndex) {
        const tokenIndex = this.findFirstOccurenceOfTokenAfterIndex(token, startIndex),
              otherTokenIndex = this.findFirstOccurenceOfTokenAfterIndex(otherToken, startIndex);
        if (tokenIndex < 0 || otherTokenIndex < 0) {
            return false;
        }
        return tokenIndex < otherTokenIndex;
    }
    getCurrentContainerNode() {
        return this.currentContainerNode;
    }
    ///
    /// SYNTAX ERROR HANDLING & FACTORY METHODS:
    /// The following methods help creating and raising syntax errors.
    ///
    createSyntaxError(errorCode, line, column, message) {
        return new SyntaxError_1.SyntaxError(errorCode, line, column, this.stringToParse, message);
    }
    createSyntaxErrorAtCurrentToken(errorCode, message) {
        return this.createSyntaxError(errorCode, this.getCurrentLine(), this.getCurrentColumn(), message);
    }
    createUnexpectedTokenSyntaxErrorAtCurrentToken(message) {
        message = message || `token can not be parsed`;
        return this.createSyntaxErrorAtCurrentToken(SyntaxErrorCode_1.SyntaxErrorCode.UnexpectedToken, message);
    }
    raiseError(error) {
        throw error;
    }
    ///
    /// TOKEN IDENTIFICATION & CLASSIFICATION UTILITIES:
    /// Methods that help identifying certain tokens.
    ///
    static isAlphabeticToken(token) {
        return (/[a-z]/i.test(token[0])
        );
    }
    static isNumericToken(token) {
        return (/[0-9]/i.test(token[0])
        );
    }
    static isWhitespaceToken(token) {
        token = token[0];
        return token === ' ' || token === '\t' || token === '\r' || token === '\n';
    }
    static isTokenLegalInTagNameOrTagNameNamespacePrefix(token) {
        return Parser.isAlphabeticToken(token) || Parser.isNumericToken(token) || token[0] === '-' || token[0] === '_';
    }
    static isTokenLegalInAttributeNameOrAttributeNameNameNamespacePrefix(token) {
        return Parser.isAlphabeticToken(token) || Parser.isNumericToken(token) || token[0] === '-' || token[0] === '_';
    }
    ///
    /// TOKEN ITERATION METHODS:
    /// These methods handle the iteration over the XML string that is being parsed. Only use
    /// the methods provided here to iterate over, move along, look at (back or ahead) the XML
    /// string, don't do this manually.
    ///
    moveByNumberOfTokens(numberOfTokens) {
        this.currentTokenIndex += numberOfTokens;
    }
    goBackByNumberOfTokens(numberOfTokens) {
        this.moveByNumberOfTokens(0 - Math.abs(numberOfTokens));
    }
    goBackToPreviousToken() {
        this.goBackByNumberOfTokens(1);
    }
    advanceByNumberOfTokens(numberOfTokens) {
        this.moveByNumberOfTokens(Math.abs(numberOfTokens));
    }
    advanceToNextToken() {
        this.advanceByNumberOfTokens(1);
    }
    ///
    /// PARSING METHODS:
    /// All methods that actually parse XML into AST nodes.
    ///
    parseFromCurrentToken() {
        if (this.isAtEndOfInput()) {
            return;
        }
        switch (true) {
            default:
                this.parseIntoNewTextNode();
                break;
            case typeof this.getCurrentToken() !== 'string':
            case Parser.isWhitespaceToken(this.getCurrentToken()) || this.getCurrentToken() === '\r' || this.getCurrentToken() === '\n':
                this.advanceToNextToken();
                break;
            case this.getCurrentToken() === '<':
                this.parseFromOpenAngleBracket();
                break;
        }
    }
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
    parseFromOpenAngleBracket() {
        // If:
        //     the next token does not indicate a CDATA node, comment, PI or MDO
        //   and:
        //     there's another open angle bracket before the next occurance of a closing angle bracket
        // assume that the current open angle bracket is text node content. In all other cases, assume that the current open angle bracket indicates
        // the bginning of a new tag.
        if (this.getNextToken() !== '!' && this.getNextToken() !== '?' && this.doesTokenOccurBeforeNextOccurenceOfOtherToken('<', '>', this.getCurrentTokenIndex() + 1)) {
            this.parseIntoNewTextNode();
        } else {
            this.parseFromBeginningOfTag();
        }
    }
    /**
     * Creates a new text node, appends it to the ast and parses all upcoming text into it. Stops parsing at the first character that can not be
     * considered text anymore.
     */
    parseIntoNewTextNode() {
        const textNode = new ast.TextNode();
        textNode.content = '';
        this.getCurrentContainerNode().appendChild(textNode);
        // skip all whitespace
        while (Parser.isWhitespaceToken(this.getCurrentToken())) {
            this.advanceToNextToken();
        }
        while (!this.isAtEndOfInput()) {
            // If the current token is an open angle bracket ('<'), we could have the following two situations:
            //     <a>123</a>
            //           ^
            // or:
            //     <a>123<456</a>
            //           ^
            // To distinguish between these situations, we have to check whether another open angle bracket appears
            // before the next closing bracket:
            //     <a>123</a>
            //           ^  |
            //              ^ — There's no other open angle bracket before the closing one, hence
            //                  the open angle bracket opens the closing tag.
            // or:
            //     <a>123<123</a>
            //           ^   |
            //               ^ — There is indeed another open angle bracket before the closing one,
            //                   hence the open angle bracket we're at right now does *not* open the
            //                   closing tag.
            if (this.getCurrentToken() === '<' && !this.doesTokenOccurBeforeNextOccurenceOfOtherToken('<', '>', this.getCurrentTokenIndex() + 1)) {
                // we're at the start of the closing tag, so don't collect any further text content
                break;
            }
            textNode.content += this.getCurrentToken();
            this.advanceToNextToken();
        }
    }
    parseFromBeginningOfTag() {
        // Find out if we're dealing with a "normal" node here or with a MDO (markup declaration opener), PI (processing instruction) or comment.
        // We will not know whether the node is self closing, or if it has child nodes or text content, but
        // we know just enough to delegate the node to a more dedicated parsing method depending on what the
        // node actually is.
        switch (true) {
            default:
                this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken(`expected exclamation mark, question mark or alphabetic tag name`));
                break;
            // The node is a normal tag if it starts with an alphabetic token, such as:
            //     <foo ...
            //      ^
            // or:
            //     <a alpha="1" />
            //      ^
            case Parser.isTokenLegalInTagNameOrTagNameNamespacePrefix(this.getNextToken()):
                this.parseFromBeginningOfNormalNode();
                break;
            // The node is a close tag if it starts with an open angle bracket followed by a slash, such as:
            //     </foo>
            //     ^^
            // or:
            //     </ foo>
            //     ^^
            case this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 2) === '</':
                this.parseFromBeginningOfCloseTag();
                break;
            // If the node's tag name starts with an exclamation mark, the node is either a, CDATA section, MDO or a comment:
            //     <![CDATA[ ...
            //      ^
            // or:
            //     <!DOCTYPE ...
            //      ^
            // or:
            //     <!-- ...
            //      ^
            case this.getNextToken() === '!':
                // Look ahead at the next character(s) to decide whether the node is a CDATA section, MDO or a comment.
                switch (true) {
                    default:
                        this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken(`expected declaration opener or comment node`));
                        break;
                    // There's a CDATA opener coming up
                    //     <![CDATA[ ...
                    //       ^^^^^^^
                    case this.getTokenRangeStartingAt(this.getCurrentTokenIndex() + 2, 7) === '[CDATA[':
                        this.parseFromBeginningOfCDataSectionNode();
                        break;
                    // There's an alphabetic token following the exclamation mark, so it's an MDO node:
                    //     <!DOCTYPE ...
                    //       ^
                    case Parser.isAlphabeticToken(this.getTokenAtIndex(this.getCurrentTokenIndex() + 2)):
                        this.parseFromBeginningOfDeclarationOpenerNode();
                        break;
                    // If there's a double hyphen following the exclamation mark, it's always a comment:
                    //     <!-- ...
                    //       ^^
                    case this.getTokenRangeStartingAt(this.getCurrentTokenIndex() + 2, 2) === '--':
                        this.parseFromBeginningOfCommentNode();
                        break;
                }
                break;
            // If the node's tag name starts with a question mark, the node is a PI:
            //     <?svg ...
            //      ^
            case this.getNextToken() === '?':
                this.parseFromBeginningOfProcessingInstructionNode();
                break;
        }
    }
    parseFromBeginningOfNormalNode() {
        // Validate that we actually have a "normal" node:
        if (!Parser.isTokenLegalInTagNameOrTagNameNamespacePrefix(this.getNextToken())) {
            this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken(`expected beginning of tag name, got '${ this.getNextToken() }'`));
        }
        const node = new ContainerNode_1.ContainerNode();
        this.getCurrentContainerNode().appendChild(node);
        // Skip over the node opener:
        //     <alpha ...
        //     ^      we're here
        this.advanceToNextToken();
        //     <alpha
        //      ^      we're here
        this.parseCompleteOpeningTagInto(node, true, false);
        return;
    }
    parseFromBeginningOfCloseTag() {
        // Validate that we actually have a close tag:
        if (this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 2) !== '</') {
            this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken(`expected beginning of close tag (</...), got '${ this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 2) }'`));
        }
        // Skip over the tag opener:
        //     </alpha ...
        //     ^      we're here
        this.advanceByNumberOfTokens(2);
        //     </alpha
        //       ^      we're here
        while (Parser.isWhitespaceToken(this.getCurrentToken())) {
            this.advanceToNextToken();
        }
        while (Parser.isTokenLegalInTagNameOrTagNameNamespacePrefix(this.getCurrentToken())) {
            this.advanceToNextToken();
        }
        while (Parser.isWhitespaceToken(this.getCurrentToken())) {
            this.advanceToNextToken();
        }
        if (this.getCurrentToken() !== '>') {
            this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken(`expected end of close tag, got '${ this.getCurrentToken() }'`));
        }
        this.advanceToNextToken();
        this.currentContainerNode = this.currentContainerNode.parentNode;
        return;
    }
    parseFromBeginningOfDeclarationOpenerNode() {
        // Validate that we actually have an MDO node:
        if (this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 2) !== '<!') {
            this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken('expected beginning of declaration opener (<!)'));
        }
        // We know this is actually an MDO node, so create the tree member and append it
        const mdoNode = new ast.DeclarationOpenerNode();
        this.getCurrentContainerNode().appendChild(mdoNode);
        // Skip over the MDO opener:
        //     <!DOCTYPE ...
        //     ^      we're here
        this.advanceByNumberOfTokens(2);
        //     <!DOCTYPE
        //       ^      we're here
        this.parseCompleteOpeningTagInto(mdoNode, false, true);
        return;
    }
    parseFromBeginningOfProcessingInstructionNode() {
        // Validate that we actually have a PI node:
        if (this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 2) !== '<?') {
            this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken('expected beginning of processing instruction (<?)'));
        }
        // We know this is actually a PI node, so create the tree member and append it
        const piNode = new ast.ProcessingInstructionNode();
        this.getCurrentContainerNode().appendChild(piNode);
        // Skip over the PI opener:
        //     <?svg ...
        //     ^      we're here
        this.advanceByNumberOfTokens(2);
        //     <?svg
        //       ^      we're here
        this.parseCompleteOpeningTagInto(piNode, false, false);
        return;
    }
    /**
     * Parses a CDATA section.
     * @see https://www.w3.org/TR/xml/#sec-cdata-sect
     */
    parseFromBeginningOfCDataSectionNode() {
        // Validate that we actually have a CDATA section node:
        if (this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 9) !== '<![CDATA[') {
            this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken('expected beginning of CDATA section (<![CDATA[)'));
        }
        // We know this is actually a CDATA section node, so create the tree member and append to its content as long as it isn't closed by ']]>'.
        const cdataNode = new ast.CDataSectionNode();
        this.getCurrentContainerNode().appendChild(cdataNode);
        // Skip over the CDATA opener:
        //     <![CDATA[
        //     ^      we're here
        this.advanceByNumberOfTokens(9);
        //     <![CDATA[
        //             ^      we're here
        // Start appending to the content:
        cdataNode.content = '';
        while (this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 3) !== ']]>') {
            cdataNode.content += this.getCurrentToken();
            this.advanceToNextToken();
        }
        // Skip to after the end of the comment node:
        //     <![CDATA[...]]>
        //                ^      we're here
        this.advanceByNumberOfTokens(3);
        //     <![CDATA[...]]>
        //                    ^      we're now here
        return;
    }
    parseFromBeginningOfCommentNode() {
        // Validate that we actually have a comment node:
        if (this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 4) !== '<!--') {
            this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken('expected beginning of comment (<!--)'));
        }
        // We know this is actually a comment node, so create the tree member and append to its content as long as the comment
        // node is not closed by `-->`.
        const commentNode = new ast.CommentNode();
        this.getCurrentContainerNode().appendChild(commentNode);
        // Skip over the comment opener:
        //     <!--
        //     ^      we're here
        this.advanceByNumberOfTokens(4);
        //     <!--
        //         ^      we're here
        // Start appending to the comment's content:
        commentNode.content = '';
        while (this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 3) !== '-->') {
            commentNode.content += this.getCurrentToken();
            this.advanceToNextToken();
        }
        // Skip to after the end of the comment node:
        //     <!-- some comment text, maybe with line breaks -->
        //                                                   ^      we're here
        this.advanceByNumberOfTokens(4);
        //     <!-- some comment text, maybe with line breaks -->
        //                                                       ^      we're now here
        return;
    }
    parseCompleteOpeningTagInto(node, allowDescendingIntoNewNode, allowSystemLiterals) {
        // we could now be in any of the following constructs:
        //     <alpha ...
        //      ^
        // or:
        //     <!DOCTYPE ...
        //       ^
        // or:
        //     <?svg ...
        //       ^
        this.parseTagNameInto(node);
        if (this.getCurrentToken() !== '?' && this.getCurrentToken() !== '>') {
            this.parseAttributeListInto(node, allowSystemLiterals);
        }
        // skip all whitespace
        while (Parser.isWhitespaceToken(this.getCurrentToken())) {
            this.advanceToNextToken();
        }
        switch (true) {
            default:
                this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken(`expected end of opening tag`));
                break;
            case this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 2) === '/>':
                this.advanceByNumberOfTokens(2);
                return;
            case this.getCurrentToken() === '?':
                this.advanceToNextToken();
            // FALL THROUGH
            case this.getCurrentToken() === '>':
                if (allowDescendingIntoNewNode) {
                    this.currentContainerNode = node;
                }
                this.advanceToNextToken();
                break;
        }
    }
    /**
     * Parses a tag name into an AST node. Supports namespace prefixes.
     * @param node The AST node to parse the tag name into.
     */
    parseTagNameInto(node) {
        // this will be set to `true` as soon as the first colon was seen
        var colonSeen = false,
            nameStash = '';
        // we could now be in any of the following constructs:
        //     <alpha ...
        //      ^
        //     <alpha:beta ...
        //      ^
        // or:
        //     <!DOCTYPE ...
        //       ^
        // or:
        //     <?svg ...
        //       ^
        while (Parser.isTokenLegalInTagNameOrTagNameNamespacePrefix(this.getCurrentToken()) || this.getCurrentToken() === ':') {
            if (this.getCurrentToken() === ':') {
                if (colonSeen) {
                    this.raiseError(this.createSyntaxErrorAtCurrentToken(SyntaxErrorCode_1.SyntaxErrorCode.IllegalNamespacePrefix, 'illegal multiple namespace prefix (multiple colons in tag name)'));
                }
                colonSeen = true;
                node.namespacePrefix = node.namespacePrefix || '';
                node.namespacePrefix += nameStash;
                nameStash = '';
                this.advanceToNextToken();
                if (!Parser.isAlphabeticToken(this.getCurrentToken())) {
                    this.raiseError(this.createSyntaxErrorAtCurrentToken(SyntaxErrorCode_1.SyntaxErrorCode.MissingTagNameAfterNamespacePrefix, 'namespace prefix must be followed by a tag name'));
                    return;
                }
            }
            nameStash += this.getCurrentToken();
            this.advanceToNextToken();
        }
        node.tagName = nameStash;
    }
    parseAttributeListInto(node, allowSystemLiterals) {
        // We are now at the first token after the opening tag name, which could be either whitespace, the end of the opening tag or
        // the start of a system literal:
        //     <alpha fibo="nacci"...
        //           ^
        // or:
        //     <alpha>
        //           ^
        // or:
        //     <alpha />
        //           ^
        // or:
        //     <alpha/>
        //           ^
        // or:
        //     <alpha"FOO"/>
        //           ^
        if (!Parser.isWhitespaceToken(this.getCurrentToken()) && this.getCurrentToken() !== '/' && this.getCurrentToken() !== '>') {
            if (!(allowSystemLiterals && (this.getCurrentToken() !== '"' || this.getCurrentToken() !== '\''))) {
                this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken('expected whitespace or end of opening tag'));
            }
        }
        // skip all whitespace
        while (Parser.isWhitespaceToken(this.getCurrentToken())) {
            this.advanceToNextToken();
        }
        // if there's no alphabetic token here, there are no attributes to be parsed
        if (!Parser.isAlphabeticToken(this.getCurrentToken()) && !(allowSystemLiterals && (this.getCurrentToken() !== '"' || this.getCurrentToken() !== '\''))) {
            return;
        }
        let i = 0;
        // advance until there are no attributes and literals to be parsed
        while (this.getCurrentToken() !== '/' && this.getCurrentToken() !== '>' && i++ < 10) {
            if (this.getCurrentToken() === '"' || this.getCurrentToken() === '\'') {
                if (!allowSystemLiterals) {
                    this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken('system literal not allowed on this node'));
                }
                node.systemLiterals.push(this.parseLiteral());
            } else {
                let attrInfo = this.parseAttribute();
                node.setAttribute(attrInfo.name, attrInfo.value);
                // skip all whitespace
                while (Parser.isWhitespaceToken(this.getCurrentToken())) {
                    this.advanceToNextToken();
                }
            }
        }
    }
    parseLiteral() {
        var value = '';
        // skip all whitespace
        while (Parser.isWhitespaceToken(this.getCurrentToken())) {
            this.advanceToNextToken();
        }
        const valueQuoteCharacter = this.getCurrentToken();
        while (!this.isAtEndOfInput()) {
            this.advanceToNextToken();
            if (this.getCurrentToken() === valueQuoteCharacter && this.getPreviousToken() !== '\\') {
                this.advanceToNextToken();
                break;
            }
            if (this.getCurrentToken() === '\\' && this.getNextToken() === valueQuoteCharacter) {
                continue;
            }
            value += this.getCurrentToken();
        }
        return value;
    }
    parseAttribute() {
        var name = '',
            value,
            valueQuoteCharacter,
            colonSeen = false,
            getAttrInfo = () => ({ name: name, value: value });
        // skip all whitespace
        while (Parser.isWhitespaceToken(this.getCurrentToken())) {
            this.advanceToNextToken();
        }
        // advance as long as we're in the attribute's name
        while (Parser.isTokenLegalInAttributeNameOrAttributeNameNameNamespacePrefix(this.getCurrentToken()) || this.getCurrentToken() === ':') {
            if (this.getCurrentToken() === ':') {
                if (colonSeen) {
                    this.raiseError(this.createSyntaxErrorAtCurrentToken(SyntaxErrorCode_1.SyntaxErrorCode.IllegalNamespacePrefix, 'illegal multiple namespace prefix (multiple colons in tag name)'));
                }
                colonSeen = true;
                if (!Parser.isAlphabeticToken(this.getNextToken())) {
                    this.raiseError(this.createSyntaxErrorAtCurrentToken(SyntaxErrorCode_1.SyntaxErrorCode.MissingTagNameAfterNamespacePrefix, 'namespace prefix must be followed by a tag name'));
                    return;
                }
            }
            name += this.getCurrentToken();
            this.advanceToNextToken();
        }
        // skip all whitespace after the attribute name
        while (Parser.isWhitespaceToken(this.getCurrentToken())) {
            this.advanceToNextToken();
        }
        // if there's no equal sign here, the attribute is empty:
        if (this.getCurrentToken() !== '=') {
            return getAttrInfo();
        }
        this.advanceToNextToken();
        if (Parser.isWhitespaceToken(this.getCurrentToken()) || this.getCurrentToken() === '"' || this.getCurrentToken() === '\'') {
            // skip all whitespace after the equal sign
            while (Parser.isWhitespaceToken(this.getCurrentToken())) {
                this.advanceToNextToken();
            }
            if (this.getCurrentToken() === '"' || this.getCurrentToken() === '\'') {
                valueQuoteCharacter = this.getCurrentToken();
            } else {
                return getAttrInfo();
            }
        } else {}
        value = '';
        while (!this.isAtEndOfInput()) {
            this.advanceToNextToken();
            if (this.getCurrentToken() === valueQuoteCharacter && this.getPreviousToken() !== '\\') {
                this.advanceToNextToken();
                break;
            }
            if (this.getCurrentToken() === '\\' && this.getNextToken() === valueQuoteCharacter) {
                continue;
            }
            value += this.getCurrentToken();
        }
        return getAttrInfo();
    }
    ///
    /// MISC METHODS & PROPERTIES:
    ///
    getTokenMatrix() {
        if (typeof this.tokenMatrix !== 'object' || this.tokenMatrix === null) {
            this.createTokenMatrix();
        }
        return this.tokenMatrix;
    }
    createTokenMatrix() {
        var line = 1,
            column = 0;
        this.tokenMatrix = new Array(this.stringToParse.length);
        for (let i = 0; i < this.stringToParse.length; i++) {
            column += 1;
            const currentToken = this.stringToParse[i];
            this.tokenMatrix[i] = { line: line, column: column };
            if (currentToken === '\n') {
                line += 1;
                column = 0;
            }
        }
    }
}
exports.Parser = Parser;
},{"../ast":2,"../ast/ContainerNode":6,"../ast/DocumentNode":8,"./SyntaxError":14,"./SyntaxErrorCode":15,"babel-runtime/core-js/promise":19}],14:[function(require,module,exports){
"use strict";

const SyntaxErrorCode_1 = require('./SyntaxErrorCode');
class SyntaxError extends Error {
    constructor(errorCode, line, column, source, message) {
        super(message);
        this.errorCode = errorCode;
        this.line = line;
        this.column = column;
        this.source = source;
    }
    static getSyntaxErrorCodeName(errorCode) {
        return SyntaxErrorCode_1.SyntaxErrorCode[errorCode];
    }
    getMessage() {
        return this.message;
    }
    getErrorCode() {
        return this.errorCode;
    }
    getErrorName() {
        return SyntaxError.getSyntaxErrorCodeName(this.getErrorCode());
    }
    getLine() {
        return this.line;
    }
    getColumn() {
        return this.column;
    }
    toString() {
        return `syntax error [${ this.getErrorCode() } ${ this.getErrorName() }] at token '${ this.getTokenAt(this.line, this.column) }' ${ this.getLine() }, ${ this.getColumn() }: ${ this.getMessage() }`;
    }
    getTokenAt(line, column) {
        return this.source.split(/\n/)[line - 1].split('')[column - 1];
    }
}
exports.SyntaxError = SyntaxError;
},{"./SyntaxErrorCode":15}],15:[function(require,module,exports){
"use strict";

(function (SyntaxErrorCode) {
    SyntaxErrorCode[SyntaxErrorCode["Unknown"] = 0] = "Unknown";
    SyntaxErrorCode[SyntaxErrorCode["UnexpectedToken"] = 1] = "UnexpectedToken";
    SyntaxErrorCode[SyntaxErrorCode["MissingTagNameAfterNamespacePrefix"] = 2] = "MissingTagNameAfterNamespacePrefix";
    SyntaxErrorCode[SyntaxErrorCode["MissingAttrNameAfterAttrPrefix"] = 3] = "MissingAttrNameAfterAttrPrefix";
    SyntaxErrorCode[SyntaxErrorCode["IllegalNamespacePrefix"] = 4] = "IllegalNamespacePrefix";
})(exports.SyntaxErrorCode || (exports.SyntaxErrorCode = {}));
var SyntaxErrorCode = exports.SyntaxErrorCode;
},{}],16:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":20}],17:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-own-property-descriptor"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-descriptor":21}],18:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":22}],19:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/promise"), __esModule: true };
},{"core-js/library/fn/promise":23}],20:[function(require,module,exports){
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};
},{"../../modules/_core":31,"../../modules/es6.object.define-property":87}],21:[function(require,module,exports){
require('../../modules/es6.object.get-own-property-descriptor');
var $Object = require('../../modules/_core').Object;
module.exports = function getOwnPropertyDescriptor(it, key){
  return $Object.getOwnPropertyDescriptor(it, key);
};
},{"../../modules/_core":31,"../../modules/es6.object.get-own-property-descriptor":88}],22:[function(require,module,exports){
require('../../modules/es6.object.keys');
module.exports = require('../../modules/_core').Object.keys;
},{"../../modules/_core":31,"../../modules/es6.object.keys":89}],23:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.promise');
module.exports = require('../modules/_core').Promise;
},{"../modules/_core":31,"../modules/es6.object.to-string":90,"../modules/es6.promise":91,"../modules/es6.string.iterator":92,"../modules/web.dom.iterable":93}],24:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],25:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],26:[function(require,module,exports){
module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};
},{}],27:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":48}],28:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length')
  , toIndex   = require('./_to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};
},{"./_to-index":77,"./_to-iobject":79,"./_to-length":80}],29:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof')
  , TAG = require('./_wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./_cof":30,"./_wks":84}],30:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],31:[function(require,module,exports){
var core = module.exports = {version: '2.3.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],32:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":24}],33:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],34:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":38}],35:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":40,"./_is-object":48}],36:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
},{}],37:[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , ctx       = require('./_ctx')
  , hide      = require('./_hide')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
},{"./_core":31,"./_ctx":32,"./_global":40,"./_hide":42}],38:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],39:[function(require,module,exports){
var ctx         = require('./_ctx')
  , call        = require('./_iter-call')
  , isArrayIter = require('./_is-array-iter')
  , anObject    = require('./_an-object')
  , toLength    = require('./_to-length')
  , getIterFn   = require('./core.get-iterator-method');
module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"./_an-object":27,"./_ctx":32,"./_is-array-iter":47,"./_iter-call":49,"./_to-length":80,"./core.get-iterator-method":85}],40:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],41:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],42:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":34,"./_object-dp":58,"./_property-desc":66}],43:[function(require,module,exports){
module.exports = require('./_global').document && document.documentElement;
},{"./_global":40}],44:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":34,"./_dom-create":35,"./_fails":38}],45:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],46:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":30}],47:[function(require,module,exports){
// check on default Array iterator
var Iterators  = require('./_iterators')
  , ITERATOR   = require('./_wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./_iterators":54,"./_wks":84}],48:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],49:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./_an-object":27}],50:[function(require,module,exports){
'use strict';
var create         = require('./_object-create')
  , descriptor     = require('./_property-desc')
  , setToStringTag = require('./_set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./_hide":42,"./_object-create":57,"./_property-desc":66,"./_set-to-string-tag":71,"./_wks":84}],51:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./_library')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , hide           = require('./_hide')
  , has            = require('./_has')
  , Iterators      = require('./_iterators')
  , $iterCreate    = require('./_iter-create')
  , setToStringTag = require('./_set-to-string-tag')
  , getPrototypeOf = require('./_object-gpo')
  , ITERATOR       = require('./_wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./_export":37,"./_has":41,"./_hide":42,"./_iter-create":50,"./_iterators":54,"./_library":55,"./_object-gpo":61,"./_redefine":68,"./_set-to-string-tag":71,"./_wks":84}],52:[function(require,module,exports){
var ITERATOR     = require('./_wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./_wks":84}],53:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],54:[function(require,module,exports){
module.exports = {};
},{}],55:[function(require,module,exports){
module.exports = true;
},{}],56:[function(require,module,exports){
var global    = require('./_global')
  , macrotask = require('./_task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = require('./_cof')(process) == 'process';

module.exports = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode && (parent = process.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode){
    notify = function(){
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise && Promise.resolve){
    var promise = Promise.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};
},{"./_cof":30,"./_global":40,"./_task":76}],57:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = require('./_an-object')
  , dPs         = require('./_object-dps')
  , enumBugKeys = require('./_enum-bug-keys')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe')
    , i      = enumBugKeys.length
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write('<script>document.F=Object</script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};
},{"./_an-object":27,"./_dom-create":35,"./_enum-bug-keys":36,"./_html":43,"./_object-dps":59,"./_shared-key":72}],58:[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":27,"./_descriptors":34,"./_ie8-dom-define":44,"./_to-primitive":82}],59:[function(require,module,exports){
var dP       = require('./_object-dp')
  , anObject = require('./_an-object')
  , getKeys  = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};
},{"./_an-object":27,"./_descriptors":34,"./_object-dp":58,"./_object-keys":63}],60:[function(require,module,exports){
var pIE            = require('./_object-pie')
  , createDesc     = require('./_property-desc')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , has            = require('./_has')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};
},{"./_descriptors":34,"./_has":41,"./_ie8-dom-define":44,"./_object-pie":64,"./_property-desc":66,"./_to-iobject":79,"./_to-primitive":82}],61:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = require('./_has')
  , toObject    = require('./_to-object')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};
},{"./_has":41,"./_shared-key":72,"./_to-object":81}],62:[function(require,module,exports){
var has          = require('./_has')
  , toIObject    = require('./_to-iobject')
  , arrayIndexOf = require('./_array-includes')(false)
  , IE_PROTO     = require('./_shared-key')('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};
},{"./_array-includes":28,"./_has":41,"./_shared-key":72,"./_to-iobject":79}],63:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require('./_object-keys-internal')
  , enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
},{"./_enum-bug-keys":36,"./_object-keys-internal":62}],64:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;
},{}],65:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export')
  , core    = require('./_core')
  , fails   = require('./_fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./_core":31,"./_export":37,"./_fails":38}],66:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],67:[function(require,module,exports){
var hide = require('./_hide');
module.exports = function(target, src, safe){
  for(var key in src){
    if(safe && target[key])target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};
},{"./_hide":42}],68:[function(require,module,exports){
module.exports = require('./_hide');
},{"./_hide":42}],69:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object')
  , anObject = require('./_an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./_an-object":27,"./_ctx":32,"./_is-object":48,"./_object-gopd":60}],70:[function(require,module,exports){
'use strict';
var global      = require('./_global')
  , core        = require('./_core')
  , dP          = require('./_object-dp')
  , DESCRIPTORS = require('./_descriptors')
  , SPECIES     = require('./_wks')('species');

module.exports = function(KEY){
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./_core":31,"./_descriptors":34,"./_global":40,"./_object-dp":58,"./_wks":84}],71:[function(require,module,exports){
var def = require('./_object-dp').f
  , has = require('./_has')
  , TAG = require('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_has":41,"./_object-dp":58,"./_wks":84}],72:[function(require,module,exports){
var shared = require('./_shared')('keys')
  , uid    = require('./_uid');
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
},{"./_shared":73,"./_uid":83}],73:[function(require,module,exports){
var global = require('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":40}],74:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = require('./_an-object')
  , aFunction = require('./_a-function')
  , SPECIES   = require('./_wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./_a-function":24,"./_an-object":27,"./_wks":84}],75:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , defined   = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./_defined":33,"./_to-integer":78}],76:[function(require,module,exports){
var ctx                = require('./_ctx')
  , invoke             = require('./_invoke')
  , html               = require('./_html')
  , cel                = require('./_dom-create')
  , global             = require('./_global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./_cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./_cof":30,"./_ctx":32,"./_dom-create":35,"./_global":40,"./_html":43,"./_invoke":45}],77:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./_to-integer":78}],78:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],79:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject')
  , defined = require('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":33,"./_iobject":46}],80:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":78}],81:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":33}],82:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":48}],83:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],84:[function(require,module,exports){
var store      = require('./_shared')('wks')
  , uid        = require('./_uid')
  , Symbol     = require('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
},{"./_global":40,"./_shared":73,"./_uid":83}],85:[function(require,module,exports){
var classof   = require('./_classof')
  , ITERATOR  = require('./_wks')('iterator')
  , Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./_classof":29,"./_core":31,"./_iterators":54,"./_wks":84}],86:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables')
  , step             = require('./_iter-step')
  , Iterators        = require('./_iterators')
  , toIObject        = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./_add-to-unscopables":25,"./_iter-define":51,"./_iter-step":53,"./_iterators":54,"./_to-iobject":79}],87:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperty: require('./_object-dp').f});
},{"./_descriptors":34,"./_export":37,"./_object-dp":58}],88:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject                 = require('./_to-iobject')
  , $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function(){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./_object-gopd":60,"./_object-sap":65,"./_to-iobject":79}],89:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object')
  , $keys    = require('./_object-keys');

require('./_object-sap')('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./_object-keys":63,"./_object-sap":65,"./_to-object":81}],90:[function(require,module,exports){

},{}],91:[function(require,module,exports){
'use strict';
var LIBRARY            = require('./_library')
  , global             = require('./_global')
  , ctx                = require('./_ctx')
  , classof            = require('./_classof')
  , $export            = require('./_export')
  , isObject           = require('./_is-object')
  , anObject           = require('./_an-object')
  , aFunction          = require('./_a-function')
  , anInstance         = require('./_an-instance')
  , forOf              = require('./_for-of')
  , setProto           = require('./_set-proto').set
  , speciesConstructor = require('./_species-constructor')
  , task               = require('./_task').set
  , microtask          = require('./_microtask')()
  , PROMISE            = 'Promise'
  , TypeError          = global.TypeError
  , process            = global.process
  , $Promise           = global[PROMISE]
  , process            = global.process
  , isNode             = classof(process) == 'process'
  , empty              = function(){ /* empty */ }
  , Internal, GenericPromiseCapability, Wrapper;

var USE_NATIVE = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject  = aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(global, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject  = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});
},{"./_a-function":24,"./_an-instance":26,"./_an-object":27,"./_classof":29,"./_core":31,"./_ctx":32,"./_export":37,"./_for-of":39,"./_global":40,"./_is-object":48,"./_iter-detect":52,"./_library":55,"./_microtask":56,"./_redefine-all":67,"./_set-proto":69,"./_set-species":70,"./_set-to-string-tag":71,"./_species-constructor":74,"./_task":76,"./_wks":84}],92:[function(require,module,exports){
'use strict';
var $at  = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./_iter-define":51,"./_string-at":75}],93:[function(require,module,exports){
require('./es6.array.iterator');
var global        = require('./_global')
  , hide          = require('./_hide')
  , Iterators     = require('./_iterators')
  , TO_STRING_TAG = require('./_wks')('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}
},{"./_global":40,"./_hide":42,"./_iterators":54,"./_wks":84,"./es6.array.iterator":86}]},{},[12])
(12)
});