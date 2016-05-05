"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = _promise2.default))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const Parser_1 = require('./parser/Parser');
class Compiler {
    /**
     * Parses an XML string and returns the parser object that parsed it.
     */
    static parseXml(xmlString) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            return Parser_1.Parser.parseString(xmlString);
        });
    }
    /**
     * Parses an XML string and returns the a syntax tree.
     */
    static parseXmlToAst(xmlString) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            return Parser_1.Parser.parseStringToAst(xmlString);
        });
    }
    /**
     * Parses an XML string to a syntax tree, then serializes it to formatted XML.
     */
    static formatXmlString(xmlString, formattingOptions) {
        return __awaiter(this, void 0, _promise2.default, function* () {
            return (yield Parser_1.Parser.parseStringToAst(xmlString)).toFormattedString(formattingOptions);
        });
    }
}
exports.Compiler = Compiler;