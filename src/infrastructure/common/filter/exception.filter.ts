import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'

import { Request, Response } from 'express'

import { IFormatExceptionResponse } from '@domain/exceptions/exceptions.interface'
import { ILogger } from '@domain/logger/logger.interface'

function isFormatExceptionMessage(
  value: unknown,
): value is IFormatExceptionResponse['error'] {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    'statusCode' in value &&
    'message' in value
  )
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: ILogger) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR
    const rawResponse =
      exception instanceof HttpException ? exception.getResponse() : null
    const error = isFormatExceptionMessage(rawResponse)
      ? rawResponse
      : {
          type: exception.name,
          message: exception.message,
        }

    const responseData: IFormatExceptionResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: error,
    }

    this.logMessage(request, error, status, exception)

    response.status(status).json(responseData)
  }

  private logMessage(
    request: Request,
    error: IFormatExceptionResponse['error'],
    status: number,
    exception: HttpException,
  ) {
    const ip = this.getIP(request)

    if (status === 500) {
      this.logger.error(
        `End Request for ${request.path}`,
        {
          method: request.method,
          ip,
          status,
          error: error,
        },
        exception.stack,
      )
    } else {
      this.logger.warn(`End Request for ${request.path}`, {
        method: request.method,
        ip,
        status,
        error: error,
      })
    }
  }

  private getIP(request: Request): string {
    let ip: string
    const ipAddr = request.headers['x-forwarded-for']
    if (ipAddr) {
      const list = typeof ipAddr === 'string' ? ipAddr.split(',') : ipAddr
      ip = list[list.length - 1]
    } else {
      ip = request.ip || ''
    }
    return ip.replace('::ffff:', '')
  }
}
