import { PrizeOrder } from "@domain/entities/prize-order";
import { PrizeOrder as PrismaPrizeOrder } from "@prisma/client";

export class PrizeOrderMapper {
  static toDomain(prizeOrder: PrismaPrizeOrder): PrizeOrder {
    return {
      id: prizeOrder.id,
      prizeId: prizeOrder.prizeId,
      employeeId: prizeOrder.employeeId,
      serviceProviderId: prizeOrder.serviceProviderId,
      operatorId: prizeOrder.operatorId,
      solecasValue: prizeOrder.solecasValue,
      moneyValue: prizeOrder.moneyValue,
      solecasRemaining: prizeOrder.solecasRemaining,
      createdAt: prizeOrder.createdAt,
      updatedAt: prizeOrder.updatedAt
    };
  }

  static toPersistence(prizeOrder: PrizeOrder): PrismaPrizeOrder {
    return {
      id: prizeOrder.id,
      prizeId: prizeOrder.prizeId,
      employeeId: prizeOrder.employeeId,
      serviceProviderId: prizeOrder.serviceProviderId,
      operatorId: prizeOrder.operatorId,
      solecasValue: prizeOrder.solecasValue,
      solecasRemaining: prizeOrder.solecasRemaining,
      moneyValue: prizeOrder.moneyValue,
      createdAt: prizeOrder.createdAt,
      updatedAt: prizeOrder.updatedAt
    };
  }
}
