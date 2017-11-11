.PHONY: build
build:
	rm -rf build/*

	./node_modules/.bin/tsc

	@rm -rf ./build/examples || true
	@rm -rf ./build/tests || true
	@rm -rf ./build/src/test || true
	@rm ./build/src/test.js || true
	@rm ./build/src/test.d.ts || true

	./node_modules/.bin/browserify build/src/index.js > build/index.js

	@find ./build/src/ -name "*.js" -type f -delete
	
	mv ./build/src/* ./build/
	rm -rf ./build/src/

