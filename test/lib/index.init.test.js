'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');
require('sinon-as-promised');
const RestApi = require('../../lib/index.js');
const logger = require('cta-logger');

const DEFAULTLOGGER = logger();
const DEFAULTCTAEXPRESS = {
  post: sinon.stub(),
  get: sinon.stub(),
};
const DEFAULTCONFIG = require('./index.config.testdata.js');

describe('RESTAPI - Init', function() {
  context('when everything ok', function() {
    const mockProviders = new Map();
    let restapi;
    let promise;
    before(function(done) {
      // create a mock provider per provider needed
      DEFAULTCONFIG.properties.providers.forEach(function(providerConfig) {
        mockProviders.set(providerConfig.name, {
          MockConstructor: function(cementHelper) {
            const instance = {
              cementHelper: cementHelper,
            };
            // the mock provider should have all the methods (e.g. handlers) defined in configuration routes Array
            providerConfig.routes.forEach(function(route) {
              instance[route.handler] = function() {};
              // the instance must be bound to the handler, so we stub the bind method for the test
              sinon.stub(instance[route.handler], 'bind').returns(instance[route.handler].bind(instance));
            });
            return instance;
          },
        });
        sinon.spy(mockProviders.get(providerConfig.name), 'MockConstructor');
      });
      const DEFAULTCEMENTHELPER = {
        constructor: {
          name: 'CementHelper',
        },
        brickName: 'restapi',
        logger: DEFAULTLOGGER,
        dependencies: {
          express: DEFAULTCTAEXPRESS,
        },
        require: (modulePath) => {
          const name = DEFAULTCONFIG.properties.providers.filter((e) => {
            return e.module === modulePath;
          })[0].name;
          return mockProviders.get(name).MockConstructor;
        },
      };
      restapi = new RestApi(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
      sinon.spy(restapi.logger, 'info');
      restapi.init().then(function(res) {
        promise = res;
        done();
      }).catch(done);
    });

    it('should log an initializing message', function() {
      return expect(restapi.logger.info.calledWith(`Initializing Brick ${restapi.cementHelper.brickName}...`)).to.equal(true);
    });

    describe('loading (e.g. requiring) providers from the config.properties.providers Array', function() {
      it('should instantiate all needed providers and push them to RestApi brick \'providers\' Map', function() {
        DEFAULTCONFIG.properties.providers.forEach((providerConfig) => {
          const MockConstructor = mockProviders.get(providerConfig.name).MockConstructor;
          expect(MockConstructor.calledWith(restapi.cementHelper)).to.equal(true);
          expect(restapi.providers.has(providerConfig.name)).to.equal(true);
          expect(restapi.providers.get(providerConfig.name)).to.equal(MockConstructor.returnValues[0]);
        });
      });
    });

    describe('loading routes for each provider', function() {
      it('should apply all routes on the CTA-Express instance', function() {
        DEFAULTCONFIG.properties.providers.forEach((providerConfig) => {
          providerConfig.routes.forEach((routeConfig) => {
            expect(DEFAULTCTAEXPRESS[routeConfig.method]
              .calledWithExactly(routeConfig.path, restapi.providers.get(providerConfig.name)[routeConfig.handler].bind.returnValues[0])
            ).to.equal(true);
          });
          expect(restapi.logger.info.calledWith(`Routes provider '${providerConfig.name}' loaded successfully.`)).to.equal(true);
        });
      });
    });

    it('should resolve with \'ok\'', function() {
      return expect(promise).to.equal('ok');
    });
  });
});
