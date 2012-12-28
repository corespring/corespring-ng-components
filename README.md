corespring-ng-components
========================

re-usable angular-js components

# Components
## Ace Editor
A dsl for embedding for the ace editor
Note: you need to provide the ace editor yourself its not bundled with this app
## When Scrolled
A callback handler when the pge is scrolled
## File Uploader
A directive that adds file upload capabilities (Requires FileReader support)

# When developing:
    coffee --watch --join example/src/main/webapp/js/corespring-ng-components.js --compile common/**/*.coffee modules/**/src/*.coffee
    
# Building
You'll need coffeescript installed
    make

## Running Tests
### Developer mode
    npm install --global testacular
    testacular test/test-config-1.0.js
    testacular-run

or 
    make test

### Continuous Integration mode
    ./test/phantomjs.runner.sh test/jasmine-junit-testrunner.html

