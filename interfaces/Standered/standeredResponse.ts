export interface ApiResponse<T = undefined> {
  success: boolean;
  status: number;
  error?: string;
  message?: string;
  data?: T;
}

export type StanderedInterface<T = undefined> = ApiResponse<T>;

export enum StatusCode {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

export enum StatusText {
  CONTINUE = "Continue",
  SWITCHING_PROTOCOLS = "Switching Protocols",
  OK = "OK",
  CREATED = "Created",
  ACCEPTED = "Accepted",
  NO_CONTENT = "No Content",
  MOVED_PERMANENTLY = "Moved Permanently",
  FOUND = "Found",
  NOT_MODIFIED = "Not Modified",
  BAD_REQUEST = "Bad Request",
  UNAUTHORIZED = "Unauthorized",
  FORBIDDEN = "Forbidden",
  NOT_FOUND = "Not Found",
  METHOD_NOT_ALLOWED = "Method Not Allowed",
  CONFLICT = "Conflict",
  UNPROCESSABLE_ENTITY = "Unprocessable Entity",
  INTERNAL_SERVER_ERROR = "Internal Server Error",
  NOT_IMPLEMENTED = "Not Implemented",
  BAD_GATEWAY = "Bad Gateway",
  SERVICE_UNAVAILABLE = "Service Unavailable",
}
