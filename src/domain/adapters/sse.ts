import { Response } from "express";

export enum EventType {
  CREDIT_UPDATE = "CREDIT_UPDATE",
  NEW_MESSAGE = "NEW_MESSAGE",
  READ_MESSAGES = "READ_MESSAGES",
  CLASS_FINISHED = "CLASS_FINISHED",
  CLASS_STARTED = "CLASS_STARTED"
}

export interface NotifyUserParams {
  userId: string;
  eventType: EventType;
  payload: object | [];
}

export abstract class SSEAdapter {
  abstract addClient(userId: string, res: Response): void;
  abstract notifyUser(params: NotifyUserParams): void;
  abstract getConnectedUsers(): string[];
}
