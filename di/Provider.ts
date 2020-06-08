import { TAGGED_CLS, TAGGED_PROP } from "../util/metakeys.ts";

export function Provider(identifier?: string) {
  return (target: Function): any => {
    if (!identifier) {
      identifier = target.name;
    }

    // @ts-ignore
    Reflect.defineMetadata(TAGGED_CLS, {
      id: identifier,
      originName: target.name,
    }, target);

    return target;
  };
}


export function Inject(identifier?: string) {
  return function(target: any, targetKey: string, index?: number): void {
    if (!identifier) {
      identifier = target.name;
    }

    // @ts-ignore
    const existing = Reflect.getMetadata(TAGGED_PROP, target.constructor) || [];

    // @ts-ignore
    Reflect.defineMetadata(TAGGED_PROP, [...existing, {
      targetKey,
      clz: target
    }], target.constructor);
  };
}



