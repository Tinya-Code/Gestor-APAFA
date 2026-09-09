import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mysql, {
  Pool,
  PoolOptions,
  ResultSetHeader,
  RowDataPacket,
} from 'mysql2/promise';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const options: PoolOptions = {
      host: this.configService.get('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      user: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

    this.pool = mysql.createPool(options);

    try {
      const connection = await this.pool.getConnection();
      this.logger.log('✅ MySQL connected successfully');
      connection.release();
    } catch (error) {
      this.logger.error(
        '❌ MySQL connection failed:',
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
    this.logger.log('MySQL connection pool closed');
  }

  async query<T extends RowDataPacket[] = any[]>(
    sql: string,
    params?: any[],
  ): Promise<T> {
    const [rows] = await this.pool.execute(sql, params);
    return rows as T;
  }

  async execute(sql: string, params?: any[]): Promise<ResultSetHeader> {
    const [result] = await this.pool.execute(sql, params);
    return result as ResultSetHeader;
  }

  async getConnection() {
    return this.pool.getConnection();
  }

  async ping(): Promise<boolean> {
    try {
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();
      return true;
    } catch {
      return false;
    }
  }
}
