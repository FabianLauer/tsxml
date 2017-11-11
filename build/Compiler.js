"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Parser_1 = require("./parser/Parser");
var Compiler = /** @class */ (function () {
    function Compiler() {
    }
    /**
     * Parses an XML string and returns the parser object that parsed it.
     */
    Compiler.parseXml = function (xmlString, ruleSet) {
        return Parser_1.Parser.parseString(xmlString, ruleSet);
    };
    /**
     * Parses an XML string and returns the a syntax tree.
     */
    Compiler.parseXmlToAst = function (xmlString, ruleSet) {
        return Parser_1.Parser.parseStringToAst(xmlString, ruleSet);
    };
    /**
     * Parses an XML string to a syntax tree, then serializes it to formatted XML.
     */
    Compiler.formatXmlString = function (xmlString, formattingOptions, ruleSet) {
        return Parser_1.Parser.parseStringToAst(xmlString, ruleSet).toFormattedString(formattingOptions);
    };
    return Compiler;
}());
exports.Compiler = Compiler;
;
