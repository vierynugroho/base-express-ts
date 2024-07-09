import { ProductInterface } from './interfaces';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

const prisma = new PrismaClient();

class Product {
	static async get(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			// pagination
			const search = (req.query.search || '') as string;
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;
			const offset = (page - 1) * limit;

			const products = await prisma.product.findMany({
				where: {
					OR: [
						{
							id: {
								contains: search,
								mode: 'insensitive',
							},
						},
						{
							name: {
								contains: search,
								mode: 'insensitive',
							},
						},
					],
				},
				orderBy: {
					name: 'asc',
				},
				skip: offset,
				take: limit,
			});

			const countProduct = await prisma.product.count();

			res.status(200).json({
				status: true,
				message: products.length > 0 ? 'products data retrieved succesfully' : 'products data is empty',
				total: countProduct,
				pagination: {
					pageItems: products.length,
					currentPage: page,
					totalPages: Math.ceil(countProduct / limit),
					nextPage: page < Math.ceil(countProduct / limit) ? page + 1 : null,
					prevPage: page > 1 ? page - 1 : null,
				},
				data: products,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id: string = req.params.id;
			const product = await prisma.product.findUnique({
				where: {
					id,
				},
			});

			if (!product) {
				return next(createHttpError(404, { message: 'Product not found' }));
			}

			res.status(200).json({
				status: true,
				message: 'product data retrieved succesfully',
				data: product,
			});
		} catch (error) {
			next(error);
		}
	}

	static async post(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { name, price, stock, description }: ProductInterface = req.body;

			const newProduct = await prisma.product.create({
				data: {
					name,
					price,
					stock,
					description,
				},
			});

			res.status(201).json({
				status: true,
				message: 'products data created succesfully',
				data: newProduct,
			});
		} catch (error) {
			next(error);
		}
	}

	static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id: string = req.params.id;
			const { name, price, stock, description }: ProductInterface = req.body;

			const product = await prisma.product.findUnique({
				where: {
					id,
				},
			});

			if (!product) {
				return next(createHttpError(404, { message: 'Product not found' }));
			}

			const updatedProduct = await prisma.product.update({
				where: {
					id,
				},
				data: {
					name,
					price,
					stock,
					description,
				},
			});

			res.status(200).json({
				status: true,
				message: 'product data updated succesfully',
				data: updatedProduct,
			});
		} catch (error) {
			next(error);
		}
	}

	static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id: string = req.params.id;

			const product = await prisma.product.findUnique({
				where: {
					id,
				},
			});

			if (!product) {
				return next(createHttpError(404, { message: 'Product not found' }));
			}

			await prisma.product.delete({
				where: {
					id,
				},
			});

			res.status(200).json({
				status: true,
				message: 'product data deleted succesfully',
			});
		} catch (error) {
			next(error);
		}
	}
}

export default Product;
