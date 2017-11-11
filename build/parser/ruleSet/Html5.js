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
var TagCloseMode_1 = require("../TagCloseMode");
var TagSyntaxRule_1 = require("../TagSyntaxRule");
var SyntaxRuleSet_1 = require("../SyntaxRuleSet");
var Html5 = /** @class */ (function (_super) {
    __extends(Html5, _super);
    function Html5(allowVoidElementsToSelfClose) {
        var _this = _super.call(this) || this;
        if (typeof allowVoidElementsToSelfClose === 'undefined') {
            allowVoidElementsToSelfClose = true;
        }
        // see https://www.w3.org/TR/html-markup/syntax.html#syntax-elements
        var voidTagSyntaxRule = TagSyntaxRule_1.TagSyntaxRule.createForTagNames('area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr');
        if (allowVoidElementsToSelfClose) {
            voidTagSyntaxRule.setCloseMode(TagCloseMode_1.TagCloseMode.Void | TagCloseMode_1.TagCloseMode.SelfClose);
        }
        else {
            voidTagSyntaxRule.setCloseMode(TagCloseMode_1.TagCloseMode.Void);
        }
        _this.addTagSyntaxRule(voidTagSyntaxRule);
        return _this;
    }
    Object.defineProperty(Html5, "Loose", {
        get: function () {
            return /** @class */ (function (_super) {
                __extends(Html5Loose, _super);
                function Html5Loose() {
                    return _super.call(this, true) || this;
                }
                return Html5Loose;
            }(Html5));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Html5, "Strict", {
        get: function () {
            return /** @class */ (function (_super) {
                __extends(Html5Strict, _super);
                function Html5Strict() {
                    return _super.call(this, false) || this;
                }
                return Html5Strict;
            }(Html5));
        },
        enumerable: true,
        configurable: true
    });
    return Html5;
}(SyntaxRuleSet_1.SyntaxRuleSet));
exports.Html5 = Html5;
