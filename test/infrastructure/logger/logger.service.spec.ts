import { Logger } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { LoggerService } from '@infrastructure/logger/logger.service'

describe('LoggerService', () => {
  let loggerService: LoggerService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [LoggerService],
    }).compile()

    loggerService = moduleRef.get<LoggerService>(LoggerService)
  })

  it('should be defined', () => {
    expect(loggerService).toBeDefined()
  })

  it('should log debug message in development environment', () => {
    const debugSpy = jest.spyOn(loggerService, 'debug')

    process.env.NODE_ENV = 'local'
    loggerService.debug('Context', 'Message')

    expect(debugSpy).toHaveBeenCalled()
    expect(debugSpy.mock.calls[0]).toEqual(['Context', 'Message'])

    process.env.NODE_ENV = 'production'
    loggerService.debug('Context', 'Message')
    expect(debugSpy).toHaveBeenCalledTimes(2)

    debugSpy.mockRestore()
  })

  it('should log info message', () => {
    const logSpy = jest.spyOn(loggerService, 'log')

    loggerService.log('Context', 'Message')

    expect(logSpy).toHaveBeenCalled()
    expect(logSpy.mock.calls[0]).toEqual(['Context', 'Message'])

    logSpy.mockRestore()
  })

  it('should log error message', () => {
    const errorSpy = jest.spyOn(loggerService, 'error')

    loggerService.error('Context', 'Message', 'Trace')

    expect(errorSpy).toHaveBeenCalled()
    expect(errorSpy.mock.calls[0]).toEqual(['Context', 'Message', 'Trace'])

    errorSpy.mockRestore()
  })

  it('should log warn message', () => {
    const warnSpy = jest.spyOn(loggerService, 'warn')

    loggerService.warn('Context', 'Message')

    expect(warnSpy).toHaveBeenCalled()
    expect(warnSpy.mock.calls[0]).toEqual(['Context', 'Message'])

    warnSpy.mockRestore()
  })

  it('should log verbose message in development environment', () => {
    const verboseSpy = jest.spyOn(loggerService, 'verbose')

    process.env.NODE_ENV = 'local'
    loggerService.verbose('Context', 'Message')

    expect(verboseSpy).toHaveBeenCalled()
    expect(verboseSpy.mock.calls[0]).toEqual(['Context', 'Message'])

    process.env.NODE_ENV = 'production'
    loggerService.debug('Context', 'Message')
    expect(verboseSpy).toHaveBeenCalledTimes(1)

    verboseSpy.mockRestore()
  })
})
