describe 'aceEditor', ()->

  # Ensure the angular modules are loaded
  beforeEach module 'cs.directives'

  describe 'create editor', ()->

    it 'creation', ()->
      inject ($compile, $rootScope)->
        expect(true).toEqual(true)

    