'use client';
import React, { useEffect, useRef, useState } from 'react';
import { PbSqliteContext } from './context';
import { createDB } from '../core/database';
import { runMigrations } from '../core/migration';
import type { PbSqliteDatabase, CreateDBOptions, Migration } from '../core/types';

export interface PbSqliteProviderProps {
  dbName: string;
  children: React.ReactNode;
  migrations?: Migration[];
  storage?: CreateDBOptions['storage'];
  fallback?: React.ReactNode;
  debug?: boolean;
  onError?: (error: Error) => void;
}

export function PbSqliteProvider({
  dbName,
  children,
  migrations,
  storage,
  fallback,
  debug,
  onError,
}: PbdbProviderProps) {
  const [db, setDb] = useState<PbSqliteDatabase | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // useRef は StrictMode の unmount/remount でリセットされない。
  // これにより createDB が1回だけ実行されることを保証する。
  const initRef = useRef(false);
  const dbRef = useRef<PbSqliteDatabase | null>(null);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    (async () => {
      try {
        const database = await createDB(dbName, { storage: 'opfs', debug, onError });
        dbRef.current = database;

        if (migrations && migrations.length > 0) {
          await runMigrations(database, migrations);
        }

        setDb(database);
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
      }
    })();
  }, [dbName, storage]);

  // 本当のアンマウント時に DB を閉じる
  useEffect(() => {
    return () => {
      dbRef.current?.close();
    };
  }, []);

  if (error) {
    return React.createElement('div', { role: 'alert', style: { color: 'red' } }, `pbdb error: ${error.message}`);
  }

  if (!db) {
    return (fallback ?? null) as React.ReactElement | null;
  }

  return React.createElement(
    PbSqliteContext.Provider,
    { value: { db } },
    children
  );
}

/** @deprecated Use PbSqliteProvider. */
export const PbdbProvider = PbSqliteProvider;
export type PbdbProviderProps = PbSqliteProviderProps;

