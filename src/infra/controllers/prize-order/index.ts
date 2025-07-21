import { PrizeOrder } from "@domain/entities/prize-order";
import { RoleValue } from "@domain/entities/roles";
import { AuthWithRoleDecorator } from "@infra/commons/decorators/role-with-auth";
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CreatePrizeOrderUseCase } from "@use-cases/prize-order/create";
import { CreatePrizeOrderDTO } from "./dtos/create";
import { CreatePrizeOrderResposes } from "@infra/config/swagger/responses/prize-order/create";
import { PaginatedDTO } from "@infra/utils/paginated-dto";
import { PaginatedEntity } from "@domain/entities/pagination";
import {
  FindAllPrizeOrderResponse,
  FindEmployeesByPrizeIdResponse,
  FindOperatorsByPrizeIdResponse,
  FindServicesProvidersByPrizeIdResponse
} from "@domain/repositories/prize-order";
import { FindAllPrizeOrderUseCase } from "@use-cases/prize-order/find-all";
import { FindAllPrizeOrderResponses } from "@infra/config/swagger/responses/prize-order/find-all";
import { FindAllOperatorsByPrizeIdUseCase } from "@use-cases/prize-order/find-operators-by-prizeId";
import { FindServicesProviderParamDTO } from "./dtos/find-services-providers-by-prizeId-and-operatorId";
import { FindServicesProvidersByPrizeIdAndOperatorIdUseCase } from "@use-cases/prize-order/find-services-providers-by-operatorId-and-prizeId";
import { FindServicesProvidersByPrizeIdAndOperatorIdResponses } from "@infra/config/swagger/responses/prize-order/find-services-providers";
import { FindOperatosByPrizeIdResponses } from "@infra/config/swagger/responses/prize-order/find-operators";
import { FindEmployeesParamDTO } from "./dtos/find-employees";
import { FindEmployeesByPrizeIdAndOperatorIdAndServiceProviderIdUseCase } from "@use-cases/prize-order/find-employees";
import { FindEmployeesByPrizeIdAndOperatorIdAndServiceProviderIdResponses } from "@infra/config/swagger/responses/prize-order/find-employees";

@Controller("prize-order")
export class PrizeOrderController {
  constructor(
    private readonly createPrizeOrderUseCase: CreatePrizeOrderUseCase,
    private readonly findAllPrizeOrderUseCase: FindAllPrizeOrderUseCase,
    private readonly findAllOperatorsByPrizeIdUseCase: FindAllOperatorsByPrizeIdUseCase,
    private readonly findAllServicesProviderByPrizeIdAndOperatorIdUseCase: FindServicesProvidersByPrizeIdAndOperatorIdUseCase,
    private readonly findEmployeesByPrizeIdAndOperatorIdAndServiceProviderIdUseCase: FindEmployeesByPrizeIdAndOperatorIdAndServiceProviderIdUseCase
  ) {}

  @Post()
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @CreatePrizeOrderResposes
  async create(@Body() body: CreatePrizeOrderDTO): Promise<PrizeOrder | void> {
    const { employeeId, prizeId } = body;

    return await this.createPrizeOrderUseCase.execute({
      employeeId,
      prizeId
    });
  }

  @Get("/all")
  @AuthWithRoleDecorator([RoleValue.ADMIN])
  @FindAllPrizeOrderResponses
  async findAll(
    @Query() query: PaginatedDTO
  ): Promise<PaginatedEntity<FindAllPrizeOrderResponse> | void> {
    const { page, pageSize } = query;

    return await this.findAllPrizeOrderUseCase.execute({
      page,
      pageSize
    });
  }

  @Get(":prizeId/operators")
  @AuthWithRoleDecorator([RoleValue.ADMIN])
  @FindOperatosByPrizeIdResponses
  async findOperatorsByPrizeId(
    @Param("prizeId") prizeId: string,
    @Query() query: PaginatedDTO
  ): Promise<PaginatedEntity<FindOperatorsByPrizeIdResponse> | void> {
    const { page, pageSize } = query;

    return await this.findAllOperatorsByPrizeIdUseCase.execute(prizeId, {
      page,
      pageSize
    });
  }

  @Get(":prizeId/operator/:operatorId/services-providers")
  @AuthWithRoleDecorator([RoleValue.ADMIN])
  @FindServicesProvidersByPrizeIdAndOperatorIdResponses
  async findServicesProviderByPrizeIdAndOperatorId(
    @Param() param: FindServicesProviderParamDTO,
    @Query() query: PaginatedDTO
  ): Promise<PaginatedEntity<FindServicesProvidersByPrizeIdResponse> | void> {
    const { operatorId, prizeId } = param;
    const { page, pageSize } = query;

    return await this.findAllServicesProviderByPrizeIdAndOperatorIdUseCase.execute(
      prizeId,
      operatorId,
      {
        page,
        pageSize
      }
    );
  }

  @Get(
    ":prizeId/operator/:operatorId/service-provider/:serviceProviderId/employees"
  )
  @FindEmployeesByPrizeIdAndOperatorIdAndServiceProviderIdResponses
  @AuthWithRoleDecorator([RoleValue.ADMIN])
  async findEmployees(
    @Param() param: FindEmployeesParamDTO,
    @Query() query: PaginatedDTO
  ): Promise<PaginatedEntity<FindEmployeesByPrizeIdResponse> | void> {
    const { operatorId, prizeId, serviceProviderId } = param;
    const { page, pageSize } = query;

    return await this.findEmployeesByPrizeIdAndOperatorIdAndServiceProviderIdUseCase.execute(
      {
        operatorId,
        prizeId,
        serviceProviderId,
        page,
        pageSize
      }
    );
  }
}
