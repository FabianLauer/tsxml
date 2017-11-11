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
var ProcessingInstructionNode = /** @class */ (function (_super) {
    __extends(ProcessingInstructionNode, _super);
    function ProcessingInstructionNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** @override */
    ProcessingInstructionNode.prototype.stringify = function (params, nodeIndentDepth) {
        nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
        return Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth) + "<?" + this.tagName + this.stringifyAttributes(nodeIndentDepth) + "?>" + params.newlineChar;
    };
    return ProcessingInstructionNode;
}(Node_1.Node));
exports.ProcessingInstructionNode = ProcessingInstructionNode;
