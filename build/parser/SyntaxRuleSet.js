"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SyntaxRuleSet = /** @class */ (function () {
    function SyntaxRuleSet() {
        this.tagSyntaxRules = [];
    }
    /**
     * Creates an instance of the syntax rule set class this static method is called on.
     */
    SyntaxRuleSet.createInstance = function () {
        return new this();
    };
    SyntaxRuleSet.isSyntaxRuleSetClass = function (candidate) {
        return (typeof candidate === 'function' && candidate._syntaxRuleSetBrand_ === SyntaxRuleSet._syntaxRuleSetBrand_);
    };
    SyntaxRuleSet.prototype.hasTagSyntaxRule = function (rule) {
        return this.tagSyntaxRules.indexOf(rule) !== -1;
    };
    SyntaxRuleSet.prototype.getAllTagSyntaxRules = function () {
        return [].concat(this.tagSyntaxRules);
    };
    /**
     * @chainable
     */
    SyntaxRuleSet.prototype.addTagSyntaxRule = function (rule) {
        if (!this.hasTagSyntaxRule(rule)) {
            this.tagSyntaxRules.push(rule);
        }
        return this;
    };
    /**
     * @chainable
     */
    SyntaxRuleSet.prototype.addTagSyntaxRules = function () {
        var _this = this;
        var rules = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rules[_i] = arguments[_i];
        }
        rules.forEach(function (rule) { return _this.addTagSyntaxRule(rule); });
        return this;
    };
    SyntaxRuleSet._syntaxRuleSetBrand_ = Math.random();
    return SyntaxRuleSet;
}());
exports.SyntaxRuleSet = SyntaxRuleSet;
