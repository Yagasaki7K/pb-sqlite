declare module 'wa-sqlite/dist/wa-sqlite.mjs' {
  const factory: () => Promise<unknown>;
  export default factory;
}

declare module 'wa-sqlite' {
  type SQLValue = number | string | Uint8Array | number[] | bigint | null;
  type SQLCallback = (row: unknown[], columns: string[]) => void | Promise<void>;

  interface SQLiteAPI {
    vfs_register(vfs: unknown, makeDefault?: boolean): void;
    open_v2(filename: string): Promise<number>;
    close(database: number): Promise<void>;
    exec(database: number, sql: string, callback?: SQLCallback): Promise<number>;
    execWithParams(database: number, sql: string, params?: SQLValue[]): Promise<{ rows: unknown[][]; columns: string[] }>;
    run(database: number, sql: string, params?: SQLValue[]): Promise<number>;
  }

  export function Factory(module: unknown): SQLiteAPI;
}

declare module 'wa-sqlite/src/examples/AccessHandlePoolVFS.js' {
  export class AccessHandlePoolVFS {
    constructor(directory: string);
    readonly isReady: Promise<void>;
    getCapacity(): number;
    getSize(): number;
    addCapacity(count: number): Promise<void>;
    close(): Promise<void>;
  }
}
