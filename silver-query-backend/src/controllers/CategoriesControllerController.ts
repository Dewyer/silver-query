import { OK, BAD_REQUEST, NOT_FOUND } from 'http-status-codes';
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import { container } from 'tsyringe';
import { plainToClass } from 'class-transformer';
import validationMiddleware from '../middleware/validation';


@Controller('api/category')
export class CategoriesControllerController 
{

    constructor()
    {

    }

    @Get("all")
    private async getWorkerStatus(req: Request, res: Response)
    {
        return res.status(OK).end();
    }

}