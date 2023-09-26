import { describe, expect, test } from '@jest/globals';
import { Resource } from './resource';
import { Router, application } from 'express';

describe.only('class Resource', () => {
  class UserResource extends Resource {}

  describe('.prototype.getRouter', () => {
    test('exists', () => {
      expect(UserResource.prototype.getRouter).toBeDefined();
    });

    test('callable', () => {
      expect(typeof UserResource.prototype.getRouter).toBe('function');
    });

    // how to check
    test('return exress router', () => {
      expect(typeof new UserResource().getRouter()).toBe('function');
    });
  });
});
