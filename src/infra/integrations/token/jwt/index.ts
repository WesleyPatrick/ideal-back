import { TokenAdapter, TokenPayload } from "@domain/adapters/token";
import { Injectable } from "@nestjs/common";
import { JwtService as JWT } from "@nestjs/jwt";
import { env } from "process";

export interface TokenOptions {
  issuer: string;
  secret: string;
  expiresIn?: number;
}
@Injectable()
export class JwtIntegration implements TokenAdapter {
  constructor(private jwt: JWT) {}

  generateToken(payload: TokenPayload, expiresIn?: Date): Promise<string> {
    const options: TokenOptions = {
      issuer: "login-apr",
      secret: env.JWT_SECRET
    };

    if (expiresIn) {
      options.expiresIn = this.#calculateSecondsUntil(expiresIn);
    }

    return this.jwt.signAsync(payload, options);
  }

  getPayloadFromToken(token: string): Promise<TokenPayload | null> {
    try {
      return this.jwt.verify(token, {
        issuer: "login-apr",
        secret: env.JWT_SECRET
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  #calculateSecondsUntil(date: Date): number {
    const now = new Date();
    return Math.floor((date.getTime() - now.getTime()) / 1000);
  }
}
