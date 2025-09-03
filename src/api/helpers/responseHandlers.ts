export interface CustomApiResponse<T = any> {
  success?: boolean;
  status_code: number;
  message: string;
  data?: T;
}

export function successResponse<T>(
  message: string,
  statusCode: number,
  data?: T
): CustomApiResponse<T> {
  return {
    status_code: statusCode,
    message,
    ...(data !== undefined && { data }),
  };
}

export function errorResponse(
  message: string,
  statusCode: number,
  data?: any
): CustomApiResponse {
  return {
    status_code: statusCode,
    message,
    ...(data !== undefined && { data }),
  };

}

export function serverErrorResponse(
  message: string = "Internal Server Error",
  statusCode: number = 500,
  data?: any
): CustomApiResponse {
  return {
    status_code: statusCode,
    message,
    ...(data !== undefined && { data }),
  };
}