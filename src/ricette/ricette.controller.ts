import { Controller, Get, Param, ParseUUIDPipe, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { RicetteService } from './ricette.service';
import { FindRicetteDto, GetRicettaParamsDto } from './dto/find-ricette.dto';

@Controller('ricette')
export class RicetteController {
    constructor(private readonly ricetteService: RicetteService) {}

    @Get()
    @UsePipes(new ValidationPipe({ transform: true,  whitelist: true }))
    async getRicette(@Query() queryParam: FindRicetteDto) {       

        return await this.ricetteService.getRicette(queryParam);
    }

    @Get(':idMeal/:idUtente')
    @UsePipes(new ValidationPipe({ transform: true,  whitelist: true }))
    async getRicetteByID(@Param() params: GetRicettaParamsDto) {

        //return await this.ricetteService.getRicetteByID(params);
        return await this.ricetteService.getRicettaCompleta(params);
    }

    @Get('getRicettePreferite')
    async getRicettePreferite(@Query('idUtente', new ParseUUIDPipe()) idUtente: string) {
  
      return await this.ricetteService.getRicettePreferite(idUtente);
    }
}



//idUtente=9846f699-2668-4c14-a2ed-05f927b69f66