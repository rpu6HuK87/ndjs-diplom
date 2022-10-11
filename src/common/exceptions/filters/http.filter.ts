import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	public catch(exception: any, host: ArgumentsHost) {
		const response = host.switchToHttp().getResponse()
		const statusCode = exception.getStatus()

		response.status(statusCode).json({
			timestamp: new Date().toISOString(),
			status: "fail",
			data: exception.message,
			code: statusCode
		})
	}
}