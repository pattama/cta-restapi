'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
require('sinon-as-promised');
const RestApi = require('../../lib/index.js');
const logger = require('cta-logger');

const DEFAULTLOGGER = logger();
const DEFAULTCTAEXPRESS = {
  app: {},

  post: function() {},
  get: function() {},
};
const DEFAULTCEMENTHELPER = {
  constructor: {
    name: 'CementHelper',
  },
  brickName: 'restapi',
  logger: DEFAULTLOGGER,
  dependencies: {
    express: DEFAULTCTAEXPRESS,
  },
};
const DEFAULTCONFIG = require('./index.config.testdata.js');

describe.only('RESTAPI - ValidateConfig', function() {
  context('when everything ok', function() {
    let restapi;
    before(function() {
      restapi = new RestApi(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
    });

    it('should return a new RestApi object', function() {
      expect(() => restapi.validateConfig(DEFAULTCONFIG)).to.not.throw(Error);
    });
  });

  context('when config is invalid it should throw an error', function() {
    let restapi;
    before(function() {
      restapi = new RestApi(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
    });

    it('has no providers', function() {
      expect(() => restapi.validateConfig({
        properties: {}
      })).to.throw(Error);
    });

    it('has no item in providers', function() {
      expect(() => restapi.validateConfig({
        properties: {
          providers: []
        }
      })).to.throw(Error);
    });

    it('has no name in provider item', function() {
      expect(() => restapi.validateConfig({
        properties: {
          providers: [{}]
        }
      })).to.throw(Error);
    });

    it('has no routes in provider item', function() {
      expect(() => restapi.validateConfig({
        properties: {
          providers: [{
            name: 'foobar'
          }]
        }
      })).to.throw(Error);
    });

    it('has no item in routes', function() {
      expect(() => restapi.validateConfig({
        properties: {
          providers: [{
            name: 'foobar',
            routes: []
          }]
        }
      })).to.throw(Error);
    });

    it('has no method in route item', function() {
      expect(() => restapi.validateConfig({
        properties: {
          providers: [{
            name: 'foobar',
            routes: [{

            }]
          }]
        }
      })).to.throw(Error);
    });

    it('has wrong method in route item', function() {
      expect(() => restapi.validateConfig({
        properties: {
          providers: [{
            name: 'foobar',
            routes: [{
              method: 'woohoo'
            }]
          }]
        }
      })).to.throw(Error);
    });

    it('has no path in route item', function() {
      expect(() => restapi.validateConfig({
        properties: {
          providers: [{
            name: 'foobar',
            routes: [{
              method: 'get',
            }]
          }]
        }
      })).to.throw(Error);
    });

    it('has no handler in route item', function() {
      expect(() => restapi.validateConfig({
        properties: {
          providers: [{
            name: 'foobar',
            routes: [{
              method: 'get',
              path: '/path'
            }]
          }]
        }
      })).to.throw(Error);
    });

  });
});
