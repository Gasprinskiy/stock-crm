import { ApiUser } from "../../rest/entity/index.js";

export interface CountResponse {
    count: number;
}

declare global {
    namespace Express {
      export interface Request {
        user: ApiUser;
      }
    }
}