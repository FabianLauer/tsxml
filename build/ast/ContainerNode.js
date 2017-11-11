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
var ContainerNode = /** @class */ (function (_super) {
    __extends(ContainerNode, _super);
    function ContainerNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.childNodes = [];
        return _this;
    }
    ContainerNode.prototype.getNumberOfChildren = function () {
        return this.childNodes.length;
    };
    ContainerNode.prototype.getChildAtIndex = function (index) {
        return this.childNodes[index];
    };
    ContainerNode.prototype.getIndexOfChild = function (child) {
        return this.childNodes.indexOf(child);
    };
    ContainerNode.prototype.hasChild = function (child) {
        return this.getIndexOfChild(child) !== -1;
    };
    /**
     * @chainable
     */
    ContainerNode.prototype.insertChildAt = function (child, index) {
        Node_1.Node.changeParentNode(child, this);
        this.childNodes.splice(index, 0, child);
        return this;
    };
    /**
     * @chainable
     */
    ContainerNode.prototype.removeChildAt = function (index) {
        var removedNode = this.childNodes.splice(index, 1)[0];
        Node_1.Node.removeParentNode(removedNode);
        return this;
    };
    /**
     * @chainable
     */
    ContainerNode.prototype.insertChildBefore = function (child, referenceChild) {
        if (!this.hasChild(referenceChild)) {
            throw new Error('Can not insert child: reference child not found.');
        }
        this.insertChildAt(child, this.getIndexOfChild(referenceChild));
        return this;
    };
    /**
     * @chainable
     */
    ContainerNode.prototype.insertChildAfter = function (child, referenceChild) {
        if (!this.hasChild(referenceChild)) {
            throw new Error('Can not insert child: reference child not found.');
        }
        this.insertChildAt(child, this.getIndexOfChild(referenceChild) + 1);
        return this;
    };
    /**
     * @chainable
     */
    ContainerNode.prototype.prependChild = function (child) {
        this.insertChildAt(child, 0);
        return this;
    };
    /**
     * @chainable
     */
    ContainerNode.prototype.appendChild = function (child) {
        this.insertChildAt(child, this.getNumberOfChildren());
        return this;
    };
    /**
     * @chainable
     */
    ContainerNode.prototype.replaceChild = function (oldChild, newChild) {
        var index = this.getIndexOfChild(oldChild);
        this.removeChildAt(index);
        this.insertChildAt(newChild, index);
        return this;
    };
    ContainerNode.prototype.forEachChildNode = function (fn) {
        this.childNodes.forEach(function (childNode, index) { return fn(childNode, index); });
    };
    ContainerNode.prototype.isSubtreeIdenticalTo = function (otherNode) {
        if (this.getNumberOfChildren() !== otherNode.getNumberOfChildren()) {
            return false;
        }
        for (var i = 0; i < this.getNumberOfChildren(); i++) {
            if (!this.getChildAtIndex(i).isIdenticalTo(otherNode.getChildAtIndex(i))) {
                return false;
            }
        }
        return true;
    };
    /**
     * Checks whether a node is identical to another node by comparing tag names, attribute names and values and subtree.
     */
    ContainerNode.prototype.isIdenticalTo = function (otherNode) {
        return _super.prototype.isIdenticalTo.call(this, otherNode) && this.isSubtreeIdenticalTo(otherNode);
    };
    /**
     * @override
     */
    ContainerNode.prototype.stringify = function (params, nodeIndentDepth) {
        nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
        return Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth) + "<" + this.tagName + this.stringifyAttributes(nodeIndentDepth) + ">" + this.stringifyAllChildNodes(params, nodeIndentDepth) + Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth) + "</" + this.tagName + ">" + params.newlineChar;
    };
    ContainerNode.prototype.stringifyAllChildNodes = function (params, nodeIndentDepth) {
        var _this = this;
        var xml = params.newlineChar;
        this.forEachChildNode(function (childNode) {
            xml += _this.stringifyChildNode(childNode, params, nodeIndentDepth + 1);
        });
        return xml;
    };
    ContainerNode.prototype.stringifyChildNode = function (childNode, params, nodeIndentDepth) {
        return childNode.stringify(params, nodeIndentDepth);
    };
    return ContainerNode;
}(Node_1.Node));
exports.ContainerNode = ContainerNode;
