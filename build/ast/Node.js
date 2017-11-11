"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NodeFlags_1 = require("../parser/NodeFlags");
/**
 * Base class for all nodes.
 */
var Node = /** @class */ (function () {
    function Node() {
        this.parserFlags = NodeFlags_1.NodeFlags.None;
        this.attrList = {};
        this.applyAttributePropertyBindings();
    }
    Object.defineProperty(Node, "defaultStringificationParams", {
        /**
         * The default formatting options for stringification.
         */
        get: function () {
            return {
                attrParen: '"',
                indentChar: '\t',
                newlineChar: '\n'
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "parentNode", {
        get: function () {
            return this._parentNode;
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.getAllAttributeNames = function () {
        return Object.keys(this.attrList);
    };
    Node.prototype.getNumberOfAttributes = function () {
        return this.getAllAttributeNames().length;
    };
    Node.prototype.hasAttribute = function (attrName) {
        return this.getAllAttributeNames().indexOf(attrName) !== -1;
    };
    Node.prototype.getAttribute = function (attrName, namespaceName) {
        if (typeof this.attrList !== 'object' || this.attrList === null) {
            return undefined;
        }
        attrName = Node.joinAttributeNameWithNamespacePrefix(attrName, namespaceName);
        return this.attrList[attrName];
    };
    /**
     * @chainable
     */
    Node.prototype.setAttribute = function (attrName, value, namespaceName) {
        attrName = Node.joinAttributeNameWithNamespacePrefix(attrName, namespaceName);
        this.attrList = this.attrList || {};
        this.attrList[attrName] = value;
        return this;
    };
    /**
     * @chainable
     */
    Node.prototype.removeAttribute = function (attrName, namespaceName) {
        attrName = Node.joinAttributeNameWithNamespacePrefix(attrName, namespaceName);
        delete this.attrList[attrName];
        return this;
    };
    Node.prototype.toFormattedString = function (stringificationParams) {
        if (typeof stringificationParams === 'object' && stringificationParams !== null) {
            stringificationParams = Node.mergeObjects(Node.defaultStringificationParams, stringificationParams);
        }
        else {
            stringificationParams = Node.defaultStringificationParams;
        }
        return this.stringify(stringificationParams);
    };
    Node.prototype.toString = function () {
        return this.stringify({
            indentChar: '',
            newlineChar: '',
            attrParen: '"'
        });
    };
    Node.prototype.isTagNameAndNamespaceIdenticalTo = function (otherNode) {
        return this.namespacePrefix === otherNode.namespacePrefix &&
            this.tagName === otherNode.tagName;
    };
    Node.prototype.isAttributeListIdenticalTo = function (otherNode) {
        var _this = this;
        if (this.getNumberOfAttributes() !== otherNode.getNumberOfAttributes()) {
            return false;
        }
        var indexOfFirstNonIdenticalAttributeName = this.getAllAttributeNames().findIndex(function (attrName) {
            return _this.getAttribute(attrName) !== otherNode.getAttribute(attrName);
        });
        return indexOfFirstNonIdenticalAttributeName === -1;
    };
    /**
     * Checks whether a node is identical to another node by comparing tag names, attribute names and values.
     */
    Node.prototype.isIdenticalTo = function (otherNode) {
        return this.constructor === otherNode.constructor && this.isTagNameAndNamespaceIdenticalTo(otherNode) && this.isAttributeListIdenticalTo(otherNode);
    };
    /**
     * Decorator.
     */
    Node.attributePropertyBinding = function (attributeName) {
        return function (target, propertyName) {
            target.addAttributeProxyProperty(propertyName, attributeName);
        };
    };
    Node.prototype.getBoundAttributeNameForProperty = function (propertyName) {
        if (typeof this.attrPropertyBindings !== 'object' || this.attrPropertyBindings === null) {
            return undefined;
        }
        return this.attrPropertyBindings[propertyName];
    };
    Node.prototype.getBoundPropertyNamesForAttribute = function (attributeName) {
        var propertyNames = [];
        if (typeof this.attrPropertyBindings !== 'object' || this.attrPropertyBindings === null) {
            return propertyNames;
        }
        for (var propertyName in this.attrPropertyBindings) {
            if (this.attrPropertyBindings[propertyName] === attributeName) {
                propertyNames.push(propertyName);
            }
        }
        return propertyNames;
    };
    Node.joinAttributeNameWithNamespacePrefix = function (attrName, namespaceName) {
        if (typeof namespaceName !== 'undefined') {
            attrName = namespaceName + ':' + attrName;
        }
        return attrName;
    };
    Node.changeParentNode = function (childNode, newParentNode) {
        childNode._parentNode = newParentNode;
    };
    Node.removeParentNode = function (childNode) {
        childNode._parentNode = undefined;
    };
    Node.generateIndentString = function (indentChar, indentDepth) {
        indentDepth = Math.max(indentDepth || 0, 0);
        if (indentDepth === 0) {
            return '';
        }
        var indentString = '';
        while (indentDepth-- > 0) {
            indentString += indentChar;
        }
        return indentString;
    };
    Node.prototype.stringify = function (params, nodeIndentDepth) {
        nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
        return Node.generateIndentString(params.indentChar, nodeIndentDepth) + "<" + this.tagName + this.stringifyAttributes(nodeIndentDepth) + " />" + params.newlineChar;
    };
    Node.prototype.stringifyAttributes = function (nodeIndentDepth) {
        var attrString = '';
        for (var attrName in this.attrList) {
            attrString += this.stringifyAttribute(attrName, this.attrList[attrName]);
        }
        return attrString;
    };
    Node.prototype.stringifyAttribute = function (attrName, attrValue) {
        if (typeof attrValue !== 'undefined') {
            return " " + attrName + "=\"" + attrValue + "\"";
        }
        else {
            return " " + attrName;
        }
    };
    Node.mergeObjects = function (baseObject, overlayObject) {
        for (var key in overlayObject) {
            baseObject[key] = overlayObject[key];
        }
        return baseObject;
    };
    Node.prototype.addAttributeProxyProperty = function (propertyName, attrName) {
        this.attrPropertyBindings = this.attrPropertyBindings || {};
        this.attrPropertyBindings[propertyName] = attrName;
    };
    Node.prototype.applyAttributePropertyBindings = function () {
        if (typeof this.attrPropertyBindings !== 'object' || this.attrPropertyBindings === null) {
            return;
        }
        for (var propertyName in this.attrPropertyBindings) {
            this.applyAttributePropertyBinding(propertyName, this.attrPropertyBindings[propertyName]);
        }
    };
    Node.prototype.applyAttributePropertyBinding = function (propertyName, attributeName) {
        var _this = this;
        var value = this[propertyName];
        Object.defineProperty(this, propertyName, {
            get: function () { return _this.getAttribute(attributeName); },
            set: function (newValue) { return _this.setAttribute(attributeName, newValue); }
        });
        this.setAttribute(attributeName, value);
    };
    return Node;
}());
exports.Node = Node;
