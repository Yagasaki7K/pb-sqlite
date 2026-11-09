import { describe, expect, it } from 'vitest';
import { PbdbError, PbdbNotReadyError } from '../src/core/errors';

describe('error hierarchy', () => {
  it('preserves a useful typed base error', () => {
    const error = new PbdbNotReadyError();
    expect(error).toBeInstanceOf(PbdbError);
    expect(error.name).toBe('PbdbNotReadyError');
    expect(error.message).toMatch(/not initialized/i);
  });
});
