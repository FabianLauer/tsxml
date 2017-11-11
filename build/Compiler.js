"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("./parser/Parser");
class Compiler {
    /**
     * Parses an XML string and returns the parser object that parsed it.
     */
    static parseXml(xmlString, ruleSet) {
        return Parser_1.Parser.parseString(xmlString, ruleSet);
    }
    /**
     * Parses an XML string and returns the a syntax tree.
     */
    static parseXmlToAst(xmlString, ruleSet) {
        return Parser_1.Parser.parseStringToAst(xmlString, ruleSet);
    }
    /**
     * Parses an XML string to a syntax tree, then serializes it to formatted XML.
     */
    static formatXmlString(xmlString, formattingOptions, ruleSet) {
        return Parser_1.Parser.parseStringToAst(xmlString, ruleSet).toFormattedString(formattingOptions);
    }
}
exports.Compiler = Compiler;
;
