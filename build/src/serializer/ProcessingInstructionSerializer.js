"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("./config");
const ast_1 = require("../ast");
const _1 = require("./");
let ProcessingInstructionSerializer = class ProcessingInstructionSerializer extends _1.NodeSerializer {
    serializeConcrete(node, indentDepth) {
        indentDepth = Math.max(indentDepth || 0, 0);
        const indent = this.generateIndentString(indentDepth);
        const attrList = this.stringifyAttributes(node, indentDepth);
        const newline = this.getConfig(config.newlineChar);
        return `${indent}<?${node.tagName}${attrList}?>${newline}`;
    }
};
ProcessingInstructionSerializer = __decorate([
    _1.NodeSerializer.register(node => node instanceof ast_1.ProcessingInstructionNode)
], ProcessingInstructionSerializer);
exports.default = ProcessingInstructionSerializer;