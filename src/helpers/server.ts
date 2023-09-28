import express, { Application } from 'express';

export function createServer(): Application {
  const server = express();

  return server;
}
