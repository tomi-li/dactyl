import { Provider, RouterContext, di } from "../deps.ts";
import { IVideoService } from "../interfaces.ts";

@Provider("videoService")
export default class VideoService implements IVideoService {

  list() {
    return [123, 234, 345];
  }

}
