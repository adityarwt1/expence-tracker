import { ApiResponse } from "../Standered/standeredResponse";

export interface SignUpPayload {
  token: string;
  email: string;
}

export type SignUpResponse = ApiResponse<SignUpPayload>;
