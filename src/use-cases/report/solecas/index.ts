import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { EmployeeRepository } from "@domain/repositories/employee";
import { OperatorRepository } from "@domain/repositories/operator";
import {
  DefaultReportParams,
  ReportRepository
} from "@domain/repositories/report";
import { ServiceProviderRepository } from "@domain/repositories/service-provider";
import { Injectable, StreamableFile } from "@nestjs/common";
import { stringify } from "csv-stringify/sync";

@Injectable()
export class SolecasReportUseCase {
  constructor(
    private readonly operatorRepository: OperatorRepository,
    private readonly serviceProviderRepository: ServiceProviderRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly reportRepository: ReportRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(params: DefaultReportParams): Promise<StreamableFile | void> {
    const { operatorId, employeeId, serviceProviderId } = params;

    if (serviceProviderId && !operatorId) {
      return this.exceptionAdapter.badRequest({
        message: "A operator must be passed on"
      });
    }

    if (employeeId && !serviceProviderId) {
      return this.exceptionAdapter.badRequest({
        message: "A service provider must be passed on"
      });
    }

    if (operatorId) {
      const operator = await this.operatorRepository.findById(operatorId);

      if (!operator) {
        return this.exceptionAdapter.notFound({
          message: "Not found a operator with this id"
        });
      }
    }

    if (serviceProviderId) {
      const serviceProvider =
        await this.serviceProviderRepository.findById(serviceProviderId);

      if (!serviceProvider) {
        return this.exceptionAdapter.notFound({
          message: "Not found a service provider with this id"
        });
      }

      if (serviceProvider.operatorId !== operatorId) {
        return this.exceptionAdapter.badRequest({
          message: "This service provider does not belong this operator"
        });
      }
    }

    if (employeeId) {
      const employee = await this.employeeRepository.findById(employeeId);

      if (!employee) {
        return this.exceptionAdapter.notFound({
          message: "Not found a employee with this id"
        });
      }

      if (employee.serviceProviderId !== serviceProviderId) {
        return this.exceptionAdapter.badRequest({
          message: "This employee does not belong this service provider"
        });
      }
    }

    const data = await this.reportRepository.solecas({
      operatorId,
      employeeId,
      serviceProviderId
    });

    const csv = stringify(data, {
      header: true,
      columns: [
        {
          key: "operatorName",
          header: "Nome da Operadora"
        },
        {
          key: "serviceProviderName",
          header: "Nome da Web Prestadora"
        },
        {
          key: "employeeName",
          header: "Nome do Colaborador"
        },
        {
          key: "activitiesHitCount",
          header: "Quantidade de Atividades Acertadas"
        },
        {
          key: "averageTest",
          header: "Média Geral das Provas"
        },
        {
          key: "actualSolecasCount",
          header: "Quantidade de Solecas"
        },
        {
          key: "totalSolecasSpent",
          header: "Total de Solecas Gastas"
        }
      ]
    });

    const buffer = Buffer.from(csv, "utf-8");

    return new StreamableFile(buffer, {
      type: "text/csv",
      disposition: `attachment; filename="relatorio_solecas.csv"`
    });
  }
}
