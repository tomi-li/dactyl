import { Provider, RouterContext, di } from "../deps.ts";
import { IUserService, IVideoService, types } from "../interfaces.ts";

const { Inject, Service } = di;

@Service()
class UserService implements IUserService {

  @Inject(types.IVideoService)
  // @ts-ignore
  private videoService: IVideoService;

  async list() {
    // console.log(this.ctx);
    console.log(this.videoService);
  }

}

export default UserService;
