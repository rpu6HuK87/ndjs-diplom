import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common'

export const isEnabledFlag = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return !request.isAuthenticated() || request.user.role === 'client' ? true : false
})
export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return request.user
})
export const isPublicRoute = () => SetMetadata('isPublic', true)

export const isWSRoute = () => SetMetadata('isWSRoute', true)
