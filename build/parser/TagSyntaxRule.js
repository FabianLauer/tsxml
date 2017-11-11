"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Defines all possible permissions and restrictions for one or more tags.
 */
var TagSyntaxRule = /** @class */ (function () {
    /**
     * Creates a new tag syntax rule object. **Use static method `createForTagName` instead.**
     */
    function TagSyntaxRule(tagNames) {
        this.tagNames = tagNames;
    }
    /**
     * Creates a new syntax rule for a certain tag name.
     * @param tagName The tag name to create the syntax rule for.
     */
    TagSyntaxRule.createForTagName = function (tagName) {
        return new TagSyntaxRule([tagName]);
    };
    /**
     * Creates a new syntax rule for one or more tag names.
     * @param tagName The tag name to create the syntax rule for.
     */
    TagSyntaxRule.createForTagNames = function () {
        var tagNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tagNames[_i] = arguments[_i];
        }
        return new TagSyntaxRule(
        // make sure there are no duplicate tag names
        /// TODO: Check whether this is fast enough on large tag name lists.
        tagNames.filter(function (tagName, index, array) { return array.indexOf(tagName) === index; }));
    };
    /**
     * Returns all tag names a rule applies to.
     */
    TagSyntaxRule.prototype.getTagNames = function () {
        return [].concat(this.tagNames);
    };
    /**
     * Checks whether a rule applies to a certain tag name. This method is case sensitive.
     * @param tagName The tag name to check.
     */
    TagSyntaxRule.prototype.appliesToTagName = function (tagName) {
        return this.tagNames.indexOf(tagName) !== -1;
    };
    /**
     * Returns a rule's current close mode or close modes.
     */
    TagSyntaxRule.prototype.getCloseMode = function () {
        return this.closeMode;
    };
    /**
     * Sets the rule's allowed tag close modes. This can be a single mode or a combination of modes.
     * @example
     *     rule.setCloseMode(TagCloseMode.SelfClose);
     *     rule.setCloseMode(TagCloseMode.SelfClose | TagCloseMode.Void);
     * @chainable
     * @param mode The close mode to set.
     */
    TagSyntaxRule.prototype.setCloseMode = function (mode) {
        this.closeMode = mode;
        return this;
    };
    return TagSyntaxRule;
}());
exports.TagSyntaxRule = TagSyntaxRule;
