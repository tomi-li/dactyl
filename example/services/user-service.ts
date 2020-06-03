import { Provider, RouterContext, di } from "../deps.ts";
import { IUserService, IVideoService, types } from "../interfaces.ts";

const { Inject, Service } = di;

@Provider("123")
export default class UserService implements IUserService {

  // @ts-ignore
  private videoService: IVideoService;

  async list() {
    // console.log(this.ctx);
    console.log(this.videoService);
  }

}
