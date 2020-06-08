// Copyright 2020 Liam Tan. All rights reserved. MIT license.

import {
  Application as OakApplication,
  Response,
  Status,
  STATUS_TEXT,
  walkSync,
  _,
  Context,
} from "./deps.ts";

import { Router } from "./Router.ts";
import { ApplicationConfig } from "./types.ts";
import { TAGGED_CLS, TAGGED_PROP } from "./util/metakeys.ts";
import { ObjectDefination } from "./di/ObjectDefination.ts";


/**
 * Bootstrap class responsible for registering controllers
 * onto Router, and starting the Oak webserver
 */
export class Application {
  private router: Router;
  private app: OakApplication;
  private providerMap = new Map<string, ObjectDefination>();

  public constructor(appConfig: ApplicationConfig) {
    const config: ApplicationConfig["config"] = appConfig.config ?? {};
    const { log = true, timing = true, cors = true }: any = config;

    this.router = new Router();
    this.app = new OakApplication();

    for (const controller of appConfig.controllers) {
      this.router.register(controller);
    }

    // apply routes
    this.app.use(this.router.middleware());
    // if routes passes through, handle not found with 404 response.
    this.app.use(this.handleNotFound);
  }

  /**
   * 404 middleware, enabled by default and not disableable
   */
  private async handleNotFound(context: Context): Promise<void> {
    const response: Response = context.response;

    response.status = 404;
    response.body = {
      error: "Not Found",
      status: 404,
    };
  }

  /**
   * Function responsible for begin listen of oak webserver.
   * Console notified when webserver begins.
   *
   * The webserver will start on port `port` as provided as
   * an argument.
   */
  public async run(port: number): Promise<void> {
    for (const fileInfo of walkSync("./services")) {
      // @ts-ignore
      if (fileInfo.isFile && _.endsWith(fileInfo.name, ".ts")) {
        const module = await import("./example/" + fileInfo.path);
        // @ts-ignore
        const metaData = Reflect.getMetadata(TAGGED_CLS, module.default);
        // @ts-ignore
        const metaProps = Reflect.getMetadata(TAGGED_PROP, module.default);

        this.providerMap.set(metaData.id, new ObjectDefination(metaData.id, metaData.originName, metaProps, module.default, metaData.clz));
      }
    }

    for (const fileInfo of walkSync("./controllers")) {
      // @ts-ignore
      if (fileInfo.isFile && _.endsWith(fileInfo.name, ".ts")) {
        const module = await import("./example/" + fileInfo.path);
        // @ts-ignore
        const metaData = Reflect.getMetadata(TAGGED_CLS, module.default);
        // @ts-ignore
        const metaProps = Reflect.getMetadata(TAGGED_PROP, module.default);

        this.providerMap.set(metaData.id, new ObjectDefination(metaData.id, metaData.originName, metaProps, module.default, metaData.clz));
      }
    }

    for (const [key, value] of this.providerMap) {
      const { id, objConstructor, properties } = value;
      for (const prop of (properties || [])) {
        // console.log(propName, objConstructor);
        // @ts-ignore
        Reflect.defineProperty(prop.clz, prop.targetKey, {
          get: () => {
            // @ts-ignore
            const cons = this.providerMap.get(prop.targetKey);
            // @ts-ignore
            return new cons.objConstructor();
          },
          configurable: false,
          enumerable: true,
        });
      }
    }

    console.info(`Dactyl running - please visit http://localhost:${port}/\n\n[LOGS]`);
    const bootstrapMsg: string = this.router.getBootstrapMsg();
    this.app.listen({ port });
  }
}
