import { Provider, RouterContext, di } from "../deps.ts";
import { IVideoService } from "../interfaces.ts";

const { Inject, Service } = di;

@Service()
class VideoService implements IVideoService {

  async list() {

  }

}

export default VideoService;
