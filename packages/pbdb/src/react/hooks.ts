'use client';
import { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { PbSqliteContext } from './context';
import type { PbSqliteDatabase, QueryOptions } from '../core/types';
import { PbSqliteError } from '../core/errors';

export interface UseQueryResult<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function usePbSqlite(): PbSqliteDatabase {
  const ctx = useContext(PbSqliteContext);
  if (!ctx) {
    throw new PbSqliteError('usePbSqlite must be used within <PbSqliteProvider>');
  }
  return ctx.db;
}

/**
 * SELECT から参照テーブル名を抽出する（簡易パース）
 */
function extractQueriedTables(sql: string): string[] {
  const tables = new Set<string>();
  const patterns = [
    /FROM\s+["'`]?(\w+)["'`]?/gi,
    /JOIN\s+["'`]?(\w+)["'`]?/gi,
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(sql)) !== null) {
      tables.add(match[1].toLowerCase());
    }
  }
  return Array.from(tables);
}

/**
 * リアクティブ SELECT クエリ。
 * データ変更時に自動で再取得される。
 */
export function useQuery<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
  options: QueryOptions = {}
): UseQueryResult<T> {
  const db = usePbSqlite();
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // params を JSON で比較するために文字列化
  const paramsKey = JSON.stringify(params);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const fetchData = useCallback(async () => {
    try {
      const result = await db.query<T>(sql, paramsRef.current);
      setData(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setIsLoading(false);
    }
  }, [db, sql, paramsKey]);

  // 初回取得 + SQL/params 変更時に再取得
  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [fetchData]);

  // テーブル変更の監視
  useEffect(() => {
    const queriedTables = extractQueriedTables(sql);

    const unsubscribe = db.onTableChange((changedTables) => {
      const hasOverlap = changedTables.some((t) =>
        queriedTables.includes(t.toLowerCase())
      );
      if (hasOverlap || options.tags?.length) {
        fetchData();
      }
    });

    return unsubscribe;
  }, [db, sql, fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

/** @deprecated Use usePbSqlite. */
export const usePbdb = usePbSqlite;

