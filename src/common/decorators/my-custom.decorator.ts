import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const isEnabledFlag = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return !request.isAuthenticated() || request.user.role === 'client'
      ? true
      : false
  }
)
