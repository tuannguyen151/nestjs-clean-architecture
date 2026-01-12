import { Type, applyDecorators } from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger'

class ResponseFormat<T> {
  @ApiProperty()
  isArray!: boolean
  @ApiProperty()
  path!: string
  @ApiProperty()
  duration!: string
  @ApiProperty()
  method!: string

  data!: T
}

const buildResponseSchema = <TModel extends Type>(
  model: TModel,
  isArray: boolean,
) => ({
  isArray: isArray,
  schema: {
    allOf: [
      { $ref: getSchemaPath(ResponseFormat) },
      {
        properties: {
          data: isArray
            ? {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              }
            : {
                $ref: getSchemaPath(model),
              },
          isArray: {
            type: 'boolean',
            default: isArray,
          },
        },
      },
    ],
  },
})

export const ApiResponseType = <TModel extends Type>(
  model: TModel,
  isArray: boolean,
) => {
  return applyDecorators(ApiOkResponse(buildResponseSchema(model, isArray)))
}

export const ApiCreatedResponseType = <TModel extends Type>(
  model: TModel,
  isArray: boolean,
) => {
  return applyDecorators(
    ApiCreatedResponse(buildResponseSchema(model, isArray)),
  )
}
