export interface StanderedInterface {
    success:boolean,
    status:number,
    error?:string,
    message?:string
}

export enum StatusCode {
  // 1xx – Informational
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,

  // 2xx – Success
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  // 3xx – Redirection
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  NOT_MODIFIED = 304,

  // 4xx – Client Error
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,

  // 5xx – Server Error
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
