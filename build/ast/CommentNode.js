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
var TextNode_1 = require("./TextNode");
var CommentNode = /** @class */ (function (_super) {
    __extends(CommentNode, _super);
    function CommentNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @override
     */
    CommentNode.prototype.stringify = function (params, nodeIndentDepth) {
        return CommentNode.generateIndentString(params.indentChar, nodeIndentDepth) + "<!--" + this.stringifyContent(params, nodeIndentDepth) + "-->" + params.newlineChar;
    };
    /**
     * @override
     */
    CommentNode.prototype.stringifyMultiLineContent = function (params, nodeIndentDepth) {
        if (/\n/.test(params.newlineChar)) {
            return '\n' + _super.prototype.stringifyMultiLineContent.call(this, params, nodeIndentDepth) + CommentNode.generateIndentString(params.indentChar, nodeIndentDepth);
        }
        else {
            return ' ' + _super.prototype.stringifyMultiLineContent.call(this, params, nodeIndentDepth) + ' ';
        }
    };
    /**
     * @override
     */
    CommentNode.prototype.stringifySingleLineContent = function (params, nodeIndentDepth) {
        return ' ' + (this.content || '').trim().replace(/(\r?\n(\t*))+/g, ' ').trim() + ' ';
    };
    return CommentNode;
}(TextNode_1.TextNode));
exports.CommentNode = CommentNode;
