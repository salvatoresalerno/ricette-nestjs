import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { RicetteModule } from './ricette/ricette.module';
import { ActionsModule } from './actions/actions.module';

@Module({
  imports: [DatabaseModule, RicetteModule, ActionsModule],
})
export class AppModule {}
