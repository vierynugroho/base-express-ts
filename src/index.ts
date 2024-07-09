import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import productRoute from './app/Product/route';
import { notFoundHandler, globalErrorHandler } from './middlewares/error-handlers.mw';

const app = express();
const port = process.env.PORT || 2000;

app.use(morgan('dev'));
app.use(
	cors({
		origin: '*',
		methods: 'GET, POST, PUT, DELETE, PATCH',
		allowedHeaders: 'Content-Type, Authorization, Accept, Accept-Language, Accept-Encoding',
		exposedHeaders: 'Content-Type, Authorization, Accept, Accept-Language, Accept-Encoding',
		maxAge: 3600,
	})
);
app.use(express.json());
app.use('/api/v1/products', productRoute);
app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(port, (): void => {
	console.log('===========================================');
	console.log(`Server running on http://localhost:${port}`);
	console.log('===========================================');
});
