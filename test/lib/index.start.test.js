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
  start: sinon.stub(),
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

describe('RESTAPI - Start', function() {
  let restapi;
  before(function() {
    restapi = new RestApi(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
    sinon.spy(restapi.logger, 'info');
    restapi.start();
  });
  context('when everything ok', function() {
    it('should log a CTA-Express starting message', function() {
      return expect(restapi.logger.info.calledWith('Starting the CTA-Express application...')).to.equal(true);
    });

    it('should call CTA-Express start()', function() {
      return expect(restapi.express.start.called).to.equal(true);
    });
  });
});
