import { Request, Response, NextFunction } from 'express';
import { AppError } from '../error/AppError';
import { sendDiscordAlert } from '../utils/discord';

interface ErrorResponse {
  success: boolean;
  code: number;
  message: string;
  data: object;
}

export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    console.error('Unexpected Error:', err);
  }

  // 500 에러 시 디스코드 알림 발송
  if (statusCode === 500) {
    const alertMessage = `🚨 **500 Internal Server Error**\n\n**Error**: ${message}\n**Path**: ${req.method} ${req.originalUrl}\n**Time**: ${new Date().toISOString()}`;
    // 비동기로 실행 (응답 속도 저하 방지)
    sendDiscordAlert(alertMessage).catch((e) => console.error('Discord Alert Error:', e));
  }

  const response: ErrorResponse = {
    success: false,
    code: statusCode,
    message,
    data: {}, // 항상 빈 객체 포함
  };

  res.status(statusCode).json(response);
};

