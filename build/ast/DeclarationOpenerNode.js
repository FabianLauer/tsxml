"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Node_1 = require("./Node");
var DeclarationOpenerNode = /** @class */ (function (_super) {
    __extends(DeclarationOpenerNode, _super);
    function DeclarationOpenerNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.systemLiterals = [];
        _this.literalAndAttrOrder = [];
        return _this;
    }
    DeclarationOpenerNode.prototype.getNumberOfSystemLiterals = function () {
        return this.systemLiterals.length;
    };
    DeclarationOpenerNode.prototype.getIndexOfSystemLiteral = function (literal) {
        return this.systemLiterals.indexOf(literal);
    };
    DeclarationOpenerNode.prototype.getSystemLiteralAtIndex = function (literalIndex) {
        return this.systemLiterals[literalIndex];
    };
    DeclarationOpenerNode.prototype.getAllSystemLiterals = function () {
        return [].concat(this.systemLiterals);
    };
    DeclarationOpenerNode.prototype.hasSystemLiteral = function (literal) {
        return this.getIndexOfSystemLiteral(literal) !== -1;
    };
    /**
     * @chainable
     */
    DeclarationOpenerNode.prototype.insertIntoSystemLiteralList = function (literal, index) {
        this.appendSystemLiteralIndexToOrderList(index);
        this.systemLiterals.splice(index, 0, literal);
        return this;
    };
    /**
     * @chainable
     */
    DeclarationOpenerNode.prototype.prependToSystemLiteralList = function (literal) {
        this.insertIntoSystemLiteralList(literal, 0);
        return this;
    };
    /**
     * @chainable
     */
    DeclarationOpenerNode.prototype.appendToSystemLiteralList = function (literal) {
        this.insertIntoSystemLiteralList(literal, this.getNumberOfSystemLiterals());
        return this;
    };
    /**
     * @chainable
     */
    DeclarationOpenerNode.prototype.removeSystemLiteralAtIndex = function (index) {
        this.removeSystemLiteralIndexFromOrderList(index);
        this.systemLiterals.splice(index, 1);
        return this;
    };
    /**
     * @chainable
     */
    DeclarationOpenerNode.prototype.removeSystemLiteral = function (literal) {
        var index = this.getIndexOfSystemLiteral(literal);
        while (index !== -1) {
            this.systemLiterals.splice(index, 1);
            index = this.getIndexOfSystemLiteral(literal);
        }
        return this;
    };
    /**
     * @chainable
     * @override
     */
    DeclarationOpenerNode.prototype.setAttribute = function (attrName, value, namespaceName) {
        this.appendAttributeToOrderList(Node_1.Node.joinAttributeNameWithNamespacePrefix(attrName, namespaceName));
        _super.prototype.setAttribute.call(this, attrName, value, namespaceName);
        return this;
    };
    /**
     * @chainable
     * @override
     */
    DeclarationOpenerNode.prototype.removeAttribute = function (attrName, namespaceName) {
        this.removeAttributeFromOrderList(Node_1.Node.joinAttributeNameWithNamespacePrefix(attrName, namespaceName));
        _super.prototype.removeAttribute.call(this, attrName, namespaceName);
        return this;
    };
    DeclarationOpenerNode.prototype.isSystemLiteralListIdenticalTo = function (otherNode) {
        if (this.systemLiterals.length !== otherNode.systemLiterals.length) {
            return false;
        }
        for (var i = 0; i < this.systemLiterals.length; i++) {
            if (this.systemLiterals[i] !== otherNode.systemLiterals[i]) {
                return false;
            }
        }
        return true;
    };
    /**
     * Checks whether a node is identical to another node by comparing tag names, attribute names and values and content.
     * @override
     */
    DeclarationOpenerNode.prototype.isIdenticalTo = function (otherNode) {
        return _super.prototype.isIdenticalTo.call(this, otherNode) && this.isSystemLiteralListIdenticalTo(otherNode);
    };
    /**
     * @override
     */
    DeclarationOpenerNode.prototype.stringify = function (params, nodeIndentDepth) {
        nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
        return Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth) + "<!" + this.tagName + this.stringifyAttributesAndSystemLiterals(params, nodeIndentDepth) + ">" + params.newlineChar;
    };
    DeclarationOpenerNode.prototype.stringifyAttributesAndSystemLiterals = function (params, nodeIndentDepth) {
        var _this = this;
        return this.literalAndAttrOrder.map(function (attrNameOrLiteralIndex) {
            if (typeof attrNameOrLiteralIndex === 'string') {
                return _this.stringifyAttribute(attrNameOrLiteralIndex, _this.getAttribute(attrNameOrLiteralIndex));
            }
            else {
                return " \"" + _this.getSystemLiteralAtIndex(attrNameOrLiteralIndex) + "\"";
            }
        }).join('');
    };
    DeclarationOpenerNode.prototype.appendSystemLiteralIndexToOrderList = function (literalIndex) {
        this.removeSystemLiteralIndexFromOrderList(literalIndex);
        this.literalAndAttrOrder.push(literalIndex);
    };
    DeclarationOpenerNode.prototype.removeSystemLiteralIndexFromOrderList = function (literalIndex) {
        var index = this.literalAndAttrOrder.indexOf(literalIndex);
        if (index !== -1) {
            this.literalAndAttrOrder.splice(index, 1);
        }
    };
    DeclarationOpenerNode.prototype.appendAttributeToOrderList = function (attrNameWithNamespace) {
        this.removeAttributeFromOrderList(attrNameWithNamespace);
        this.literalAndAttrOrder.push(attrNameWithNamespace);
    };
    DeclarationOpenerNode.prototype.removeAttributeFromOrderList = function (attrNameWithNamespace) {
        var index = this.literalAndAttrOrder.indexOf(attrNameWithNamespace);
        if (index !== -1) {
            this.literalAndAttrOrder.splice(index, 1);
        }
    };
    return DeclarationOpenerNode;
}(Node_1.Node));
exports.DeclarationOpenerNode = DeclarationOpenerNode;
