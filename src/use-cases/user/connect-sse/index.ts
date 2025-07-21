import { SSEAdapter } from "@domain/adapters/sse";
import { Injectable } from "@nestjs/common";
import { Response } from "express";

interface SSEConnectUseCaseParams {
  userId: string;
  res: Response;
}

@Injectable()
export class SSEConnectUseCase {
  constructor(private readonly sseAdapter: SSEAdapter) {}

  execute(params: SSEConnectUseCaseParams): void {
    const { res, userId } = params;

    this.sseAdapter.addClient(userId, res);
  }
}
