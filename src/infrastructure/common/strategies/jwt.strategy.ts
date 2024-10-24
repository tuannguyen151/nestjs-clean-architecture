import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { passportJwtSecret } from 'jwks-rsa'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { EnvironmentConfigService } from 'src/infrastructure/config/environment/environment-config.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly environmentConfigService: EnvironmentConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: environmentConfigService.getAwsCognitoAuthorityUrl(),
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri:
          environmentConfigService.getAwsCognitoAuthorityUrl() +
          '/.well-known/jwks.json',
      }),
    })
  }

  async validate(payload: { sub: string }) {
    return { userId: payload.sub }
  }
}
