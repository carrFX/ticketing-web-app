import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import './cron/cleanExpired';
import cors from 'cors';
import { PORT } from './config';
import cookieParser from 'cookie-parser'; // untuk memparshing data dari cookie
import path from 'path';
import { UsersRouter } from './routers/user.router';
import { EventsRouter } from './routers/event.router';
import { TicketsRouter } from './routers/ticket.router';
import { TransactionRouter } from './routers/transaction.router';
export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cookieParser());
    this.app.use(cors({credentials: true,origin:'http://localhost:3000'}));
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use('/api/public', express.static(path.join(__dirname, '../public')))
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error : ', err.stack);
          res.status(500).send('Error !');
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    const usersRouter = new UsersRouter();
    const eventsRouter = new EventsRouter();
    const ticketsRouter = new TicketsRouter();
    const transactionRouter = new TransactionRouter();

    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, it's Purwadhika Student API!`);
    });

    this.app.use('/api/users', usersRouter.getRouter());
    this.app.use('/api/events', eventsRouter.getRouter());
    this.app.use('/api/tickets', ticketsRouter.getRouter());
    this.app.use('/api/transaction', transactionRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/api`);
    });
  }
}
