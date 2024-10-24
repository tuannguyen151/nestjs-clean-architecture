export interface IFormatExceptionMessage {
  type: string
  message: string
}

export const EXCEPTIONS = 'IException'
export interface IException {
  badRequestException(data: IFormatExceptionMessage): void
  internalServerErrorException(data?: IFormatExceptionMessage): void
  forbiddenException(data?: IFormatExceptionMessage): void
  unauthorizedException(data?: IFormatExceptionMessage): void
  notFoundException(data?: IFormatExceptionMessage): void
}
