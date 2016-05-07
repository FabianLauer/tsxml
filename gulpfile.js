const gulp = require('gulp'),
	  fs = require('fs'),
	  cp = require('child_process'),
	  typescript = require('gulp-typescript'),
	  concat = require('gulp-concat'),
	  replace = require('gulp-replace'),
	  babel = require('gulp-babel'),
	  browserify = require('gulp-browserify');


function copyFile(pathToSourceFile, pathToCopiedFile) {
	fs.createReadStream(pathToSourceFile)
	  .pipe(fs.createWriteStream(pathToCopiedFile));
}


function removeDirectory(pathToDirectory) {
	cp.execSync('rm -rf ' + pathToDirectory);
}


/**
 * Compiles one or more TypeScript files and generates one declaration file with the
 * declarations for all files from param `file`.
 * @param files The files to compile.
 * @param declarations Whether to compile a declaration file or not.
 */
function compileTypeScript(files, declarations) {
	const tsResult = gulp.src(files, { base: './' }).pipe(typescript({
		target: 'es6',
		module: 'commonjs',
		experimentalDecorators: true,
		noImplicitAny: true,
		jsx: 'react',
		declaration: !!declarations
	}));
	
	if (declarations) {
		// declaration file merging
		return tsResult.dts// Remove all import statements:
					.pipe(replace(/import.*?;\r?\n/g, '\n'))
					// Remove all export statements but those that declare a type:
					.pipe(replace(/export(?! +declare +type).*?;\r?\n/g, '\n'))
					// Remove excess line breaks:
					.pipe(replace(/(\r?\n)+/g, '\n'))
					// Now concat all declaration files into one:
					.pipe(concat('xml.d.ts'))
					// Write the declaration file into the build directory and we're done:
					.pipe(gulp.dest('build/'));
	} else {
		// compiled JS files only
		return tsResult.js.pipe(gulp.dest('build/'));
	}
}


gulp.task('cleanup', () => {
	if (fs.existsSync('./build/')) {
		removeDirectory('./build/');
	}
	if (fs.existsSync('./dist/')) {
		removeDirectory('./dist/');
	}
});


// Compiles all files (except those in the /tests/ directory) to JavaScript.
gulp.task('compileSources', (callback) => compileTypeScript([
	'src/index.ts*',
	'src/ast.ts*',
	'src/parser.ts*',
	'src/Compiler.ts*',
	'src/ast/*.ts*',
	'src/parser/*.ts*'
], false));


// Compiles all files (except those in the /tests/ directory) to JavaScript.
gulp.task('compileExamples', ['compileSources'], () => compileTypeScript([
	'examples/**/*.ts'
]), false);


// Compiles a single declaration file from all files (except those in the /tests/ directory) and
// saves it in /build/xml.d.ts.
gulp.task('compileDeclarationFile', () => compileTypeScript([
	'src/index.ts*',
	'src/ast.ts*',
	'src/parser.ts*',
	'src/Compiler.ts*',
	'src/ast/*.ts*',
	'src/parser/*.ts*'
], true));


// Compiles all files (except those in the /tests/ directory) to JavaScript and compiles a single
// declaration file into /build/xml.d.ts.
gulp.task('compile', ['compileSources', 'compileDeclarationFile']);


// Compiles all files required to run the test suite.
gulp.task('compileTests', ['compileSources'], () => compileTypeScript([
	'src/test/*.ts*',
	'src/test.ts*',
	'tests/**/*.ts*'
]), false);


// Compiles all files (except those in the /tests/ directory) to JavaScript and compiles a single
// declaration file into /build/xml.d.ts.
gulp.task('prepareNodeJsRelease', ['cleanup', 'compileSources', 'compileDeclarationFile'], () => {
	// make sure the 'dist' directory exists
	if (!fs.existsSync('./dist/')) {
		fs.mkdirSync('./dist/');
	}
	// copy the declaration file to the 'dist' directory
	copyFile('./build/xml.d.ts', './dist/xml.d.ts');
	// transpile JS into the 'dist' directory
	return gulp.src(['./build/src/**/*.js'])
		.pipe(babel({
			presets: ['es2015'],// ['es2016-node5'],
			plugins: ['transform-runtime']
		}))
		.pipe(gulp.dest('./dist/'));
});


// Compiles all files (except those in the /tests/ directory) to JavaScript and compiles a single
// declaration file into /build/xml.d.ts.
gulp.task('prepareRelease', ['prepareNodeJsRelease'], () => {
	return gulp.src(['./dist/index.js'])
		.pipe(browserify({
			standalone: 'xml'
		}))
		.pipe(concat('xml.js'))
		.pipe(gulp.dest('./dist/'));
});