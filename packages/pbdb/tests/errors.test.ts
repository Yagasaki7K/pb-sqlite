import { describe, expect, it } from 'vitest';
import { PbSqliteError, PbSqliteNotReadyError } from '../src/core/errors';

describe('error hierarchy', () => {
  it('preserves a useful typed base error', () => {
    const error = new PbSqliteNotReadyError();
    expect(error).toBeInstanceOf(PbSqliteError);
    expect(error.name).toBe('PbSqliteNotReadyError');
    expect(error.message).toMatch(/not initialized/i);
  });
});
