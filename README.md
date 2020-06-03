<img src="./media/fulllogo.jpg?raw=true" alt="dactyl" width="243" height="161"/>

[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/dactyl/mod.ts)

### Web framework for Deno, built on top of Oak

## TL:DR; Available modules:

Currently, through `mod.ts`, you have access to (docs link on left):

1. [Controller.ts](https://doc.deno.land/https/deno.land/x/dactyl/Controller.ts) - function decorator responsible for assigning controller metadata
2. [Application.ts](https://doc.deno.land/https/deno.land/x/dactyl/Application.ts) - application class able to register controllers, and start the webserver
3. [HttpException](https://doc.deno.land/https/deno.land/x/dactyl/HttpException.ts) - throwable exception inside controller actions, `Application` will then handle said errors at top level and send the appropriate HTTP status code and message. There is also a list of included predefined `HttpException` classes, see below
4. [HttpStatus.ts](https://doc.deno.land/https/deno.land/x/dactyl/HttpStatus.ts) - function decorator responsible for assigning default status codes for controller actions
5. [Method.ts](https://doc.deno.land/https/deno.land/x/dactyl/Method.ts) - `@Get, @Post, @Put, @Patch, @Delete` function decorators responsible for defining routes on controller actions

_For following - [Arg.ts](https://doc.deno.land/https/deno.land/x/dactyl/Arg.ts)_

6. `@Param` decorator maps `context.params` onto argument in controller action (returns whole `params` object if no key specified)
7. `@Body` decorator maps `context.request` async body onto argument in controller action (returns whole `body` object if no key specified)
8. `@Query` - maps `context.url.searchParams` onto argument in controller action (returns whole `query` object if no key specified)
9. `@Header` - maps `context.headers` onto argument in controller action (returns whole `header` object if no key specified)
10. `@Context` - return whole Oak `RouterContext` object
11. `@Request` - return whole Oak `Request` object
12. `@Response` - return whole Oak `Response` object

13. [Router.ts](https://doc.deno.land/https/deno.land/x/dactyl/Router.ts) - It is recommended that you use the `Application` to bootstrap, but you can use the `Router`
    class directly. This is a superclass of Oak's router, and exposes additional methods for mapping `Controller` definitions onto routes.

## Purpose

Deno is the new kid on the block, and Oak seems to be paving the way for an express-like middleware and routing solution with our fancy new runtime. It's only natural that abstractions on top of Oak are born in the near future - much like Nest tucked express middleware and routing under the hood and provided developers with declarative controllers, DI, etc. This project aims to provide a small portion of these features with room to expand in future.

## Getting started

This repo contains an example project with one controller. You can execute this on your machine easily with Deno:

`deno run --allow-net --config=tsconfig.json https://deno.land/x/dactyl/example/index.ts`

One caveat is to ensure you have a `tsconfig.json` file enabling `Reflect` and function decorators for this project, as Deno does not support this in it's default config. Ensure a `tsconfig.json` exists in your directory with at minimum:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

This should result in the following output:

```
______           _         _ 
|  _  \         | |       | |
| | | |__ _  ___| |_ _   _| |
| | | / _` |/ __| __| | | | |
| |/ / (_| | (__| |_| |_| | |
|___/ \__,_|\___|\__|\__, |_| FRAMEWORK
                      __/ |  
                      |___/   
  
/dinosaur
  [GET] /
  [GET] /:id
  [POST] /
  [PUT] /:id
  [DELETE] /:id

Dactyl running - please visit http://localhost:8000/
```

You can now visit your API.

## Dactyl in action

In the above example project, there exists one `Controller` and a bootstrapping file, `index.ts` that starts the web server.

`DinosaurController.ts`
Controllers are declared with function decorators. This stores metadata that is consumed on bootstrap and converted into route definitions that Oak can understand.

```ts
@Controller("/dinosaur")
class DinosaurController {
  @Get("/")
  @HttpStatus(200)
  getDinosaurs(@Query("orderBy") orderBy: any, @Query("sort") sort: any) {
    const dinosaurs: any[] = [
      { name: "Tyrannosaurus Rex", period: "Maastrichtian" },
      { name: "Velociraptor", period: "Cretaceous" },
      { name: "Diplodocus", period: "Oxfordian" },
    ];

    if (orderBy) {
      dinosaurs.sort((a: any, b: any) => (a[orderBy] < b[orderBy] ? -1 : 1));
      if (sort === "desc") dinosaurs.reverse();
    }

    return {
      message: "Action returning all dinosaurs! Defaults to 200 status!",
      data: dinosaurs,
    };
  }
  @Get("/:id")
  getDinosaurById(@Param("id") id: any, @Header("content-type") contentType: any) {
    return {
      message: `Action returning one dinosaur with id ${id}`,
      ContentType: contentType,
    };
  }
  @Post("/")
  createDinosaur(@Body("name") name: any) {
    if (!name) {
      throw new BadRequestException("name is a required field");
    }
    return {
      message: `Created dinosaur with name ${name}`,
    };
  }
  @Put("/:id")
  updateDinosaur(@Param("id") id: any, @Body("name") name: any) {
    return {
      message: `Updated name of dinosaur with id ${id} to ${name}`,
    };
  }
  @Delete("/:id")
  deleteDinosaur(
    @Context() ctx: RouterContext,
    @Request() req: OakRequest,
    @Response() res: OakResponse
  ) {
    return {
      message: `Deleted dinosaur with id ${ctx.params.id}`,
    };
  }
}

export default DinosaurController;

```

`index.ts`
This file bootstraps the web server by registering `DinosaurController` to the `Application` instance. `Application` can then use the `.run()` async method to start the webserver.

```ts
import { Application } from "./deps.ts";

import DinosaurController from "./DinosaurController.ts";

const app: Application = new Application({
  controllers: [DinosaurController],
});

await app.run(8000);
```

And away we go. This spins up a web server using oak with the appropriately registered routes based on your controller definitions.

## Configuration

There is additional configuration that you can pass to the application upon bootstrap:

```ts
const app: Application = new Application({
  controllers: [DinosaurController],
  config: {
    cors: false, // true by default
    timing: false, // true by default
    log: false, // true by default
  }
});
```
1. `cors` - Enables CORS middleware (`true` by default). This sets the following headers to `*` on `context.response`: `access-control-allow-origin`, `access-control-allow-methods`, `access-control-allow-methods`.
2. `timing` - Enables timing header middleware (`true` by default). This sets `X-Response-Time` header on `context.response`.
3. `log` - Enables per-request logging (`true by default`). The message format is: `00:00:00 GMT+0000 (REGION) [GET] - /path/to/endpoint - [200 OK]`


## Exceptions

Exceptions can be raised at any time in the request lifecycle. `HttpException` allows you to raise a custom exception, or you can
use a predefined `HttpException` (listed below):

1. `BadRequestException`
2. `UnauthorizedException`
3. `PaymentRequiredException`
4. `ForbiddenException`
5. `NotFoundException`
6. `MethodNotAllowedException`
7. `RequestTimeoutException`
8. `UnsupportedMediaTypeException`
9. `TeapotException`
10. `UnprocessableEntityException`
11. `TooManyRequestsException`
12. `RequestHeaderFieldsTooLargeException`
13. `InternalServerErrorException`
14. `NotImplementedException`
15. `BadGatewayException`
16. `ServiceUnavailableException`
17. `GatewayTimeoutException`

[HttpException.ts](https://doc.deno.land/https/deno.land/x/dactyl/HttpException.ts)

## Modules

All modules are accessible without the example project by referring to them in your `deps.ts` file.
E.g.

```ts
export { Controller, DactylRouter, Get } from "https://deno.land/x/dactyl/mod.ts";
```

**In the works**

1. `@Injectable` - DI implementation for controllers, allowing injectible services
2. `@Before, @BeforeAll` - decorators for controller and controller actions for pre-request actions like validation
3. CLI tool for boilerplate generation and file structure
4. Website with docos.
