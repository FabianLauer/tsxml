"use strict";

class Attribute {
    static create(value) {
        return new class extends Attribute {
            constructor() {
                super(...arguments);
                this.value = value;
            }
        }();
    }
    valueOf() {
        return this.value;
    }
    toString() {
        return this.value + '';
    }
}
exports.Attribute = Attribute;