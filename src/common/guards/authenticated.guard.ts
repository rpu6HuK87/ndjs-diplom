import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { WsException } from '@nestjs/websockets'

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler())
    if (isPublic) return true

    const isWSRoute = this.reflector.get<boolean>('isWSRoute', context.getHandler())
    const request = isWSRoute ? context.switchToWs().getClient() : context.switchToHttp().getRequest()
    //console.log(request)

    if (!request.isAuthenticated()) {
      if (isWSRoute) throw new WsException('Forbidden')
      else throw new UnauthorizedException()
    }

    return request.isAuthenticated()
  }
}
