import { NextFunction, Request, Response } from 'express';
import HttpException from '../models/HttpException';
declare function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction): void;
export default errorMiddleware;
