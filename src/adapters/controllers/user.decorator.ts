import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export interface IUser {
  userId: string
}

export const userFactory = (
  data: keyof IUser | undefined,
  ctx: ExecutionContext,
): IUser | unknown => {
  const request = ctx.switchToHttp().getRequest()
  const user: IUser = request.user

  return data ? user?.[data] : user
}

/**
 * Custom decorator to retrieve the user object from the request.
 * @param data - Optional property of the user object to retrieve.
 * @param ctx - The execution context of the request.
 * @returns The user object or a specific property of the user object.
 */
export const User = createParamDecorator(userFactory)
