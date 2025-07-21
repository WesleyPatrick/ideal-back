import { Injectable } from "@nestjs/common";
import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { parse } from "csv-parse/sync";
import { CreateEmployeeUseCase, CreateEmployeeUseCaseParams } from "../create";

@Injectable()
export class CreateEmployeeWithCsvUseCase {
  constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly exceptionsAdapter: ExceptionsAdapter
  ) {}

  async execute(fileBuffer: Buffer, serviceProviderId: string): Promise<void> {
    try {
      const csvData = fileBuffer.toString("utf-8");

      const records: CreateEmployeeUseCaseParams[] = parse(csvData, {
        columns: true,
        skip_empty_lines: true
      });

      if (records.length === 0) {
        return this.exceptionsAdapter.badRequest({
          message: "No records found in the CSV file"
        });
      }

      for (const record of records) {
        await this.createEmployeeUseCase.create({
          ...record,
          serviceProviderId
        });
      }
    } catch (error) {
      return this.exceptionsAdapter.badRequest({
        message: error.message
      });
    }
  }
}
