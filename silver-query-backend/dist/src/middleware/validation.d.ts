import * as express from 'express';
declare function validationMiddleware<T>(type: any): express.RequestHandler;
export default validationMiddleware;
