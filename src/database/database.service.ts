import { Injectable, OnModuleInit } from '@nestjs/common';
//import { PrismaClient } from 'generated/prisma';
import { PrismaClient } from '../../generated/prisma'

@Injectable()
export class DatabaseService  extends PrismaClient implements OnModuleInit {
    async onModuleInit() {        
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect(); // Chiusura pulita alla chiusura
    }
    
}
