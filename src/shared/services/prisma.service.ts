import { Injectable } from '@nestjs/common'
import { PrismaClient } from '../../../generated/prisma/client'
import { PrismaPostgresAdapter } from '@prisma/adapter-ppg'
import envConfig from '../config'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPostgresAdapter({ connectionString: envConfig.DATABASE_URL })
    super({ adapter })
  }
}
