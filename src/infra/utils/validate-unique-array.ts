import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";

@ValidatorConstraint({ async: false })
export class IsUniqueArrayConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (!Array.isArray(value)) return false;

    if (!value.every((item) => typeof item === "string")) return false;

    const uniqueValues = new Set(value as string[]);
    return uniqueValues.size === value.length;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must contain only unique string values`;
  }
}

export function IsUniqueArray(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: "isUniqueArray",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsUniqueArrayConstraint
    });
  };
}
