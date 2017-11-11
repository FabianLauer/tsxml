(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("./parser/Parser");
class Compiler {
    /**
     * Parses an XML string and returns the parser object that parsed it.
     */
    static parseXml(xmlString, ruleSet) {
        return Parser_1.Parser.parseString(xmlString, ruleSet);
    }
    /**
     * Parses an XML string and returns the a syntax tree.
     */
    static parseXmlToAst(xmlString, ruleSet) {
        return Parser_1.Parser.parseStringToAst(xmlString, ruleSet);
    }
    /**
     * Parses an XML string to a syntax tree, then serializes it to formatted XML.
     */
    static formatXmlString(xmlString, formattingOptions, ruleSet) {
        return Parser_1.Parser.parseStringToAst(xmlString, ruleSet).toFormattedString(formattingOptions);
    }
}
exports.Compiler = Compiler;
;

},{"./parser/Parser":16}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Attribute {
    static create(value) {
        return new (class extends Attribute {
            constructor() {
                super(...arguments);
                this.value = value;
            }
        });
    }
    valueOf() {
        return this.value;
    }
    toString() {
        return this.value + '';
    }
}
exports.Attribute = Attribute;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TextNode_1 = require("./TextNode");
class CDataSectionNode extends TextNode_1.TextNode {
    /**
     * @override
     */
    stringify(params, nodeIndentDepth) {
        return `${CDataSectionNode.generateIndentString(params.indentChar, nodeIndentDepth)}<![CDATA[${this.stringifyContent(params, nodeIndentDepth)}]]>${params.newlineChar}`;
    }
    /**
     * @override
     */
    stringifyMultiLineContent(params, nodeIndentDepth) {
        if (/\n/.test(params.newlineChar)) {
            return '\n' + super.stringifyMultiLineContent(params, nodeIndentDepth) + CDataSectionNode.generateIndentString(params.indentChar, nodeIndentDepth);
        }
        else {
            return super.stringifyMultiLineContent(params, nodeIndentDepth);
        }
    }
    /**
     * @override
     */
    stringifySingleLineContent(params, nodeIndentDepth) {
        return (this.content || '').replace(/(\r?\n(\t*))+/g, ' ');
    }
}
exports.CDataSectionNode = CDataSectionNode;

},{"./TextNode":11}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TextNode_1 = require("./TextNode");
class CommentNode extends TextNode_1.TextNode {
    /**
     * @override
     */
    stringify(params, nodeIndentDepth) {
        return `${CommentNode.generateIndentString(params.indentChar, nodeIndentDepth)}<!--${this.stringifyContent(params, nodeIndentDepth)}-->${params.newlineChar}`;
    }
    /**
     * @override
     */
    stringifyMultiLineContent(params, nodeIndentDepth) {
        if (/\n/.test(params.newlineChar)) {
            return '\n' + super.stringifyMultiLineContent(params, nodeIndentDepth) + CommentNode.generateIndentString(params.indentChar, nodeIndentDepth);
        }
        else {
            return ' ' + super.stringifyMultiLineContent(params, nodeIndentDepth) + ' ';
        }
    }
    /**
     * @override
     */
    stringifySingleLineContent(params, nodeIndentDepth) {
        return ' ' + (this.content || '').trim().replace(/(\r?\n(\t*))+/g, ' ').trim() + ' ';
    }
}
exports.CommentNode = CommentNode;

},{"./TextNode":11}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = require("./Node");
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
    /**
     * @chainable
     */
    replaceChild(oldChild, newChild) {
        const index = this.getIndexOfChild(oldChild);
        this.removeChildAt(index);
        this.insertChildAt(newChild, index);
        return this;
    }
    forEachChildNode(fn) {
        this.childNodes.forEach((childNode, index) => fn(childNode, index));
    }
    isSubtreeIdenticalTo(otherNode) {
        if (this.getNumberOfChildren() !== otherNode.getNumberOfChildren()) {
            return false;
        }
        for (let i = 0; i < this.getNumberOfChildren(); i++) {
            if (!this.getChildAtIndex(i).isIdenticalTo(otherNode.getChildAtIndex(i))) {
                return false;
            }
        }
        return true;
    }
    /**
     * Checks whether a node is identical to another node by comparing tag names, attribute names and values and subtree.
     */
    isIdenticalTo(otherNode) {
        return super.isIdenticalTo(otherNode) && this.isSubtreeIdenticalTo(otherNode);
    }
    /**
     * @override
     */
    stringify(params, nodeIndentDepth) {
        nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
        return `${Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth)}<${this.tagName}${this.stringifyAttributes(nodeIndentDepth)}>${this.stringifyAllChildNodes(params, nodeIndentDepth)}${Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth)}</${this.tagName}>${params.newlineChar}`;
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

},{"./Node":8}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = require("./Node");
class DeclarationOpenerNode extends Node_1.Node {
    constructor() {
        super(...arguments);
        this.systemLiterals = [];
        this.literalAndAttrOrder = [];
    }
    getNumberOfSystemLiterals() {
        return this.systemLiterals.length;
    }
    getIndexOfSystemLiteral(literal) {
        return this.systemLiterals.indexOf(literal);
    }
    getSystemLiteralAtIndex(literalIndex) {
        return this.systemLiterals[literalIndex];
    }
    getAllSystemLiterals() {
        return [].concat(this.systemLiterals);
    }
    hasSystemLiteral(literal) {
        return this.getIndexOfSystemLiteral(literal) !== -1;
    }
    /**
     * @chainable
     */
    insertIntoSystemLiteralList(literal, index) {
        this.appendSystemLiteralIndexToOrderList(index);
        this.systemLiterals.splice(index, 0, literal);
        return this;
    }
    /**
     * @chainable
     */
    prependToSystemLiteralList(literal) {
        this.insertIntoSystemLiteralList(literal, 0);
        return this;
    }
    /**
     * @chainable
     */
    appendToSystemLiteralList(literal) {
        this.insertIntoSystemLiteralList(literal, this.getNumberOfSystemLiterals());
        return this;
    }
    /**
     * @chainable
     */
    removeSystemLiteralAtIndex(index) {
        this.removeSystemLiteralIndexFromOrderList(index);
        this.systemLiterals.splice(index, 1);
        return this;
    }
    /**
     * @chainable
     */
    removeSystemLiteral(literal) {
        let index = this.getIndexOfSystemLiteral(literal);
        while (index !== -1) {
            this.systemLiterals.splice(index, 1);
            index = this.getIndexOfSystemLiteral(literal);
        }
        return this;
    }
    /**
     * @chainable
     * @override
     */
    setAttribute(attrName, value, namespaceName) {
        this.appendAttributeToOrderList(Node_1.Node.joinAttributeNameWithNamespacePrefix(attrName, namespaceName));
        super.setAttribute(attrName, value, namespaceName);
        return this;
    }
    /**
     * @chainable
     * @override
     */
    removeAttribute(attrName, namespaceName) {
        this.removeAttributeFromOrderList(Node_1.Node.joinAttributeNameWithNamespacePrefix(attrName, namespaceName));
        super.removeAttribute(attrName, namespaceName);
        return this;
    }
    isSystemLiteralListIdenticalTo(otherNode) {
        if (this.systemLiterals.length !== otherNode.systemLiterals.length) {
            return false;
        }
        for (let i = 0; i < this.systemLiterals.length; i++) {
            if (this.systemLiterals[i] !== otherNode.systemLiterals[i]) {
                return false;
            }
        }
        return true;
    }
    /**
     * Checks whether a node is identical to another node by comparing tag names, attribute names and values and content.
     * @override
     */
    isIdenticalTo(otherNode) {
        return super.isIdenticalTo(otherNode) && this.isSystemLiteralListIdenticalTo(otherNode);
    }
    /**
     * @override
     */
    stringify(params, nodeIndentDepth) {
        nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
        return `${Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth)}<!${this.tagName}${this.stringifyAttributesAndSystemLiterals(params, nodeIndentDepth)}>${params.newlineChar}`;
    }
    stringifyAttributesAndSystemLiterals(params, nodeIndentDepth) {
        return this.literalAndAttrOrder.map(attrNameOrLiteralIndex => {
            if (typeof attrNameOrLiteralIndex === 'string') {
                return this.stringifyAttribute(attrNameOrLiteralIndex, this.getAttribute(attrNameOrLiteralIndex));
            }
            else {
                return ` "${this.getSystemLiteralAtIndex(attrNameOrLiteralIndex)}"`;
            }
        }).join('');
    }
    appendSystemLiteralIndexToOrderList(literalIndex) {
        this.removeSystemLiteralIndexFromOrderList(literalIndex);
        this.literalAndAttrOrder.push(literalIndex);
    }
    removeSystemLiteralIndexFromOrderList(literalIndex) {
        const index = this.literalAndAttrOrder.indexOf(literalIndex);
        if (index !== -1) {
            this.literalAndAttrOrder.splice(index, 1);
        }
    }
    appendAttributeToOrderList(attrNameWithNamespace) {
        this.removeAttributeFromOrderList(attrNameWithNamespace);
        this.literalAndAttrOrder.push(attrNameWithNamespace);
    }
    removeAttributeFromOrderList(attrNameWithNamespace) {
        const index = this.literalAndAttrOrder.indexOf(attrNameWithNamespace);
        if (index !== -1) {
            this.literalAndAttrOrder.splice(index, 1);
        }
    }
}
exports.DeclarationOpenerNode = DeclarationOpenerNode;

},{"./Node":8}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ContainerNode_1 = require("./ContainerNode");
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

},{"./ContainerNode":5}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeFlags_1 = require("../parser/NodeFlags");
/**
 * Base class for all nodes.
 */
class Node {
    constructor() {
        this.parserFlags = NodeFlags_1.NodeFlags.None;
        this.attrList = {};
        this.applyAttributePropertyBindings();
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
        return Object.keys(this.attrList);
    }
    getNumberOfAttributes() {
        return this.getAllAttributeNames().length;
    }
    hasAttribute(attrName) {
        return this.getAllAttributeNames().indexOf(attrName) !== -1;
    }
    getAttribute(attrName, namespaceName) {
        if (typeof this.attrList !== 'object' || this.attrList === null) {
            return undefined;
        }
        attrName = Node.joinAttributeNameWithNamespacePrefix(attrName, namespaceName);
        return this.attrList[attrName];
    }
    /**
     * @chainable
     */
    setAttribute(attrName, value, namespaceName) {
        attrName = Node.joinAttributeNameWithNamespacePrefix(attrName, namespaceName);
        this.attrList = this.attrList || {};
        this.attrList[attrName] = value;
        return this;
    }
    /**
     * @chainable
     */
    removeAttribute(attrName, namespaceName) {
        attrName = Node.joinAttributeNameWithNamespacePrefix(attrName, namespaceName);
        delete this.attrList[attrName];
        return this;
    }
    toFormattedString(stringificationParams) {
        if (typeof stringificationParams === 'object' && stringificationParams !== null) {
            stringificationParams = Node.mergeObjects(Node.defaultStringificationParams, stringificationParams);
        }
        else {
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
    isTagNameAndNamespaceIdenticalTo(otherNode) {
        return this.namespacePrefix === otherNode.namespacePrefix &&
            this.tagName === otherNode.tagName;
    }
    isAttributeListIdenticalTo(otherNode) {
        if (this.getNumberOfAttributes() !== otherNode.getNumberOfAttributes()) {
            return false;
        }
        const indexOfFirstNonIdenticalAttributeName = this.getAllAttributeNames().findIndex(attrName => {
            return this.getAttribute(attrName) !== otherNode.getAttribute(attrName);
        });
        return indexOfFirstNonIdenticalAttributeName === -1;
    }
    /**
     * Checks whether a node is identical to another node by comparing tag names, attribute names and values.
     */
    isIdenticalTo(otherNode) {
        return this.constructor === otherNode.constructor && this.isTagNameAndNamespaceIdenticalTo(otherNode) && this.isAttributeListIdenticalTo(otherNode);
    }
    /**
     * Decorator.
     */
    static attributePropertyBinding(attributeName) {
        return (target, propertyName) => {
            target.addAttributeProxyProperty(propertyName, attributeName);
        };
    }
    getBoundAttributeNameForProperty(propertyName) {
        if (typeof this.attrPropertyBindings !== 'object' || this.attrPropertyBindings === null) {
            return undefined;
        }
        return this.attrPropertyBindings[propertyName];
    }
    getBoundPropertyNamesForAttribute(attributeName) {
        const propertyNames = [];
        if (typeof this.attrPropertyBindings !== 'object' || this.attrPropertyBindings === null) {
            return propertyNames;
        }
        for (let propertyName in this.attrPropertyBindings) {
            if (this.attrPropertyBindings[propertyName] === attributeName) {
                propertyNames.push(propertyName);
            }
        }
        return propertyNames;
    }
    static joinAttributeNameWithNamespacePrefix(attrName, namespaceName) {
        if (typeof namespaceName !== 'undefined') {
            attrName = namespaceName + ':' + attrName;
        }
        return attrName;
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
        return `${Node.generateIndentString(params.indentChar, nodeIndentDepth)}<${this.tagName}${this.stringifyAttributes(nodeIndentDepth)} />${params.newlineChar}`;
    }
    stringifyAttributes(nodeIndentDepth) {
        var attrString = '';
        for (let attrName in this.attrList) {
            attrString += this.stringifyAttribute(attrName, this.attrList[attrName]);
        }
        return attrString;
    }
    stringifyAttribute(attrName, attrValue) {
        if (typeof attrValue !== 'undefined') {
            return ` ${attrName}="${attrValue}"`;
        }
        else {
            return ` ${attrName}`;
        }
    }
    static mergeObjects(baseObject, overlayObject) {
        for (let key in overlayObject) {
            baseObject[key] = overlayObject[key];
        }
        return baseObject;
    }
    addAttributeProxyProperty(propertyName, attrName) {
        this.attrPropertyBindings = this.attrPropertyBindings || {};
        this.attrPropertyBindings[propertyName] = attrName;
    }
    applyAttributePropertyBindings() {
        if (typeof this.attrPropertyBindings !== 'object' || this.attrPropertyBindings === null) {
            return;
        }
        for (let propertyName in this.attrPropertyBindings) {
            this.applyAttributePropertyBinding(propertyName, this.attrPropertyBindings[propertyName]);
        }
    }
    applyAttributePropertyBinding(propertyName, attributeName) {
        const value = this[propertyName];
        Object.defineProperty(this, propertyName, {
            get: () => this.getAttribute(attributeName),
            set: (newValue) => this.setAttribute(attributeName, newValue)
        });
        this.setAttribute(attributeName, value);
    }
}
exports.Node = Node;

},{"../parser/NodeFlags":15}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = require("./Node");
class ProcessingInstructionNode extends Node_1.Node {
    /** @override */
    stringify(params, nodeIndentDepth) {
        nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
        return `${Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth)}<?${this.tagName}${this.stringifyAttributes(nodeIndentDepth)}?>${params.newlineChar}`;
    }
}
exports.ProcessingInstructionNode = ProcessingInstructionNode;

},{"./Node":8}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = require("./Node");
class SelfClosingNode extends Node_1.Node {
}
exports.SelfClosingNode = SelfClosingNode;

},{"./Node":8}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = require("./Node");
/**
 * Base class for all nodes that may contain child elements.
 */
class TextNode extends Node_1.Node {
    getContentLines() {
        if (typeof this.content !== 'string' || this.content.length < 1) {
            return [];
        }
        return this.content.trim().split(/\r?\n/);
    }
    /**
     * Returns whether the text content contains line breaks.
     */
    isContentMultiLine() {
        return /\r?\n/.test(this.content.trim());
    }
    isContentIdenticalTo(otherNode) {
        return TextNode.makeContentStringComparable(this.content || '') === TextNode.makeContentStringComparable(otherNode.content || '');
    }
    /**
     * Checks whether a node is identical to another node by comparing tag names, attribute names and values and content.
     */
    isIdenticalTo(otherNode) {
        return super.isIdenticalTo(otherNode) && this.isContentIdenticalTo(otherNode);
    }
    static makeContentStringComparable(contentString) {
        return contentString.trim().replace(/[\t\r\n ]+/g, '').replace(/ +/g, ' ');
    }
    stringify(params, nodeIndentDepth) {
        return this.stringifyContent(params, nodeIndentDepth);
    }
    stringifyContent(params, nodeIndentDepth) {
        if (this.isContentMultiLine()) {
            return this.stringifyMultiLineContent(params, nodeIndentDepth);
        }
        else {
            return this.stringifySingleLineContent(params, nodeIndentDepth);
        }
    }
    stringifyMultiLineContent(params, nodeIndentDepth) {
        var stringifiedContent = '';
        var newlineChar = params.newlineChar;
        if (!/\n/.test(params.newlineChar)) {
            newlineChar = ' ';
        }
        stringifiedContent += this.getContentLines().map(contentLine => {
            return Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth) + contentLine.trim();
        }).join(newlineChar);
        if (/\n/.test(params.newlineChar)) {
            return stringifiedContent + params.newlineChar;
        }
        return stringifiedContent;
    }
    stringifySingleLineContent(params, nodeIndentDepth) {
        const formattedContent = (this.content || '').trim().replace(/(\r?\n(\t*))+/g, ' ').trim();
        if (/\n/.test(params.newlineChar)) {
            return Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth) + formattedContent + '\n';
        }
        else {
            return formattedContent;
        }
    }
}
exports.TextNode = TextNode;

},{"./Node":8}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = require("./Node");
class VoidNode extends Node_1.Node {
    /**
     * @override
     */
    stringify(params, nodeIndentDepth) {
        nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
        return `${Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth)}<${this.tagName}${this.stringifyAttributes(nodeIndentDepth)}>${params.newlineChar}`;
    }
}
exports.VoidNode = VoidNode;

},{"./Node":8}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Attribute_1 = require("./Attribute");
exports.Attribute = Attribute_1.Attribute;
const Node_1 = require("./Node");
exports.Node = Node_1.Node;
const SelfClosingNode_1 = require("./SelfClosingNode");
exports.SelfClosingNode = SelfClosingNode_1.SelfClosingNode;
const VoidNode_1 = require("./VoidNode");
exports.VoidNode = VoidNode_1.VoidNode;
const TextNode_1 = require("./TextNode");
exports.TextNode = TextNode_1.TextNode;
const CommentNode_1 = require("./CommentNode");
exports.CommentNode = CommentNode_1.CommentNode;
const CDataSectionNode_1 = require("./CDataSectionNode");
exports.CDataSectionNode = CDataSectionNode_1.CDataSectionNode;
const DeclarationOpenerNode_1 = require("./DeclarationOpenerNode");
exports.DeclarationOpenerNode = DeclarationOpenerNode_1.DeclarationOpenerNode;
const ProcessingInstructionNode_1 = require("./ProcessingInstructionNode");
exports.ProcessingInstructionNode = ProcessingInstructionNode_1.ProcessingInstructionNode;
const ContainerNode_1 = require("./ContainerNode");
exports.ContainerNode = ContainerNode_1.ContainerNode;
const DocumentNode_1 = require("./DocumentNode");
exports.DocumentNode = DocumentNode_1.DocumentNode;

},{"./Attribute":2,"./CDataSectionNode":3,"./CommentNode":4,"./ContainerNode":5,"./DeclarationOpenerNode":6,"./DocumentNode":7,"./Node":8,"./ProcessingInstructionNode":9,"./SelfClosingNode":10,"./TextNode":11,"./VoidNode":12}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast = require("./ast");
exports.ast = ast;
const parser = require("./parser");
exports.parser = parser;
const SyntaxErrorCode_1 = require("./parser/SyntaxErrorCode");
exports.SyntaxErrorCode = SyntaxErrorCode_1.SyntaxErrorCode;
const SyntaxError_1 = require("./parser/SyntaxError");
exports.SyntaxError = SyntaxError_1.SyntaxError;
const Parser_1 = require("./parser/Parser");
exports.Parser = Parser_1.Parser;
const Compiler_1 = require("./Compiler");
exports.Compiler = Compiler_1.Compiler;

},{"./Compiler":1,"./ast":13,"./parser":22,"./parser/Parser":16,"./parser/SyntaxError":17,"./parser/SyntaxErrorCode":18}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Flags applied to nodes during parsing.
 * Bitmask.
 */
var NodeFlags;
(function (NodeFlags) {
    NodeFlags[NodeFlags["None"] = 0] = "None";
    NodeFlags[NodeFlags["Opened"] = 1] = "Opened";
    NodeFlags[NodeFlags["Closed"] = 2] = "Closed";
    NodeFlags[NodeFlags["SelfClosing"] = 7] = "SelfClosing";
    NodeFlags[NodeFlags["Void"] = 15] = "Void";
})(NodeFlags = exports.NodeFlags || (exports.NodeFlags = {}));

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast = require("../ast");
const Node_1 = require("../ast/Node");
const SelfClosingNode_1 = require("../ast/SelfClosingNode");
const DocumentNode_1 = require("../ast/DocumentNode");
const ContainerNode_1 = require("../ast/ContainerNode");
const VoidNode_1 = require("../ast/VoidNode");
const SyntaxErrorCode_1 = require("./SyntaxErrorCode");
const SyntaxError_1 = require("./SyntaxError");
const TagCloseMode_1 = require("./TagCloseMode");
const TagSyntaxRule_1 = require("./TagSyntaxRule");
const SyntaxRuleSet_1 = require("./SyntaxRuleSet");
const NodeFlags_1 = require("./NodeFlags");
/**
 * Parsers create a syntax tree from an XML string.
 * PARSER INTERNALS:
 * Parsers see every character in an XML string as a "token". This means that there is no tokenization stage, but rather
 * just a quick (and lazy) mapping of characters to their line and column number. Even without tokenization, XML is
 * fairly simple to parse due to its non-complex syntax. The absence of a tokenization stage means there are less
 * dependencies, less coupling is necessary, which leads to lower maintenance time. Also, we're saving a few CPU cycles
 * and some memory, although performance is not the primary factor for the decision against a dedicated tokenizer.
 * The public interface provided by the parser class encourages the use of static methods, such as
 * `parseStringToAst(...)`, instead of manually creating and handling parser objects (at least for now).
 * SYNTAX RULES:
 * Parsers can accept some syntax rules, however by default they expect XML (no void tags, unclosed tags are handled as
 * if they were). To override default parsing rules, use the `addTagSyntaxRule(...)` (and similar) methods.
 */
class Parser {
    /**
     * Creates a new parser object. Use the static methods `create*()` or `parse*()` instead of instantiating manually.
     * @param stringToParse The XML string to be parsed.
     */
    constructor(stringToParse) {
        this.stringToParse = stringToParse;
        this.defaultTagSyntaxRule = Parser.createDefaultTagSyntaxRule();
        this.tagSyntaxRules = {};
        this.ast = new DocumentNode_1.DocumentNode();
        this.currentContainerNode = this.getAst();
        this.currentTokenIndex = 0;
    }
    /**
     * Creates a parser object, but does not begin parsing.
     * @param stringToParse The XML string to be parsed.
     */
    static createForXmlString(stringToParse) {
        return new Parser(stringToParse);
    }
    /**
     * Parses an XML string and returns the parser object that parsed the string.
     * @see Parser.parseStringToAst(...)
     * @param stringToParse The XML string to be parsed.
     * @param ruleSet The sytnax rule set to apply to the parser. Optional. The parser falls back to default XML parsing
     *                rules when no other rules are provided.
     */
    static parseString(stringToParse, ruleSet) {
        const parser = Parser.createForXmlString(stringToParse);
        if (ruleSet instanceof SyntaxRuleSet_1.SyntaxRuleSet || SyntaxRuleSet_1.SyntaxRuleSet.isSyntaxRuleSetClass(ruleSet)) {
            parser.applySyntaxRuleSet(ruleSet);
        }
        parser.parseComplete();
        return parser;
    }
    /**
     * Parses an XML string and returns a syntax tree.
     * @see Parser.parseString(...)
     * @param stringToParse The XML string to be parsed.
     * @param ruleSet The sytnax rule set to apply to the parser. Optional. The parser falls back to default XML parsing
     *                rules when no other rules are provided.
     */
    static parseStringToAst(stringToParse, ruleSet) {
        return Parser.parseString(stringToParse, ruleSet).getAst();
    }
    ///
    /// CONFIGURATION METHODS:
    ///
    getDefaultTagSyntaxRule() {
        return this.defaultTagSyntaxRule;
    }
    /**
     * @chainable
     */
    setDefaultTagSyntaxRule(rule) {
        this.defaultTagSyntaxRule = rule;
    }
    getTagSyntaxRuleForTagName(tagName) {
        return this.tagSyntaxRules[tagName] || undefined;
    }
    hasTagSyntaxRuleForTagName(tagName) {
        const rule = this.getTagSyntaxRuleForTagName(tagName);
        return typeof rule === 'object' && rule !== null;
    }
    /**
     * @chainable
     */
    addTagSyntaxRule(rule) {
        rule.getTagNames().forEach(tagName => {
            this.tagSyntaxRules[tagName] = rule;
        });
        return this;
    }
    /**
     * @chainable
     */
    addTagSyntaxRules(...rules) {
        rules.forEach(rule => this.addTagSyntaxRule(rule));
        return this;
    }
    /**
     * @chainable
     */
    removeTagSyntaxRuleForTagName(tagName) {
        this.tagSyntaxRules[tagName] = undefined;
        return this;
    }
    /**
     * @chainable
     */
    removeTagSyntaxRulesForTagNames(tagNames) {
        tagNames.forEach(tagName => this.removeTagSyntaxRuleForTagName(tagName));
        return this;
    }
    /**
     * Applies all rules defined by a syntax rule set to the parser.
     * @chainable
     * @param ruleSet The syntax rule set to apply.
     */
    applySyntaxRuleSet(ruleSet) {
        if (SyntaxRuleSet_1.SyntaxRuleSet.isSyntaxRuleSetClass(ruleSet)) {
            ruleSet = ruleSet.createInstance();
        }
        this.addTagSyntaxRules(...ruleSet.getAllTagSyntaxRules());
        return this;
    }
    ///
    /// PUBLIC GETTERS & REQUESTS:
    ///
    /**
     * Returns the syntax tree object the parser creates.
     */
    getAst() {
        return this.ast;
    }
    /**
     * Parses the complete XML string passed to a parser instance.
     */
    parseComplete() {
        // don't do anything if the source string is empty
        if (this.stringToParse.length < 1) {
            return;
        }
        while (!this.isAtEndOfInput()) {
            this.parseFromCurrentToken();
        }
    }
    ///
    /// INTERNAL GETTERS & REQUESTS:
    ///
    /**
     * Returns the line the parser's cursor is currently on.
     */
    getCurrentLine() {
        const tokenMatrix = this.getTokenMatrix();
        if (tokenMatrix[this.getCurrentTokenIndex()]) {
            return tokenMatrix[this.getCurrentTokenIndex()].line;
        }
        else if (this.getCurrentTokenIndex() === 0) {
            return 1;
        }
        else {
            return undefined;
        }
    }
    /**
     * Returns the column the parser's cursor is currently at.
     */
    getCurrentColumn() {
        const tokenMatrix = this.getTokenMatrix();
        if (tokenMatrix[this.getCurrentTokenIndex()]) {
            return tokenMatrix[this.getCurrentTokenIndex()].column;
        }
        else if (this.getCurrentTokenIndex() === 0) {
            return 1;
        }
        else {
            return undefined;
        }
    }
    /**
     * Returns the index of the current token in the XML source string.
     */
    getCurrentTokenIndex() {
        return this.currentTokenIndex;
    }
    /**
     * Returns whether the parser's cursor has reached the end of the XML source string.
     */
    isAtEndOfInput() {
        return this.getCurrentTokenIndex() >= this.stringToParse.length;
    }
    /**
     * Returns the token at a certain index in the XML source string.
     */
    getTokenAtIndex(index) {
        return this.stringToParse[index];
    }
    /**
     * Return the token at the current cursor index.
     */
    getCurrentToken() {
        return this.getTokenAtIndex(this.getCurrentTokenIndex());
    }
    /**
     * Returns a range of tokens from the source XML string.
     * @param startIndex The index of the first token in the requested range.
     * @param endIndex The index of the last token in the requested range (inclusive).
     */
    getTokenRange(startIndex, endIndex) {
        /// TODO: Prevent this from returning ranges that go "beyond" the end of the source string.
        return this.stringToParse.slice(startIndex, endIndex);
    }
    /**
     * Returns a range of tokens from the source XML string.
     * @param startIndex The index of the first token in the requested range.
     * @param length The length of the range to be returned.
     */
    getTokenRangeStartingAt(startIndex, length) {
        return this.stringToParse.slice(startIndex, startIndex + length);
    }
    /**
     * Returns the token that follows the token the cursor is currently at.
     */
    getNextToken() {
        return this.getTokenAtIndex(this.getCurrentTokenIndex() + 1);
    }
    /**
     * Returns the token that preceeds the token the cursor is currently at.
     */
    getPreviousToken() {
        return this.getTokenAtIndex(this.getCurrentTokenIndex() - 1);
    }
    /**
     * Finds the first occurence of a certain token after in the source XML string after a certain token index and
     * returns the index of the searched token.
     * @param token The token to find.
     * @param startIndex The index at which to start searching.
     */
    findFirstOccurenceOfTokenAfterIndex(token, startIndex) {
        return this.stringToParse.indexOf(token[0], startIndex);
    }
    /**
     * Checks if a certain token occurs before the next occurence of another token.
     * @param token The token to check if it occurs before `otherToken`.
     * @param otherToken The token before which `token` must occur for this method to return `true`.
     * @param startIndex The index at which to start searching for `token` and `otherToken`.
     */
    doesTokenOccurBeforeNextOccurenceOfOtherToken(token, otherToken, startIndex) {
        const tokenIndex = this.findFirstOccurenceOfTokenAfterIndex(token, startIndex);
        const otherTokenIndex = this.findFirstOccurenceOfTokenAfterIndex(otherToken, startIndex);
        if (tokenIndex < 0 || otherTokenIndex < 0) {
            return false;
        }
        return tokenIndex < otherTokenIndex;
    }
    /**
     * Returns the container ast node the parser is currently parsing into, depending on the semantic context around the
     * cursor. At the start and end of each parsing run, this will return the outermost `DocumentNode` of the syntax tree.
     */
    getCurrentContainerNode() {
        return this.currentContainerNode;
    }
    descendInto(containerNode) {
        this.currentContainerNode = containerNode;
    }
    ascend() {
        if (!(this.currentContainerNode.parentNode instanceof ContainerNode_1.ContainerNode)) {
            this.raiseError(this.createSyntaxErrorAtCurrentToken(SyntaxErrorCode_1.SyntaxErrorCode.Unknown, `can not ascend: current containing node has no parent node`));
        }
        this.currentContainerNode = this.currentContainerNode.parentNode;
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
    /**
     * Raises an error. Use this method instead of throwing manually so errors can be logged or modified by the parser
     * before it is thrown.
     * @throws
     * @param error The error to raise.
     */
    raiseError(error) {
        throw error;
    }
    ///
    /// SYNTAX RULE LOOKUPS:
    ///
    static isSingularCloseMode(closeMode) {
        return closeMode in TagCloseMode_1.TagCloseMode;
    }
    static createDefaultTagSyntaxRule() {
        const rule = TagSyntaxRule_1.TagSyntaxRule.createForTagName(undefined);
        rule.setCloseMode(TagCloseMode_1.TagCloseMode.Tag | TagCloseMode_1.TagCloseMode.SelfClose);
        return rule;
    }
    getOverrideOrDefaultTagSyntaxRuleForTagName(tagName) {
        return this.getTagSyntaxRuleForTagName(tagName) || this.getDefaultTagSyntaxRule();
    }
    /**
     * Returns all tag close modes allowed for a certain tag name. The returned modes are either defined by tag syntax
     * rules or fall back to the default if no syntax rule for the given tag name exists.
     */
    getAllowedTagCloseModesForTagName(tagName) {
        return this.getOverrideOrDefaultTagSyntaxRuleForTagName(tagName).getCloseMode();
    }
    isCloseModeAllowedForTagName(tagName, closeMode) {
        if (!Parser.isSingularCloseMode(closeMode)) {
            throw new Error('Rule lookup failed: tag close mode must not be a combination of close modes.');
        }
        return (this.getAllowedTagCloseModesForTagName(tagName) & closeMode) === closeMode;
    }
    ///
    /// TOKEN IDENTIFICATION & CLASSIFICATION UTILITIES:
    /// Methods that help identifying certain tokens.
    ///
    static isAlphabeticToken(token) {
        return /[a-z]/i.test(token[0]);
    }
    static isNumericToken(token) {
        return /[0-9]/i.test(token[0]);
    }
    static isWhitespaceToken(token) {
        token = token[0];
        return token === ' ' || token === '\t' || token === '\r' || token === '\n';
    }
    static isTokenLegalInTagNameOrTagNameNamespacePrefix(token) {
        return Parser.isAlphabeticToken(token) ||
            Parser.isNumericToken(token) ||
            token[0] === '-' ||
            token[0] === '_' ||
            token[0] === '.';
    }
    static isTokenLegalInAttributeNameOrAttributeNameNameNamespacePrefix(token) {
        return Parser.isAlphabeticToken(token) ||
            Parser.isNumericToken(token) ||
            token[0] === '-' ||
            token[0] === '_';
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
     * Called when the parser is at an open angle bracket (`<`) and needs to decide how to parse upcoming tokens.
     * This method looks ahead to decide whether the open angle bracket is the beginning of an XML tag, or if it's the
     * beginning of text node content, so either:
     *     <foo...
     *     ^       here
     * or:
     *     <foo><</foo>
     *          ^ here
     *
     * Keep in mind that this method must *only* be called in these two cases, all other possible occurences of open
     * angle brackets are handled in more specific methods (namely when parsing CDATA or comments), which are not
     * ambiguous (comments and CDATA nodes have delimiters that clearly indicate where their content begins and ends,
     * text nodes do not have this).
     * The same goes for attributes: An open angle bracket in a properly quoted attribute string is always going to be
     * parsed as an attribute value.
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
        //     there's another open angle bracket before the next occurence of a closing angle bracket
        // assume that the current open angle bracket is text node content. In all other cases, assume that the current
        // open angle bracket indicates
        // the bginning of a new tag.
        if (this.getNextToken() !== '!' &&
            this.getNextToken() !== '?' &&
            this.doesTokenOccurBeforeNextOccurenceOfOtherToken('<', '>', this.getCurrentTokenIndex() + 1) &&
            !this.doesTokenOccurBeforeNextOccurenceOfOtherToken('"', '<', this.getCurrentTokenIndex() + 1) &&
            !this.doesTokenOccurBeforeNextOccurenceOfOtherToken('\'', '<', this.getCurrentTokenIndex() + 1)) {
            this.parseIntoNewTextNode();
        }
        else {
            this.parseFromBeginningOfTag();
        }
    }
    /**
     * Creates a new text node, appends it to the ast and parses all upcoming text into it. Stops parsing at the first
     * character that can not be considered text anymore.
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
    /**
     * Parses from the beginning of any kind of tag. The cursor is expected to point at the open angle bracket of the tag,
     * such as:
     *     <xsl:stylesheet ...
     *     ^
     * Comments and CDATA sections are also supported by this method. Depending on the kind of tag (MDO, PI, normal, etc),
     * this method will delegate parsing the tag to other more specific methods.
     */
    parseFromBeginningOfTag() {
        // Find out if we're dealing with a "normal" node here or with a MDO (markup declaration opener), PI (processing
        // instruction) or comment.
        // We will not know whether the node is self closing, or if it has child nodes or text content, but we know just
        // enough to delegate the node to a more dedicated parsing method.
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
            this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken(`expected beginning of tag name, got '${this.getNextToken()}'`));
        }
        // we assume all "normal" nodes to be self closing until proven they're not:
        const node = new SelfClosingNode_1.SelfClosingNode();
        this.getCurrentContainerNode().appendChild(node);
        // Skip over the node opener:
        //     <alpha ...
        //     ^      we're here
        this.advanceToNextToken();
        // check for illegal characters at the beginning of the tag name
        if (this.getCurrentToken() === '.') {
            this.raiseError(this.createSyntaxErrorAtCurrentToken(SyntaxErrorCode_1.SyntaxErrorCode.InvalidTagName, `expected beginning of tag name, got '${this.getCurrentToken()}'`));
        }
        //     <alpha
        //      ^      we're here
        this.parseCompleteOpeningTagInto(node, true, false);
        return;
    }
    findUnclosedNodeMatchingTagName(tagNameInfo) {
        var containerNode = this.getCurrentContainerNode();
        do {
            if (containerNode.parserFlags & NodeFlags_1.NodeFlags.Closed ||
                containerNode.namespacePrefix !== tagNameInfo.namespacePrefix ||
                containerNode.tagName !== tagNameInfo.tagName) {
                continue;
            }
            return containerNode;
        } while ((containerNode = containerNode.parentNode) && containerNode.parentNode instanceof Node_1.Node);
    }
    parseFromBeginningOfCloseTag() {
        // Validate that we actually have a close tag:
        if (this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 2) !== '</') {
            const message = `expected beginning of close tag (</...), got '${this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 2)}'`;
            this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken(message));
        }
        // Skip over the tag opener:
        //     </alpha ...
        //     ^      we're here
        this.advanceByNumberOfTokens(2);
        //     </alpha
        //       ^      we're here
        // we now parse the tag name and check if there are any unclosed container nodes with the exact same tag name
        const tagNameInfo = this.parseTagName();
        const closedNode = this.findUnclosedNodeMatchingTagName(tagNameInfo);
        if (!(closedNode instanceof ContainerNode_1.ContainerNode)) {
            this.raiseError(this.createSyntaxErrorAtCurrentToken(SyntaxErrorCode_1.SyntaxErrorCode.ExcessCloseTag, `close tag '${tagNameInfo.tagName}' has no open tag`));
        }
        if (this.getCurrentToken() !== '>') {
            this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken(`expected end of close tag, got '${this.getCurrentToken()}'`));
        }
        this.advanceToNextToken();
        this.ascend();
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
        // We know this is actually a CDATA section node, so create the tree member and append to its content as long
        // as it isn't closed by ']]>'.
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
        // We know this is actually a comment node, so create the tree member and append to its content as long as the
        // comment node is not closed by `-->`.
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
        this.advanceByNumberOfTokens(3);
        //     <!-- some comment text, maybe with line breaks -->
        //                                                       ^      we're now here
        return;
    }
    static createContainerNodeFromOtherNode(node) {
        const containerNode = new ContainerNode_1.ContainerNode();
        containerNode.namespacePrefix = node.namespacePrefix;
        containerNode.tagName = node.tagName;
        node.getAllAttributeNames().forEach(attrName => containerNode.setAttribute(attrName, node.getAttribute(attrName)));
        return containerNode;
    }
    static createVoidNodeFromOtherNode(node) {
        const voidNode = new VoidNode_1.VoidNode();
        voidNode.namespacePrefix = node.namespacePrefix;
        voidNode.tagName = node.tagName;
        node.getAllAttributeNames().forEach(attrName => voidNode.setAttribute(attrName, node.getAttribute(attrName)));
        return voidNode;
    }
    /**
     * Parses a complete opening tag with namespace prefix, tag name and attributes into a given node. This method will
     * decide whether the node it is parsing is a container node or a void node and upgrade the node passed into it in
     * param `node` to the respective ast node type.
     * The cursor is expected to be pointing at the first token after the tag opener:
     * for "normal" nodes:
     *     <alpha ...
     *      ^
     * for MDOs:
     *     <!DOCTYPE ...
     *       ^
     * for CDATA sections:
     *     <![CDATA[ ...
     *       ^
     * for PIs:
     *     <?svg ...
     *       ^
     * @param node The node to parse namespace prefix, tag name and attributes into.
     * @param allowDescendingIntoNewContainerNode Whether the parser should be allowed to descend if this method
     * discovers that the node it is parsing is a container node.
     * @param allowSystemLiterals Whether system literals should be allowed in the parsed tag.
     */
    parseCompleteOpeningTagInto(node, allowDescendingIntoNewContainerNode, allowSystemLiterals) {
        // we could now be in any of the following constructs:
        //     <alpha ...
        //      ^
        // or:
        //     <!DOCTYPE ...
        //       ^
        // or:
        //     <![CDATA[ ...
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
            // self closing node
            case this.getTokenRangeStartingAt(this.getCurrentTokenIndex(), 2) === '/>':
                // raise an error if the current node is not allowed to self close
                if (!this.isCloseModeAllowedForTagName(node.tagName, TagCloseMode_1.TagCloseMode.SelfClose)) {
                    this.raiseError(this.createSyntaxErrorAtCurrentToken(SyntaxErrorCode_1.SyntaxErrorCode.IllegalSelfClose, `tag '${node.tagName}' must not self-close`));
                }
                node.parserFlags |= NodeFlags_1.NodeFlags.SelfClosing;
                this.advanceByNumberOfTokens(2);
                return;
            // processing instruction
            case this.getCurrentToken() === '?':
                this.advanceToNextToken();
            // ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓   FALL THROUGH   ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
            // container node
            case this.getCurrentToken() === '>':
                this.parseEndOfNonSelfClosingOpeningTag(node, allowDescendingIntoNewContainerNode);
                this.advanceToNextToken();
                break;
        }
    }
    /**
     * Parses the end of opening tags that are not self closing. This method will decide whether the node it is parsing
     * is a container node or a void node and upgrade the node passed into it in param `node` to the respective ast node
     * type.
     * @param node The node to parse namespace prefix, tag name and attributes into.
     * @param allowDescendingIntoNewContainerNode Whether the parser should be allowed to descend if this method discovers
     *                                            that the node it is parsing is a container node.
     */
    parseEndOfNonSelfClosingOpeningTag(node, allowDescendingIntoNewContainerNode) {
        if (!(node instanceof SelfClosingNode_1.SelfClosingNode)) {
            return;
        }
        if (this.isCloseModeAllowedForTagName(node.tagName, TagCloseMode_1.TagCloseMode.Void)) {
            const voidNode = Parser.createVoidNodeFromOtherNode(node);
            node.parentNode.replaceChild(node, voidNode);
            node = voidNode;
            node.parserFlags |= NodeFlags_1.NodeFlags.Void;
        }
        else {
            const containerNode = Parser.createContainerNodeFromOtherNode(node);
            node.parentNode.replaceChild(node, containerNode);
            node.parserFlags |= NodeFlags_1.NodeFlags.Opened;
            if (allowDescendingIntoNewContainerNode) {
                this.descendInto(containerNode);
            }
        }
    }
    parseTagName() {
        // this will be set to `true` as soon as the first colon was seen
        var colonSeen = false;
        var nameStash = '';
        var tagNameInfo = {
            namespacePrefix: undefined,
            tagName: undefined
        };
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
                tagNameInfo.namespacePrefix = nameStash;
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
        tagNameInfo.tagName = nameStash;
        return tagNameInfo;
    }
    /**
     * Parses a tag name into an AST node. Supports namespace prefixes.
     * @param node The AST node to parse the tag name into.
     */
    parseTagNameInto(node) {
        const tagNameInfo = this.parseTagName();
        node.namespacePrefix = tagNameInfo.namespacePrefix;
        node.tagName = tagNameInfo.tagName;
    }
    /**
     * Parses a complete attribute list into a node.
     * @param node The node to parse the attribute list into.
     * @param allowLiterals Whether literals are allowed or not. When this is `false`, the method will raise a syntax
     *                      error if a literal is encountered.
     */
    parseAttributeListInto(node, allowLiterals) {
        // We are now at the first token after the opening tag name, which could be either whitespace, the end of the
        // opening tag or the start of a system literal:
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
            if (!allowLiterals && this.getCurrentToken() === '"') {
                this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken('expected whitespace or end of opening tag'));
            }
        }
        // skip all whitespace
        while (Parser.isWhitespaceToken(this.getCurrentToken())) {
            this.advanceToNextToken();
        }
        // if there's no alphabetic token here, there are no attributes to be parsed
        if (!Parser.isAlphabeticToken(this.getCurrentToken()) && (!allowLiterals && this.getCurrentToken() !== '"')) {
            return;
        }
        // advance until there are no attributes and literals to be parsed
        while (this.getCurrentToken() !== '>' && this.getCurrentToken() !== '/' && this.getCurrentToken() !== '?') {
            if (this.getCurrentToken() === '"') {
                if (!allowLiterals) {
                    this.raiseError(this.createUnexpectedTokenSyntaxErrorAtCurrentToken('system literal not allowed on this node'));
                }
                node.appendToSystemLiteralList(this.parseLiteral());
            }
            else {
                let attrInfo = this.parseAttribute();
                /// TODO:
                /// Empty attribute names should never happen (see issue #7). Find out why this happens, fix it, then
                /// remove the `continue` workaround below.
                if (attrInfo.name === '') {
                    continue;
                }
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
            if (this.getCurrentToken() === valueQuoteCharacter) {
                break;
            }
            value += this.getCurrentToken();
        }
        this.advanceToNextToken();
        return value;
    }
    parseAttribute() {
        var name = '';
        var value;
        var valueQuoteCharacter;
        var colonSeen = false;
        const getAttrInfo = () => ({ name, value });
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
            }
            else {
                return getAttrInfo();
            }
        }
        value = '';
        while (!this.isAtEndOfInput()) {
            this.advanceToNextToken();
            if (this.getCurrentToken() === valueQuoteCharacter) {
                this.advanceToNextToken();
                break;
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
        var line = 1;
        var column = 0;
        this.tokenMatrix = new Array(this.stringToParse.length);
        for (let i = 0; i < this.stringToParse.length; i++) {
            column += 1;
            const currentToken = this.stringToParse[i];
            this.tokenMatrix[i] = { line, column };
            if (currentToken === '\n') {
                line += 1;
                column = 0;
            }
        }
    }
}
exports.Parser = Parser;

},{"../ast":13,"../ast/ContainerNode":5,"../ast/DocumentNode":7,"../ast/Node":8,"../ast/SelfClosingNode":10,"../ast/VoidNode":12,"./NodeFlags":15,"./SyntaxError":17,"./SyntaxErrorCode":18,"./SyntaxRuleSet":19,"./TagCloseMode":20,"./TagSyntaxRule":21}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SyntaxErrorCode_1 = require("./SyntaxErrorCode");
class SyntaxError extends Error {
    constructor(errorCode, line, column, source, message) {
        super(message);
        this.errorCode = errorCode;
        this.line = line;
        this.column = column;
        this.source = source;
        this.source = this.source || '';
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
        return `syntax error [${this.getErrorCode()} ${this.getErrorName()}] at token '${this.getTokenAt(this.line, this.column)}' ${this.getLine()}, ${this.getColumn()}: ${this.getMessage()}`;
    }
    getTokenAt(line, column) {
        const sourceLine = this.source.split(/\n/)[line - 1];
        if (typeof sourceLine !== 'string') {
            return '';
        }
        return sourceLine.split('')[column - 1];
    }
}
exports.SyntaxError = SyntaxError;

},{"./SyntaxErrorCode":18}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SyntaxErrorCode;
(function (SyntaxErrorCode) {
    SyntaxErrorCode[SyntaxErrorCode["Unknown"] = 0] = "Unknown";
    SyntaxErrorCode[SyntaxErrorCode["UnexpectedToken"] = 1] = "UnexpectedToken";
    SyntaxErrorCode[SyntaxErrorCode["MissingTagNameAfterNamespacePrefix"] = 2] = "MissingTagNameAfterNamespacePrefix";
    SyntaxErrorCode[SyntaxErrorCode["MissingAttrNameAfterAttrPrefix"] = 3] = "MissingAttrNameAfterAttrPrefix";
    SyntaxErrorCode[SyntaxErrorCode["IllegalNamespacePrefix"] = 4] = "IllegalNamespacePrefix";
    SyntaxErrorCode[SyntaxErrorCode["IllegalSelfClose"] = 5] = "IllegalSelfClose";
    SyntaxErrorCode[SyntaxErrorCode["ExcessCloseTag"] = 6] = "ExcessCloseTag";
    SyntaxErrorCode[SyntaxErrorCode["InvalidTagName"] = 7] = "InvalidTagName";
})(SyntaxErrorCode = exports.SyntaxErrorCode || (exports.SyntaxErrorCode = {}));

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SyntaxRuleSet {
    constructor() {
        this.tagSyntaxRules = [];
    }
    /**
     * Creates an instance of the syntax rule set class this static method is called on.
     */
    static createInstance() {
        return new this();
    }
    static isSyntaxRuleSetClass(candidate) {
        return (typeof candidate === 'function' && candidate._syntaxRuleSetBrand_ === SyntaxRuleSet._syntaxRuleSetBrand_);
    }
    hasTagSyntaxRule(rule) {
        return this.tagSyntaxRules.indexOf(rule) !== -1;
    }
    getAllTagSyntaxRules() {
        return [].concat(this.tagSyntaxRules);
    }
    /**
     * @chainable
     */
    addTagSyntaxRule(rule) {
        if (!this.hasTagSyntaxRule(rule)) {
            this.tagSyntaxRules.push(rule);
        }
        return this;
    }
    /**
     * @chainable
     */
    addTagSyntaxRules(...rules) {
        rules.forEach(rule => this.addTagSyntaxRule(rule));
        return this;
    }
}
SyntaxRuleSet._syntaxRuleSetBrand_ = Math.random();
exports.SyntaxRuleSet = SyntaxRuleSet;

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Enumerates all tag closing modes. Bitmap.
 */
var TagCloseMode;
(function (TagCloseMode) {
    /**
     * Indicates that a tag can be closed by a close tag, such as `<div></div>`.
     */
    TagCloseMode[TagCloseMode["Tag"] = 1] = "Tag";
    /**
     * Indicates that a tag can self-close, such as `<br />`.
     */
    TagCloseMode[TagCloseMode["SelfClose"] = 2] = "SelfClose";
    /**
     * Indicates that a tag does not need to close, such as `<meta>`.
     */
    TagCloseMode[TagCloseMode["Void"] = 4] = "Void";
})(TagCloseMode = exports.TagCloseMode || (exports.TagCloseMode = {}));

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Defines all possible permissions and restrictions for one or more tags.
 */
class TagSyntaxRule {
    /**
     * Creates a new tag syntax rule object. **Use static method `createForTagName` instead.**
     */
    constructor(tagNames) {
        this.tagNames = tagNames;
    }
    /**
     * Creates a new syntax rule for a certain tag name.
     * @param tagName The tag name to create the syntax rule for.
     */
    static createForTagName(tagName) {
        return new TagSyntaxRule([tagName]);
    }
    /**
     * Creates a new syntax rule for one or more tag names.
     * @param tagName The tag name to create the syntax rule for.
     */
    static createForTagNames(...tagNames) {
        return new TagSyntaxRule(
        // make sure there are no duplicate tag names
        /// TODO: Check whether this is fast enough on large tag name lists.
        tagNames.filter((tagName, index, array) => array.indexOf(tagName) === index));
    }
    /**
     * Returns all tag names a rule applies to.
     */
    getTagNames() {
        return [].concat(this.tagNames);
    }
    /**
     * Checks whether a rule applies to a certain tag name. This method is case sensitive.
     * @param tagName The tag name to check.
     */
    appliesToTagName(tagName) {
        return this.tagNames.indexOf(tagName) !== -1;
    }
    /**
     * Returns a rule's current close mode or close modes.
     */
    getCloseMode() {
        return this.closeMode;
    }
    /**
     * Sets the rule's allowed tag close modes. This can be a single mode or a combination of modes.
     * @example
     *     rule.setCloseMode(TagCloseMode.SelfClose);
     *     rule.setCloseMode(TagCloseMode.SelfClose | TagCloseMode.Void);
     * @chainable
     * @param mode The close mode to set.
     */
    setCloseMode(mode) {
        this.closeMode = mode;
        return this;
    }
}
exports.TagSyntaxRule = TagSyntaxRule;

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SyntaxErrorCode_1 = require("./SyntaxErrorCode");
exports.SyntaxErrorCode = SyntaxErrorCode_1.SyntaxErrorCode;
const SyntaxError_1 = require("./SyntaxError");
exports.SyntaxError = SyntaxError_1.SyntaxError;
const TagCloseMode_1 = require("./TagCloseMode");
exports.TagCloseMode = TagCloseMode_1.TagCloseMode;
const TagSyntaxRule_1 = require("./TagSyntaxRule");
exports.TagSyntaxRule = TagSyntaxRule_1.TagSyntaxRule;
const SyntaxRuleSet_1 = require("./SyntaxRuleSet");
exports.SyntaxRuleSet = SyntaxRuleSet_1.SyntaxRuleSet;
const NodeFlags_1 = require("./NodeFlags");
exports.NodeFlags = NodeFlags_1.NodeFlags;
const Parser_1 = require("./Parser");
exports.Parser = Parser_1.Parser;
const ruleSet = require("./ruleSet");
exports.ruleSet = ruleSet;

},{"./NodeFlags":15,"./Parser":16,"./SyntaxError":17,"./SyntaxErrorCode":18,"./SyntaxRuleSet":19,"./TagCloseMode":20,"./TagSyntaxRule":21,"./ruleSet":23}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Html5_1 = require("./ruleSet/Html5");
exports.Html5 = Html5_1.Html5;

},{"./ruleSet/Html5":24}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TagCloseMode_1 = require("../TagCloseMode");
const TagSyntaxRule_1 = require("../TagSyntaxRule");
const SyntaxRuleSet_1 = require("../SyntaxRuleSet");
class Html5 extends SyntaxRuleSet_1.SyntaxRuleSet {
    static get Loose() {
        return class Html5Loose extends Html5 {
            constructor() {
                super(true);
            }
        };
    }
    static get Strict() {
        return class Html5Strict extends Html5 {
            constructor() {
                super(false);
            }
        };
    }
    constructor(allowVoidElementsToSelfClose) {
        super();
        if (typeof allowVoidElementsToSelfClose === 'undefined') {
            allowVoidElementsToSelfClose = true;
        }
        // see https://www.w3.org/TR/html-markup/syntax.html#syntax-elements
        const voidTagSyntaxRule = TagSyntaxRule_1.TagSyntaxRule.createForTagNames('area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr');
        if (allowVoidElementsToSelfClose) {
            voidTagSyntaxRule.setCloseMode(TagCloseMode_1.TagCloseMode.Void | TagCloseMode_1.TagCloseMode.SelfClose);
        }
        else {
            voidTagSyntaxRule.setCloseMode(TagCloseMode_1.TagCloseMode.Void);
        }
        this.addTagSyntaxRule(voidTagSyntaxRule);
    }
}
exports.Html5 = Html5;

},{"../SyntaxRuleSet":19,"../TagCloseMode":20,"../TagSyntaxRule":21}]},{},[14]);
