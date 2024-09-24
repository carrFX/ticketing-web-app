import { UsersController } from '@/controllers/auth.controller';
import { refreshToken } from '@/controllers/refreshToken';
import { CheckRole, VerifyToken } from '@/middlewares/token';
import { uploaderImg } from '@/middlewares/uploader';
import { ValidateRegister } from '@/middlewares/validator/userValidator';
import { Router } from 'express';

export class UsersRouter {
  private router: Router;
  private userController: UsersController;

  constructor() {
    this.userController = new UsersController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/',
      VerifyToken,
      CheckRole,
      this.userController.getUsersData,
    );
    this.router.post(
      '/register',
      ValidateRegister,
      this.userController.registerUser,
    );
    this.router.post('/login', this.userController.loginUser);
    this.router.get('/token', refreshToken);
    this.router.get('/profile', this.userController.getUsersDataById);
    this.router.delete('/logout', this.userController.logoutUser);
    this.router.patch('/delete-avatar', this.userController.deleteAvatar)
    this.router.delete('/delete-user', this.userController.deleteDataUser)
    this.router.patch(
      '/avatar',
      uploaderImg("avatar-","/avatar").single('avatar'),
      this.userController.updateAvatar
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
