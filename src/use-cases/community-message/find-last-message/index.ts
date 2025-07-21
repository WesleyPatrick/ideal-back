import { ExceptionsAdapter } from "@domain/adapters/exceptions";
import { PaginatedEntity } from "@domain/entities/pagination";
import {
  CommunityMessageRepository,
  FindLastMessageParams,
  FindLastMessageResponse
} from "@domain/repositories/community-message";
import { EmployeeRepository } from "@domain/repositories/employee";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FindLastCommunityMessageUseCase {
  constructor(
    private readonly communityMessageRepository: CommunityMessageRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly exceptionAdapter: ExceptionsAdapter
  ) {}

  async execute(
    params: FindLastMessageParams
  ): Promise<PaginatedEntity<FindLastMessageResponse> | void> {
    const { employeeId, page, pageSize } = params;

    const employee = await this.employeeRepository.findById(employeeId);

    if (!employee) {
      return this.exceptionAdapter.notFound({
        message: "Not found a employee with this id"
      });
    }

    if (!employee.communityId) {
      return this.exceptionAdapter.badRequest({
        message: "This employee does not belong a community"
      });
    }

    return await this.communityMessageRepository.findLastMessage({
      employeeId,
      page,
      pageSize
    });
  }
}
