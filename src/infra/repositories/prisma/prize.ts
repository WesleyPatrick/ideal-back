import { PaginatedParams, PaginatedEntity } from "@domain/entities/pagination";
import { Prize } from "@domain/entities/prize";
import {
  CreatePrizeParams,
  PrizeRepository,
  UpdatePrizeParams
} from "@domain/repositories/prize";
import { PrismaService } from "@infra/config/prisma";
import { PrizeMapper } from "@infra/mappers/prize-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaPrizeRepository implements PrizeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async delete(prizeId: string): Promise<boolean> {
    const prizeDeleted = await this.prisma.prize.delete({
      where: {
        id: prizeId
      }
    });

    return !!prizeDeleted;
  }

  async findById(prizeId: string): Promise<Prize | null> {
    const prize = await this.prisma.prize.findUnique({
      where: {
        id: prizeId
      }
    });

    if (!prize) {
      return null;
    }

    return PrizeMapper.toDomain(prize);
  }

  async update(prizeId: string, params: UpdatePrizeParams): Promise<Prize> {
    const {
      description,
      expiryDate,
      image,
      moneyValue,
      name,
      solecasValue,
      color
    } = params;

    const prize = await this.prisma.prize.update({
      where: {
        id: prizeId
      },
      data: {
        description,
        expiryDate,
        image,
        moneyValue,
        name,
        solecasValue,
        color
      }
    });

    return PrizeMapper.toDomain(prize);
  }

  async findAll(params: PaginatedParams): Promise<PaginatedEntity<Prize>> {
    const { page, pageSize } = params;

    const { prizes, total } = await this.prisma.$transaction(async (tx) => {
      const prizes = await tx.prize.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize
      });

      const total = await tx.prize.count();

      return { prizes, total };
    });

    return {
      data: prizes.map(PrizeMapper.toDomain),
      page,
      lastPage: Math.ceil(total / pageSize),
      total
    };
  }

  async create(params: CreatePrizeParams): Promise<Prize> {
    const {
      description,
      expiryDate,
      image,
      moneyValue,
      name,
      solecasValue,
      color
    } = params;

    const prize = await this.prisma.prize.create({
      data: {
        name,
        description,
        expiryDate,
        image,
        moneyValue,
        solecasValue,
        color
      }
    });

    return PrizeMapper.toDomain(prize);
  }
}
