import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { PrizeOrder } from "@domain/entities/prize-order";
import { EmployeeRepository } from "@domain/repositories/employee";
import { PrizeRepository } from "@domain/repositories/prize";
import { PrizeOrderRepository } from "@domain/repositories/prize-order";
import { ServiceProviderRepository } from "@domain/repositories/service-provider";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

export interface CreatePrizeOrderUseCaseParams {
  prizeId: string;
  employeeId: string;
}

@Injectable()
export class CreatePrizeOrderUseCase {
  constructor(
    private readonly prizeOrderRepository: PrizeOrderRepository,
    private readonly prizeRepository: PrizeRepository,
    private readonly serviceProviderRepository: ServiceProviderRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly userRepository: UserRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    params: CreatePrizeOrderUseCaseParams
  ): Promise<PrizeOrder | void> {
    const { employeeId, prizeId } = params;

    const employee = await this.employeeRepository.findById(employeeId);

    if (!employee) {
      return this.exceptionAdapter.notFound({
        message: "Not found a employee with this id"
      });
    }

    const prize = await this.prizeRepository.findById(prizeId);

    if (!prize) {
      return this.exceptionAdapter.notFound({
        message: "Not found a prize with this id"
      });
    }

    const serviceProviderId = employee.serviceProviderId;

    const serviceProvider =
      await this.serviceProviderRepository.findById(serviceProviderId);

    const user = await this.userRepository.findById(employee.userId);

    if (user.solecas < prize.solecasValue) {
      return this.exceptionAdapter.badRequest({
        message: "The user does not have enough solecas to redeem this prize"
      });
    }

    const solecasRemaining = user.solecas - prize.solecasValue;

    const userSolecasUpdated = await this.userRepository.updatedSolecas(
      user.id,
      solecasRemaining
    );

    return await this.prizeOrderRepository.create({
      employeeId,
      moneyValue: prize.moneyValue,
      operatorId: serviceProvider.operatorId,
      prizeId,
      serviceProviderId,
      solecasValue: prize.solecasValue,
      solecasRemaining: userSolecasUpdated
    });
  }
}
