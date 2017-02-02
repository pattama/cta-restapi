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

describe('RESTAPI - Constructor', function() {
  context('when everything ok', function() {
    let restapi;
    before(function() {
      restapi = new RestApi(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
    });

    it('should return a new RestApi object', function() {
      expect(restapi).to.be.an.instanceof(RestApi);
    });

    it('should have an CTA-Express instance as \'express\' property', function() {
      expect(restapi).to.have.property('express');
      expect(restapi.express).to.equal(DEFAULTCTAEXPRESS);
    });

    it('should have a Map of routes providers as \'providers\' property', function() {
      expect(restapi).to.have.property('providers');
      expect(restapi.providers).to.be.an('Map');
    });

    it('should have the configuration as a \'config\' property', function() {
      expect(restapi).to.have.property('config', DEFAULTCONFIG);
    });
  });

  context('when CTA-Express instance not existing in CementHelper', function() {
    let mockCementHelper;
    before(function() {
      mockCementHelper = {
        constructor: {
          name: 'CementHelper',
        },
        brickName: 'dblayer',
        logger: DEFAULTLOGGER,
        dependencies: {
        },
      };
    });
    it('should throw an error', function() {
      return expect(function() {
        return new RestApi(mockCementHelper, DEFAULTCONFIG);
      }).to.throw(Error, '\'express\' dependency is missing in cementHelper');
    });
  });

  context('when cementhelper.dependencies.express is not a CTA-Express instance', function() {

  });
});
