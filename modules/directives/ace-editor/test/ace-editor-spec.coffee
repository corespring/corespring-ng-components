describe 'aceEditor', ()->

  # Ensure the angular modules are loaded
  beforeEach module 'cs.directives'

  describe 'create editor', ()->

    it 'should fail here', ->
      expect(true).toBe(false)

    it 'should have an ace editor attached and ready', ()->
      inject ($compile, $rootScope, $timeout)->
        
        element = null

        runs ->
          $rootScope.code = "<xml></xml>"
          element = $compile("<div ace-editor ace-model='code'></div>")($rootScope)
        
        waits 100
        
        runs ->
          expect($rootScope.editor).toBeDefined()
          expect($rootScope.editor.getSession().getValue()).toBe("<xml></xml>")

    it 'should update the ng model on change', ()->
      inject ($compile, $rootScope, $timeout)->
        
        element = null

        runs ->
          $rootScope.code = "<xml></xml>"
          element = $compile("<div ace-editor ace-model='code'></div>")($rootScope)
        
        waits 100
        
        runs ->
          expect($rootScope.editor).toBeDefined()
          expect($rootScope.editor.getSession().getValue()).toBe("<xml></xml>")
          newXml = "<xml attr='hello'></xml>"
          $rootScope.editor.getSession().setValue(newXml)
          
          expect($rootScope.code).toBe(newXml)
    
