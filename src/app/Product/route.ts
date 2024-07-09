import { Router } from 'express';
import ProductController from './controller';

const router = Router();
router.route('/').get(ProductController.get).post(ProductController.post);
router.route('/:id').get(ProductController.getOne).patch(ProductController.update).delete(ProductController.delete);
export default router;
