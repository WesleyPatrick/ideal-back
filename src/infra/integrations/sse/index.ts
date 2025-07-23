import { NotifyUserParams, SSEAdapter } from "@domain/adapters/sse";
import { Injectable } from "@nestjs/common";
import { Response } from "express";
import { Writable } from "node:stream";

@Injectable()
export class SSEIntegration implements SSEAdapter {
  private clients: Map<string, Writable> = new Map();

  addClient(userId: string, res: Response): void {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Cache-Control");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.flushHeaders();

    this.clients.set(userId, res);
    res.write("event: open\n\n");
    console.log(`📡 ${userId} conectado ao SSE`);

    res.on("close", () => {
      console.log(`🔌 ${userId} desconectado do SSE`);
      this.clients.delete(userId);
      res.end();
    });
  }

  notifyUser(params: NotifyUserParams): void {
    const { eventType, payload, userId } = params;

    const client = this.clients.get(userId);

    if (client) {
      const eventData = {
        type: eventType,
        data: payload
      };
      client.write(`data: ${JSON.stringify(eventData)}\n\n`);
    }
  }

  getConnectedUsers(): string[] {
    return Array.from(this.clients.keys());
  }
}
