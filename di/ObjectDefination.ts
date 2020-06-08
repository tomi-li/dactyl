export class ObjectDefination {
  id: string;
  name: string;
  properties: string[];
  objConstructor: Function;
  clz: any;

  constructor(id: string, name: string, properties: string[], objConstructor: Function, clz: any) {
    this.id = id;
    this.name = name;
    this.properties = properties;
    this.objConstructor = objConstructor;
    this.clz = clz;
  }
}
