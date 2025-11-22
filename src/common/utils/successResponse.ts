export class SuccessResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data?: T;

  constructor(code: number, message: string, data?: T) {
    this.success = true;
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static ok<T>(data: T, message: string = 'Success'): SuccessResponse<T> {
    return new SuccessResponse(200, message, data);
  }

  static created<T>(data: T, message: string = 'Created'): SuccessResponse<T> {
    return new SuccessResponse(201, message, data);
  }

  static noContent(message: string = 'No Content'): SuccessResponse<null> {
    return new SuccessResponse(204, message);
  }
}

