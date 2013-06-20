# version
version = 'X.X.X';
angular.module('cs.services', [])
angular.module('cs.directives', ['cs.services'])
angular.module('cs', ['cs.directives']).value('cs.config', {})