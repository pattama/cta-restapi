# REST API generic brick for Compass Test Automation

This brick loads handler functions and sets them as endpoints of client HTTP requests in an Express application wrapped by the cta-expresswrapper Tool.

# Initialization
This chapter describes the configuration for a REST API brick.

The REST API brick requires `cta-logger` and `cta-expresswrapper` Tools as dependencies.

```js
const config = {
  tools: [
    {
      name: 'logger',
      module: 'cta-logger',
      properties: {},
      scope: 'all',
    },
    {
      name: 'my-express',
      module: 'cta-expresswrapper',
      properties: {
        port: 3000,
      },
    },
  ],
  bricks: [
    {
      name: 'instance-restapi',
      module: 'cta-restapi',
      dependencies: {
        express: 'my-express',
      },
      properties: {
        providers: [
          {
            name: 'myprovider',
            module: 'myprovider.js', // relative to the current working directory (e.g. where the app was launched)
            routes: [
              {
                method: 'get', // http method get|post|put|delete
                handler: 'mySimpleMethod', // name of the method in the provider
                path: '/mypath/', // the route endpoint
              },
            ],
          },
        ],
      },
      publish: [{
        topic: 'topics.com',
        data: [{}],
      }],
    },
  ],
};
```
