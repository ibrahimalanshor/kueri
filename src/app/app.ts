import express from 'express';
import { Server } from 'http';

export class App {
  application: express.Application = express();
  server: Server;

  listen() {
    this.server = this.application.listen(3000);
  }

  stop() {
    this.server.close();
  }
}
