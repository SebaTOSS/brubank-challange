import { plainToInstance } from 'class-transformer';

export function TransformToDto(dtoClass: any) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      if (Array.isArray(result)) {
        return result.map(item => plainToInstance(dtoClass, item));
      }
      
      return plainToInstance(dtoClass, result);
    };

    return descriptor;
  };
}