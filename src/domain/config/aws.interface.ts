export interface IAwsConfig {
  getAwsCognitoUserPoolId(): string
  getAwsCognitoClientId(): string
  getAwsCognitoAuthorityUrl(): string
  getAwsRegion(): string
}
