'use client';
import { createContext } from 'react';
import type { PbdbDatabase } from '../core/types';

export interface PbdbContextValue {
  db: PbdbDatabase;
}

export const PbdbContext = createContext<PbdbContextValue | null>(null);
