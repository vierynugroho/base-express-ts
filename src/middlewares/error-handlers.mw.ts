import express from 'express';
import { StatusError } from './interfaces';

export const notFoundHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const error = new Error(`${req.method} ${req.originalUrl} not found`) as StatusError;
	error.status = 404;
	next(error);
};

export const globalErrorHandler = (error: StatusError, req: express.Request, res: express.Response, _next: express.NextFunction) => {
	res.status(error.status || 500);
	res.json({
		status: false,
		message: error.message.split('\n')[error.message.split('\n').length - 1],
	});
};
