import { sign, verify } from "hono/jwt";
import { Context } from "hono";


export const jwtService = {
  async signQueryByQueryId(queryId: string, c:Context): Promise<string> {
    try {
      const secret = c.env.JWT_SECRET;
      console.log(`JWT_SECRET: ${secret}`);
      const issueTime = Math.floor(Date.now() / 1000);

      const token = await sign(
        {
          sub: "query_deletion",
          jti: queryId,
          iat: issueTime,
          exp: issueTime + 31536000,
          iss: "IntelliQuery",
        },
        secret
      );
      return token;   
    } catch (error) {
      throw new Error(`Error in signQueryByQueryId: ${error}`); 
    }
  },

  async verifyAndExtractQueryId(token: string, c:Context): Promise<string> {
    const secret = c.env.JWT_SECRET;
    try{
      const payload = await verify(token, secret);

      if (payload.sub !== "query_deletion") {
        throw new Error("Invalid token purpose");
      }

      if (!payload.iss || payload.iss !== 'IntelliQuery') {
        throw new Error("Invalid token issuer");
      }

      if (!payload.jti || typeof payload.jti !== "string") {
        throw new Error("Invalid token");
      }

      return payload.jti;
    } catch (error) {
      throw new Error(`Error in verifyAndExtractQueryId: ${error}`);
    }
  }
}

