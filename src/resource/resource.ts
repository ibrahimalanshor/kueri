import { Router } from 'express';

export abstract class Resource {
  getRouter(): Router {
    return Router();
  }
}
