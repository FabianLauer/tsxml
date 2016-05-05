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