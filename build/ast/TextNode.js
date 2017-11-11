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
/**
 * Base class for all nodes that may contain child elements.
 */
var TextNode = /** @class */ (function (_super) {
    __extends(TextNode, _super);
    function TextNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextNode.prototype.getContentLines = function () {
        if (typeof this.content !== 'string' || this.content.length < 1) {
            return [];
        }
        return this.content.trim().split(/\r?\n/);
    };
    /**
     * Returns whether the text content contains line breaks.
     */
    TextNode.prototype.isContentMultiLine = function () {
        return /\r?\n/.test(this.content.trim());
    };
    TextNode.prototype.isContentIdenticalTo = function (otherNode) {
        return TextNode.makeContentStringComparable(this.content || '') === TextNode.makeContentStringComparable(otherNode.content || '');
    };
    /**
     * Checks whether a node is identical to another node by comparing tag names, attribute names and values and content.
     */
    TextNode.prototype.isIdenticalTo = function (otherNode) {
        return _super.prototype.isIdenticalTo.call(this, otherNode) && this.isContentIdenticalTo(otherNode);
    };
    TextNode.makeContentStringComparable = function (contentString) {
        return contentString.trim().replace(/[\t\r\n ]+/g, '').replace(/ +/g, ' ');
    };
    TextNode.prototype.stringify = function (params, nodeIndentDepth) {
        return this.stringifyContent(params, nodeIndentDepth);
    };
    TextNode.prototype.stringifyContent = function (params, nodeIndentDepth) {
        if (this.isContentMultiLine()) {
            return this.stringifyMultiLineContent(params, nodeIndentDepth);
        }
        else {
            return this.stringifySingleLineContent(params, nodeIndentDepth);
        }
    };
    TextNode.prototype.stringifyMultiLineContent = function (params, nodeIndentDepth) {
        var stringifiedContent = '';
        var newlineChar = params.newlineChar;
        if (!/\n/.test(params.newlineChar)) {
            newlineChar = ' ';
        }
        stringifiedContent += this.getContentLines().map(function (contentLine) {
            return Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth) + contentLine.trim();
        }).join(newlineChar);
        if (/\n/.test(params.newlineChar)) {
            return stringifiedContent + params.newlineChar;
        }
        return stringifiedContent;
    };
    TextNode.prototype.stringifySingleLineContent = function (params, nodeIndentDepth) {
        var formattedContent = (this.content || '').trim().replace(/(\r?\n(\t*))+/g, ' ').trim();
        if (/\n/.test(params.newlineChar)) {
            return Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth) + formattedContent + '\n';
        }
        else {
            return formattedContent;
        }
    };
    return TextNode;
}(Node_1.Node));
exports.TextNode = TextNode;
