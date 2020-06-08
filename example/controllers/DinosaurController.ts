// Copyright 2020 Liam Tan. All rights reserved. MIT license.

import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Provider
} from "../deps.ts";
import { IUserService, IVideoService } from "../interfaces.ts";


@Provider()
@Controller("/dinosaur")
class DinosaurController {

  @Inject()
    // @ts-ignore
  userService: IUserService;

  @Inject()
    // @ts-ignore
  videoService: IVideoService;

  @Get("/")
  @HttpStatus(200)
  async getDinosaurs() {

    console.log(this.videoService.list());

    return {
      message: "Action returning all dinosaurs! Defaults to 200 status!",
      data: await this.userService.list(),
    };
  }

}

export default DinosaurController;
