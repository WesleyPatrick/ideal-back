import { Prize } from "@domain/entities/prize";
import { Prize as PrismaPrize } from "@prisma/client";

export class PrizeMapper {
  static toDomain(prize: PrismaPrize): Prize {
    return {
      id: prize.id,
      name: prize.name,
      solecasValue: prize.solecasValue,
      moneyValue: prize.moneyValue,
      description: prize.description,
      image: prize.image,
      color: prize.color,
      expiryDate: prize.expiryDate,
      createdAt: prize.createdAt,
      updatedAt: prize.updatedAt
    };
  }

  static toPersistence(prize: Prize): PrismaPrize {
    return {
      id: prize.id,
      name: prize.name,
      solecasValue: prize.solecasValue,
      moneyValue: prize.moneyValue,
      description: prize.description,
      image: prize.image,
      color: prize.color,
      expiryDate: prize.expiryDate,
      createdAt: prize.createdAt,
      updatedAt: prize.updatedAt
    };
  }
}
