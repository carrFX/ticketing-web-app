import { TransactionController } from "@/controllers/transaction.controller";
import { Router } from "express";


export class TransactionRouter {
  private router: Router;
  private transactionController: TransactionController;

  constructor() {
    this.transactionController = new TransactionController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.patch('/buy-tickets', this.transactionController.buyTickets);
    this.router.get('/', this.transactionController.getUserBuyTickets)
    this.router.post('/coupons', this.transactionController.getCouponsUser)
    this.router.post('/points', this.transactionController.getPointUsers)
  }

  getRouter(): Router {
    return this.router;
  }
}