PROJECT_NAME="corespring-ng-components"

JS_SRC_FILES = $(shell find modules -type f -path '*/src/*.js')
JS_TEST_FILES = $(shell find modules -type f -path '*/test/*.js')
COFFEE_FILES = $(shell find . -type f -name '*.coffee')


all: build

coffee:
	coffee -c ${COFFEE_FILES}


js: coffee
	cat common/**/*.js ${JS_SRC_FILES} > build/${PROJECT_NAME}.js
	uglifyjs -o build/${PROJECT_NAME}.min.js --no-mangle --no-squeeze build/${PROJECT_NAME}.js
	
		
build: js

test: build
	testacular-run

prepare_example: build
	cp build/${PROJECT_NAME}.js example/src/main/webapp/js/${PROJECT_NAME}.js
	echo "now cd to example and enter 'mvn jetty:run'"

.PHONY: all coffee js css build
