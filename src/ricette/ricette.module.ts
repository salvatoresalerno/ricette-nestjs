import { Module } from '@nestjs/common';
import { RicetteController } from './ricette.controller';
import { RicetteService } from './ricette.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RicetteController],
  providers: [RicetteService]
})
export class RicetteModule {}
