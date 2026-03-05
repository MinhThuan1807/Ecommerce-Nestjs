// import { Injectable, OnModuleInit } from '@nestjs/common'
// import { PrismaClient } from '../../../generated/prisma/client'
// import { PrismaPostgresAdapter } from '@prisma/adapter-ppg'
// import envConfig from '../config'

// @Injectable()
// export class PrismaService extends PrismaClient implements OnModuleInit {
//   constructor() {
//     const adapter = new PrismaPostgresAdapter({ connectionString: envConfig.DATABASE_URL })
//     super({ adapter, log: ['info'] })
//   }

//   async onModuleInit() {
//     await this.$connect()
//   }
// }

import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '../../../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import envConfig from '../config';

// export const prismaService = new PrismaClient({ adapter });

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: envConfig.DATABASE_URL,
    });
    super({ adapter, log: ['info'] });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
