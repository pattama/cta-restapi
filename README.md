# cta-restapi [ ![build status](https://git.sami.int.thomsonreuters.com/compass/cta-restapi/badges/master/build.svg)](https://git.sami.int.thomsonreuters.com/compass/cta-restapi/commits/master) [![coverage report](https://git.sami.int.thomsonreuters.com/compass/cta-restapi/badges/master/coverage.svg)](https://git.sami.int.thomsonreuters.com/compass/cta-restapi/commits/master)

REST API Modules for Compass Test Automation, One of Libraries in CTA-OSS Framework

## General Overview

## Guidelines

We aim to give you brief guidelines here.

1. [Usage](#1-usage)
1. [Configuration](#2-configuration)
1. [Providers](#3-providers)

### 1. Usage

**cta-restapi** extends **Brick** (_cta-brick_). In order to use it, we need to provide a **configuration**. **cta-restapi** depends on **cta-expresswrapper**.

```javascript
const config = {
  name: 'restapi',
  module: 'cta-restapi',
  dependencies: {
    express: 'express-tool-name',
  },
  properties: {
    providers: [
      {
        name: 'handlerA',
        module: './utils/restapi/handlers/A.js',
        routes: [
          {
            method: 'post',
            handler: 'create',
            path: '/results',
          },
        ],
      },
      {
        name: 'handlerB',
        module: './utils/restapi/handlers/B.js',
        routes: [
          {
            method: 'post',
            handler: 'create',
            path: '/tasks',
          },
          {
            method: 'get',
            handler: 'alltasks',
            path: '/tasks',
          },
        ],
      },
    ],
  },
};
```

[back to top](#guidelines)

### 2. Configuration

In configuration, there are _two_ **requirements**.

* **cta-restapi** depends on **cta-expresswrapper**, [Dependency on cta-expresswrapper](#dependency-on-cta-expresswrapper)
* **cta-restapi** needs **providers** to handle _http-actions_, [Providers on properties](#providers-on-properties)

```javascript
const config = {
  ...
  dependencies: {
    express: 'express-tool-name',
  },
  properties: {
    providers: [ {...}, {...} ]
  },
  ...
};
```

#### #Dependency on cta-expresswrapper

In the other file, the _configuration_ setups a tool using **cta-expresswrapper**. It setups _a tool_ called **"my-express"**.

```javascript
// myexpress.js file
const config = {
  tools: [
    {
      name: 'my-express',
      module: 'cta-expresswrapper',
      properties: {
        port: 3000,
      },
    },
  ],
};
```

Then, in **cta-restapi**, we set the tool _name_, in this case, **my-express** to **dependencies.express**.

```javascript
// configuration file
const config = {
  ...
  dependencies: {
    express: 'my-express',
  },
  ...
};
```

#### #Providers on properties

Another requirement is **providers** in **properties**. **properties.providers** value must be an array of providers.

```javascript
const config = {
  ...
  properties: {
    providers: [ {...}, {...} ]  // an array of providers
  },
  ...
};
```

[back to top](#guidelines)

### 3. Providers

**Providers** are handlers to REST path and methods. These are _properties_ of **providers**.

* **name** - defines _the provider's **name**_

* **module** - provides _the **path** to provider module_

* **routes** - provides _an array of **route handlers**_

  * **method** - defines **REST method type** : [ "_get_", "_post_", "_put_", "_patch_", "_delete_" ]
  
  * **path** - defines **REST path**
  
  * **handler** - defines **handler method name** of _provider_

```javascript
const config = {
  ...
  properties: {
    providers: [
      {
        name: "sample-provider",
        module: "./util/restapi/sample.provider.js",
        routes: [
          {
            method: "get",
            path: "/tasks",
            handler: "allTasks",
          },
        ]
      },
      {...}
    ],
  },
  ...
};
```

From this configuration, the **provider** named **"sample-provider"** is located at _"[root]/util/restapi/sample.provider.js"_.
This provider has method called **"allTasks()"** to handle the _REST_ on path: **"GET:: /tasks"** (method: **_get_**, path: **_/tasks_**).

[back to top](#guidelines)

------

## To Do

------

## Considerations

* Should we change specific, close-to-'ExpressJS' **dependencies.express** to a common name, dependencies.[restapp]?

* Should we implement **"declaration"** instead of **"implementation"** on providers?