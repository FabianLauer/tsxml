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
var ContainerNode_1 = require("./ContainerNode");
var DocumentNode = /** @class */ (function (_super) {
    __extends(DocumentNode, _super);
    function DocumentNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @override
     */
    DocumentNode.prototype.stringify = function (params, nodeIndentDepth) {
        nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
        return this.stringifyAllChildNodes(params, nodeIndentDepth);
    };
    DocumentNode.prototype.stringifyAllChildNodes = function (params, nodeIndentDepth) {
        var _this = this;
        var xml = '';
        this.forEachChildNode(function (childNode) {
            xml += _this.stringifyChildNode(childNode, params, nodeIndentDepth);
        });
        return xml;
    };
    return DocumentNode;
}(ContainerNode_1.ContainerNode));
exports.DocumentNode = DocumentNode;
