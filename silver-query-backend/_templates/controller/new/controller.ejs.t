---
to: src/controllers/<%= name %>Controller.ts
---
import { OK, BAD_REQUEST, NOT_FOUND } from 'http-status-codes';
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import { container } from 'tsyringe';
import { plainToClass } from 'class-transformer';
import passport from "passport";
import validationMiddleware from '../middleware/validation';


@Controller('api/<%= h.changeCase.lower(name)%>')
export class <%= name %>Controller 
{

    constructor()
    {

    }

}