'use strict';
const config = {
  'name': 'restapi',
  'module': 'restapi',
  'properties': {
    providers: [
      {
        name: 'executions',
        routes: [
          {
            method: 'get',
            path: '/executions',
            handler: 'find',
          },
          {
            method: 'post',
            path: '/executions',
            handler: 'save',
          },
          {
            method: 'get',
            path: '/executions/:id',
            handler: 'findOne',
          },
        ],
        module: './providers/executions',
      },
      {
        name: 'instances',
        routes: [
          {
            method: 'get',
            path: '/instances',
            handler: 'find',
          },
        ],
        module: './providers/instances',
      },
    ],
  },
  'publish': [],
  'subscribe': [],
};

module.exports = config;
