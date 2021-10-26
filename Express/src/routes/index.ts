import { Router } from "express";
import AuthRouter from "./auth";

const baseRouter = (passport) => {
  const router = Router();

  router.use("/auth", AuthRouter(passport));

  return router;
};

export default baseRouter;
