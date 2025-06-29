import { Pool } from 'pg';
export declare const pool: Pool;
export declare const connectDatabase: () => Promise<void>;
export declare const query: (text: string, params?: any[]) => Promise<any>;
//# sourceMappingURL=database.d.ts.map