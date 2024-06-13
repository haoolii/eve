import { Router } from 'express';
import { router as cryptoRouter } from './crypto-router';

const router: Router = Router();

router.use('/crypto', cryptoRouter);

export { router }