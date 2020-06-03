import { TAGGED_CLS } from "../util/metakeys.ts";

export function Provider(identifier?: string) {
  return (target: Function): void => {
    if (!identifier) {
      identifier = target.name;
    }

    console.log(target);

    // @ts-ignore
    Reflect.defineMetadata(TAGGED_CLS, {
      id: identifier,
      originName: target.name,
    }, target);
  };
}

export function Inject(identifier?: string) {
  return (
    target: object | Function,
    propKey: string | symbol | undefined,
    paramIndex?: number,
  ): void => {

  };
}



