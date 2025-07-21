import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments
} from "class-validator";

export function IsUniqueInArray(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isUniqueInArray",
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const key = args.constraints[0];

          if (!Array.isArray(value)) return false;

          const seen = new Set();
          for (const item of value) {
            const propValue = item?.[key];

            if (propValue === undefined || propValue === null) return false;
            const normalized = String(propValue);

            if (seen.has(normalized)) return false;
            seen.add(normalized);
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const key = args.constraints[0];
          return `All values for property '${key}' in ${args.property} must be unique`;
        }
      }
    });
  };
}
