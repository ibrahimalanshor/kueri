import express from 'express';
import { Server } from 'http';

export class App {
  private application: express.Application = express();
  private server: Server;
  private port: number = 3000;

  setPort(port: number) {
    this.port = port;
  }

  listen(cb?: Function) {
    this.server = this.application.listen(this.port, () => {
      cb
        ? cb.call(null, this.port)
        : console.log(`app running at ${this.port}`);
    });
  }

  stop() {
    this.server.close();
  }
}
