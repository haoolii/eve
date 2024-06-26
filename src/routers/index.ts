import { Router } from "express";
import { router as cryptoRouter } from "./crypto-router";
import { router as fundRouter } from "./fund-router";

const router: Router = Router();

router.use("/crypto", cryptoRouter);
router.use("/fund", fundRouter);

export { router };
