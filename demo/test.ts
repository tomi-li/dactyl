import "https://cdn.pika.dev/@abraham/reflection@^0.7.0";

const formatMetadataKey = "format";

function format(formatString: string) {
  // @ts-ignore
  return Reflect.metadata(formatMetadataKey, formatString);
}

function getFormat(target: any, propertyKey: string) {
  // @ts-ignore
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}

class Greeter {
  @format("Hello, %s")
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
    Reflect.defineProperty(this, "greeting", {
      value: message,
    });
  }

  greet() {
    let formatString = getFormat(this, "greeting");
    return formatString.replace("%s", this.greeting);
  }
}


const test = new Greeter("tomi");

console.log(test.greeting);
