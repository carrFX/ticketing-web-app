import { TicketController } from "@/controllers/ticket.controller";
import { Router } from "express";


export class TicketsRouter {
  private router: Router;
  private ticketController: TicketController;

  constructor() {
    this.ticketController = new TicketController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/create', this.ticketController.createTickets);
    this.router.get('/active', this.ticketController.getAllTicketsActive);
    this.router.get('/by/:eventId', this.ticketController.getTicketsByEventId);
    this.router.get('/:id', this.ticketController.getTicketById)
  }

  getRouter(): Router {
    return this.router;
  }
}
