import { Transform } from "class-transformer";

export function ToBoolean(): ReturnType<typeof Transform> {
  return Transform(({ value }): boolean => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string")
      return value.toLowerCase() === "true" || value === "1";
    if (typeof value === "number") return value === 1;
    return false;
  });
}
