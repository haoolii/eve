import { Router } from "express";
import { router as cryptoRouter } from "./crypto-router";
import { router as fundRouter } from "./fund-router";
import { router as stockRouter } from "./stock-router";

const router: Router = Router();

router.use("/crypto", cryptoRouter);
router.use("/fund", fundRouter);
router.use("/stock", stockRouter);

export { router };
