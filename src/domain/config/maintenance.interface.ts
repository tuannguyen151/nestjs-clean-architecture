export const IMaintenanceConfig = Symbol('IMaintenanceConfig')
export interface IMaintenanceConfig {
  isMaintenanceMode(): boolean
  getMaintenanceMessage(): string
}
