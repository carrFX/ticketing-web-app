import { EventController } from '@/controllers/event.controller';
import { uploaderImg } from '@/middlewares/uploader';
import { ValidateCreateEvent } from '@/middlewares/validator/eventValidator';
import { Router } from 'express';

export class EventsRouter {
  private router: Router;
  private eventController: EventController;

  constructor() {
    this.eventController = new EventController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/get-all', this.eventController.getAllEvents);
    this.router.post('/create', uploaderImg("event-","/pict").single('pict'),ValidateCreateEvent,this.eventController.createEvents,);
    this.router.get('/:id', this.eventController.getEventsById);
    this.router.get('/category', this.eventController.getEventsByCategory);
    this.router.post('/event-active', this.eventController.getAllEventsActive);
  }

  getRouter(): Router {
    return this.router;
  }
}
