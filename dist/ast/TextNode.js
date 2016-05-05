"use strict";

const Node_1 = require('./Node');
/**
 * Base class for all nodes that may contain child elements.
 */
class TextNode extends Node_1.Node {
    stringify(params, nodeIndentDepth) {
        return `${ Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth) }${ this.content || '' }${ params.newlineChar }`;
    }
}
exports.TextNode = TextNode;