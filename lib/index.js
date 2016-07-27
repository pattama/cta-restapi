'use strict';

const path = require('path');
const Brick = require('cta-brick');

/**
 * RestApi class
 * @property {Express} express - instance of a CTA-Express application
 * @property {Object} config - configuration object from cement
 * @property {Map<Provider>} providers - Map of instantiated routes providers
 */
class RestApi extends Brick {
  /**
   * constructor - Create a new RestApi instance
   *
   * @param {CementHelper} cementHelper - cementHelper instance
   * @param {BrickConfig} config - cement configuration of the brick
   */
  constructor(cementHelper, config) {
    super(cementHelper, config);
    if (!('express' in cementHelper.dependencies) || cementHelper.dependencies.express === null) {
      throw new Error(`'express' dependency is missing in cementHelper`);
    }
    this.express = cementHelper.dependencies.express;

    // todo: validate config.properties fields
    this.config = config;

    this.providers = new Map();
  }

  /**
   * Loads all providers needed from the configuration
   * Loads all routes for each provider
   * @returns {Promise}
   */
  init() {
    const that = this;
    that.logger.info(`Initializing Brick ${that.cementHelper.brickName}...`);
    return new Promise((resolve) => {
      that.config.properties.providers.forEach(function(providerConfig) {
        const pathToModule = path.join(process.cwd(), providerConfig.module);
        const ProviderConstructor = require(pathToModule);
        const providerInstance = new ProviderConstructor(that.cementHelper);
        that.providers.set(providerConfig.name, providerInstance);
        providerConfig.routes.forEach(function(routeConfig) {
          that.express[routeConfig.method](routeConfig.path, providerInstance[routeConfig.handler].bind(providerInstance));
        });
        that.logger.info(`Routes provider '${providerConfig.name}' loaded successfully.`);
      });
      resolve('ok');
    });
  }

  /**
   * Notifies the CTA-Express dependency to start
   */
  start() {
    this.logger.info(`Starting the CTA-Express application...`);
    this.express.start();
  }
}

module.exports = RestApi;
