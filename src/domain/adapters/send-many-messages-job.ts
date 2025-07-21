export interface SendManyMessagesJobParams {
  content: string;
  fromUserId: string;
  toUserIds: string[];
}

export abstract class SendManyMessagesJobAdapter {
  abstract sendManyMessagesJob(data: SendManyMessagesJobParams): Promise<void>;
}
