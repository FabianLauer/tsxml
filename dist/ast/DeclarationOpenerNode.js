"use strict";

const Node_1 = require('./Node');
class DeclarationOpenerNode extends Node_1.Node {
    constructor() {
        super(...arguments);
        this.systemLiterals = [];
    }
    stringify(params, nodeIndentDepth) {
        nodeIndentDepth = Math.max(nodeIndentDepth || 0, 0);
        return `${ Node_1.Node.generateIndentString(params.indentChar, nodeIndentDepth) }<!${ this.tagName }${ this.stringifyAttributes(nodeIndentDepth) } ${ this.systemLiterals.join('') } />${ params.newlineChar }`;
    }
}
exports.DeclarationOpenerNode = DeclarationOpenerNode;