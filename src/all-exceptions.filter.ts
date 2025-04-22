import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
//import { Prisma } from "_generatedXXX/prisma";
//import { PrismaClientKnownRequestError } from "_generatedXXX/prisma/runtime/library";

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    
    let status = exception instanceof HttpException
      ? exception.getStatus()
      : 500; 

    const response = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';

    let message =
      typeof response === 'string'
        ? response
        : (response as any).message || 'Errore sconosciuto';

    let error =
      typeof response === 'string'
        ? response
        : (response as any).error || 'Internal Server Error';


    if (exception instanceof BadRequestException) {
      console.log('gestisco BAD')
      const res: any = exception.getResponse();
      if (res.message && Array.isArray(res.message)) {
        status = 422; // cambio da 400 a 422
        error = 'Validation Error'
      } 
    } 

    res.status(status).json({
      success: false,
      message,
      data: null,
      error,
    });
  }
}
