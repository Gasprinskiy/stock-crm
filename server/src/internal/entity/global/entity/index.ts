import { ApiUser } from "../../rest/entity/index.js";

export interface LoadParams {
  limit: number;
  offset: number;
}

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