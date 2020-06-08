export interface IVideoService {
  list: () => {}
}

export interface IUserService {
  list: () => {}
}


export const types = {
  IVideoService: Symbol("IVideoService"),
  IUserService: Symbol("IUserService"),
};
