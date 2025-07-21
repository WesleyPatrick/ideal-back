import { Injectable } from "@nestjs/common";
import { CreateServiceProviderUseCase } from "@use-cases/service-provider/create";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { parse } from "csv-parse/sync";
import { CreateServiceProviderUseCaseParams } from "@use-cases/service-provider/create";

@Injectable()
export class CreateServiceProviderWithCsvUseCase {
  constructor(
    private readonly createServiceProviderUseCase: CreateServiceProviderUseCase,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(fileBuffer: Buffer, operatorId: string): Promise<void> {
    try {
      const csvData = fileBuffer.toString("utf-8");

      const records: CreateServiceProviderUseCaseParams[] = parse(csvData, {
        columns: true,
        skip_empty_lines: true
      });

      if (records.length === 0) {
        return this.exceptionsAdapter.badRequest({
          message: "No records found in the CSV file"
        });
      }

      for (const record of records) {
        await this.createServiceProviderUseCase.create(
          {
            ...record,
            operatorId
          },
          null
        );
      }
    } catch (error) {
      return this.exceptionsAdapter.badRequest({
        message: error.message
      });
    }
  }
}
