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
var SyntaxErrorCode_1 = require("./SyntaxErrorCode");
var SyntaxError = /** @class */ (function (_super) {
    __extends(SyntaxError, _super);
    function SyntaxError(errorCode, line, column, source, message) {
        var _this = _super.call(this, message) || this;
        _this.errorCode = errorCode;
        _this.line = line;
        _this.column = column;
        _this.source = source;
        _this.source = _this.source || '';
        return _this;
    }
    SyntaxError.getSyntaxErrorCodeName = function (errorCode) {
        return SyntaxErrorCode_1.SyntaxErrorCode[errorCode];
    };
    SyntaxError.prototype.getMessage = function () {
        return this.message;
    };
    SyntaxError.prototype.getErrorCode = function () {
        return this.errorCode;
    };
    SyntaxError.prototype.getErrorName = function () {
        return SyntaxError.getSyntaxErrorCodeName(this.getErrorCode());
    };
    SyntaxError.prototype.getLine = function () {
        return this.line;
    };
    SyntaxError.prototype.getColumn = function () {
        return this.column;
    };
    SyntaxError.prototype.toString = function () {
        return "syntax error [" + this.getErrorCode() + " " + this.getErrorName() + "] at token '" + this.getTokenAt(this.line, this.column) + "' " + this.getLine() + ", " + this.getColumn() + ": " + this.getMessage();
    };
    SyntaxError.prototype.getTokenAt = function (line, column) {
        var sourceLine = this.source.split(/\n/)[line - 1];
        if (typeof sourceLine !== 'string') {
            return '';
        }
        return sourceLine.split('')[column - 1];
    };
    return SyntaxError;
}(Error));
exports.SyntaxError = SyntaxError;
