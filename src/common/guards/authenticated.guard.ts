import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler()
    )
    if (isPublic) return true

    const request = context.switchToHttp().getRequest()
    if (!request.isAuthenticated()) throw new UnauthorizedException()
    return request.isAuthenticated()
  }
}
