'use strict';

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
    //this.validateConfig(this.config);

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
        const ProviderConstructor = require(providerConfig.module);
        const providerInstance = new ProviderConstructor(that.cementHelper);
        that.providers.set(providerConfig.name, providerInstance);
        providerConfig.routes.forEach(function(routeConfig) {
          that.express[routeConfig.method](routeConfig.path, providerInstance[routeConfig.handler.toLowerCase()]);
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

  validateConfig(config) {
    const properties = config.properties;
    const validate = this.validate;

    try {
      validate(properties.providers).isDefined();
      validate(properties.providers).hasAtLeast(1);

      properties.providers.forEach(function(provider) {
        validate(provider.name).isString();
        validate(provider.routes).isArray();
        validate(provider.routes).hasAtLeast(1);
        validate(provider.module).isString();

        provider.routes.forEach(function(route) {
          validate(route.method).isString();
          validate(route.method).matchEnums(['get', 'post', 'put']);
          validate(route.path).isString();
          validate(route.handler).isString();

        });
      });
    } catch (err) {
      throw err;
    }

  }

  validate(value) {
    return new RestApi.Validation(value);
  }

  static get Validation() {
    return class Validation {
      constructor(value) {
        this.value = value;
      }
      isArray() {
        if(!Array.isArray(this.value)) {
          throw new Error(`is not array`);
        }
      }
      isDefined() {
        if(this.value === undefined) {
          throw new Error(`must be defined`);
        }
      }
      hasAtLeast(num) {
        if(!this.value || this.value.length < num) {
          throw new Error(`must has length at least {num}`)
        }
      }
      isString() {
        if(typeof this.value !== 'string') {
          throw new Error('is not string');
        }
      }
      matchEnums(enums) {
        if(enums.indexOf(this.value) == -1) {
          throw new Error('not match with enums' + enums);
        }
      }
    };
  }

}

module.exports = RestApi;
