import { HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common'

import { NextFunction, Request, Response } from 'express'

import { IMaintenanceConfig } from '@domain/config/maintenance.interface'
import { IFormatExceptionResponse } from '@domain/exceptions/exceptions.interface'

@Injectable()
export class MaintenanceMiddleware implements NestMiddleware {
  constructor(
    @Inject(IMaintenanceConfig)
    private readonly maintenanceConfig: IMaintenanceConfig,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    if (this.maintenanceConfig.isMaintenanceMode()) {
      const responseData: IFormatExceptionResponse = {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        timestamp: new Date().toISOString(),
        path: req.url,
        error: {
          type: 'MAINTENANCE_MODE',
          message: this.maintenanceConfig.getMaintenanceMessage(),
        },
      }

      res.status(HttpStatus.SERVICE_UNAVAILABLE).json(responseData)
      return
    }

    next()
  }
}
