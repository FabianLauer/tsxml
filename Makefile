.PHONY: tests
tests:
	@tsc tests/main.ts --outDir build/ --target es6 --module commonjs --jsx react --experimentalDecorators

.PHONY: samples
samples:
	@tsc samples/index.ts --outDir build/ --target es6 --module commonjs --jsx react --experimentalDecorators

.PHONY: runTests
runTests: tests
	@node --use-strict --es-staging build/tests/main.js