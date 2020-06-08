import { Provider, RouterContext, Inject, di } from "../deps.ts";
import { IUserService, IVideoService, types } from "../interfaces.ts";
import { TAGGED_CLS } from "../../util/metakeys.ts";


@Provider("userService")
export default class UserService implements IUserService {

  @Inject()
    // @ts-ignore
  videoService: IVideoService;

  async list() {
    // @ts-ignore
    return [...this.videoService.list(), "userList"];
  }

}
