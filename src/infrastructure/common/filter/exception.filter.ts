import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { LoggerService } from '../../logger/logger.service'
import { IFormatExceptionMessage } from 'src/domain/exceptions/exceptions.interface'

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR
    const error =
      exception instanceof HttpException
        ? (exception.getResponse() as IFormatExceptionMessage)
        : {
            type: (exception as Error).name,
            message: (exception as Error).message,
          }

    const responseData = {
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
    error: IFormatExceptionMessage,
    status: number,
    exception: HttpException,
  ) {
    if (status === 500) {
      this.logger.error(
        `End Request for ${request.path}`,
        `method=${request.method} status=${status} type=${error.type} message=${error.message}`,
        exception.stack,
      )
    } else {
      this.logger.warn(
        `End Request for ${request.path}`,
        `method=${request.method} status=${status} type=${error.type} message=${error.message}`,
      )
    }
  }
}
