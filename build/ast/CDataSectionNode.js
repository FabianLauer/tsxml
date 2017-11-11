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
var CDataSectionNode = /** @class */ (function (_super) {
    __extends(CDataSectionNode, _super);
    function CDataSectionNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @override
     */
    CDataSectionNode.prototype.stringify = function (params, nodeIndentDepth) {
        return CDataSectionNode.generateIndentString(params.indentChar, nodeIndentDepth) + "<![CDATA[" + this.stringifyContent(params, nodeIndentDepth) + "]]>" + params.newlineChar;
    };
    /**
     * @override
     */
    CDataSectionNode.prototype.stringifyMultiLineContent = function (params, nodeIndentDepth) {
        if (/\n/.test(params.newlineChar)) {
            return '\n' + _super.prototype.stringifyMultiLineContent.call(this, params, nodeIndentDepth) + CDataSectionNode.generateIndentString(params.indentChar, nodeIndentDepth);
        }
        else {
            return _super.prototype.stringifyMultiLineContent.call(this, params, nodeIndentDepth);
        }
    };
    /**
     * @override
     */
    CDataSectionNode.prototype.stringifySingleLineContent = function (params, nodeIndentDepth) {
        return (this.content || '').replace(/(\r?\n(\t*))+/g, ' ');
    };
    return CDataSectionNode;
}(TextNode_1.TextNode));
exports.CDataSectionNode = CDataSectionNode;
