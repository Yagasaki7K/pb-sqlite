'use client';
import { createContext } from 'react';
import type { PbSqliteDatabase } from '../core/types';

export interface PbSqliteContextValue {
  db: PbSqliteDatabase;
}

export const PbSqliteContext = createContext<PbSqliteContextValue | null>(null);
/** @deprecated Use PbSqliteContext. */
export const PbdbContext = PbSqliteContext;
