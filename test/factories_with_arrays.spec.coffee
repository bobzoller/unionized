expect    = require('chai').expect
fibrous   = require 'fibrous'
Unionized = require '..'

describe 'factories with arrays', ->
  {factory} = {}

  describe 'a factory that defines an array', ->
    factory = Unionized.define fibrous ->
      @setArray 'wiseMen', 3, ['melchior', 'balthazar', 'caspar']

    it 'sets up the default array properly', fibrous ->
      result = factory.sync.json()
      expect(result.wiseMen).to.deep.equal ['melchior', 'balthazar', 'caspar']

    it 'allows overridden wiseMen counts', fibrous ->
      result = factory.sync.json 'wiseMen[]': 5
      expect(result.wiseMen).to.deep.equal ['melchior', 'balthazar', 'caspar', 'melchior', 'balthazar']

    it 'allows overridden specific wise men', fibrous ->
      result = factory.sync.json 'wiseMen[2]': 'jeff'
      expect(result.wiseMen).to.deep.equal ['melchior', 'balthazar', 'jeff']

  describe 'a factory that defines an embedded array', ->

    beforeEach ->
      factory = Unionized.define fibrous ->
        @sync.embedArray 'wibbles', 5, Unionized.define fibrous ->
          @set 'name', 'bob'
          @set 'age', 10

    it 'sets up the default embedded array properly', fibrous ->
      result = factory.sync.json()
      expect(result.wibbles).to.have.length 5
      expect(result.wibbles.every((wibble) -> wibble.name is 'bob')).to.be.ok
      expect(result.wibbles.every((wibble) -> wibble.age is 10)).to.be.ok

    it 'allows overridden wibble counts', fibrous ->
      result = factory.sync.json 'wibbles[]': 2
      expect(result.wibbles).to.have.length 2

    it 'allows overridden specific wibbles', fibrous ->
      result = factory.sync.json 'wibbles[2].name': 'suzanna'
      expect(result.wibbles[0].name).to.equal 'bob'
      expect(result.wibbles[2].name).to.equal 'suzanna'
