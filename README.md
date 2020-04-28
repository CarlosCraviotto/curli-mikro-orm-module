# curli-mikro-orm-module

[Mikro ORM](https://mikro-orm.io/) implementation  for  the [Curli framework](https://github.com/CarlosCraviotto/curli-core/).


[![Build Status](https://travis-ci.org/CarlosCraviotto/curli-mikro-orm-module.svg?branch=master)](https://travis-ci.com/github/CarlosCraviotto/curli-mikro-orm-module)
[![Coverage Status](https://coveralls.io/repos/github/CarlosCraviotto/curli-mikro-orm-module/badge.svg?branch=master&cach=ff)](https://coveralls.io/github/CarlosCraviotto/curli-mikro-orm-module?branch=master)


### Installation

Install by `npm`

```sh
npm install --save curli-mikro-orm-module
```
#### Basic Usage

**1 - In the configurations file, declare  de followings properties:**

**@DATABASE_NAME**: (string) The name of the database.
**@DATABASE_DEBUG** (boolean) If we want to see de logs.
**@DATABASE_TYPE** (string)  one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
**@DATABASE_URL** (string)  like 'mongodb://localhost:27017' for mongodb driver

**2 - Add the module definer:**

```typescript
import {MikroOrmModuleDefiner} from "curli-mikro-orm-module";

  app.addModulesDefiner(new MikroOrmModuleDefiner(app));

```

**3 - Attach the mapper into the module**

```typescript
    public registerDataMappers(dataMappers: HandleDataMappers): void {
        dataMappers.addDataMapper(UserMapper);
    }

```

**4 - Call the repository (already declared as service)**

```typescript
await this.container.get('userMikroRepository').persist(entity, true);
```

or

```typescript
await this.container.get('userMikroRepository').persist(entity);

await this.container.get('mikroEntityManager').flush();


```







### Commands

 - `npm run build`: Build the project (Curli Mikro Orm).
 - `npm run build:clean`: Delete first the dist folder and build it.
 - `npm run clean`: Delete the dist folder.
 - `npm run test`: Execute the tests.
 - `npm run test:coverage`:  Execute the tests and calculate the coverage.
 - `npm run lint`: Check the code using the rules in .eslintre.js
 - `npm run lint:fix`: Check the code and try to fix it.



### License

MIT