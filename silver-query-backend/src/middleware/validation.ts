import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import { BAD_REQUEST } from 'http-status-codes';

function validationMiddleware<T>(type: any): express.RequestHandler
{
    return (req, res, next) =>
    {
        validate(plainToClass(type, req.body))
            .then((errors: ValidationError[]) =>
            {
                if (errors.length > 0)
                {
                    res.status(BAD_REQUEST).json(errors);
                } else
                {
                    next();
                }
            });
    };
}

export default validationMiddleware;