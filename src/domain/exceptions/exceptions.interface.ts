export interface IFormatExceptionMessage {
  type: string
  message: string
}

export interface IFormatExceptionResponse {
  statusCode: number
  timestamp: string // ISO date string
  path: string
  error: {
    type: string
    message: string
  }
}

export const IException = Symbol('IException')
export interface IException {
  badRequestException(data: IFormatExceptionMessage): never
  internalServerErrorException(data?: IFormatExceptionMessage): never
  forbiddenException(data?: IFormatExceptionMessage): never
  unauthorizedException(data?: IFormatExceptionMessage): never
  notFoundException(data?: IFormatExceptionMessage): never
}
