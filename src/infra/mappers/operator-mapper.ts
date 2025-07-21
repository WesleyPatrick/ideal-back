import { Operator } from "@domain/entities/operator";
import { Operator as PrismaOperator } from "@prisma/client";

export class OperatorMapper {
  static toDomain(operator: PrismaOperator): Operator {
    return {
      id: operator.id,
      userId: operator.userId,
      createdAt: operator.createdAt,
      updatedAt: operator.updatedAt
    };
  }
}
