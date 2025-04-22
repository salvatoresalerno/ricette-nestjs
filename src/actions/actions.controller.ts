import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, ValidationPipe } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { AcquistatoToggleDto, DeleteIngredientiDto, ListaSpesaDto, TogglePreferitoDto } from './dto/actions.dto';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}


  @Get('category')
  async getAllCategory() {

    return await this.actionsService.getAllCategory();
  }

  @Get('getIdPreferiti/:idUtente')
  async getIdPreferiti(@Param('idUtente', new ParseUUIDPipe()) idUtente: string) {

    return await this.actionsService.getIdPreferiti(idUtente);
  }

  @Post('toggle-preferito')
  async togglePreferito(@Body(new ValidationPipe({ whitelist: true })) bodyParams: TogglePreferitoDto) {

    return await this.actionsService.togglePreferito(bodyParams);
  }

  @Post('lista_spesa')
  async setListaSpesa(@Body(new ValidationPipe({ whitelist: true })) bodyParams: ListaSpesaDto) {

    return await this.actionsService.setListaSpesa(bodyParams);
  }

  @Get('lista_spesa/:idUtente')
  async getListaSpesaConRicette(@Param('idUtente', new ParseUUIDPipe()) idUtente: string) {

    return await this.actionsService.getListaSpesaConRicette(idUtente)
  }

  @Post('acquistato-toggle')
  async acquistatoToggle(@Body(new ValidationPipe({ whitelist: true })) bodyParams: AcquistatoToggleDto) {

    return await this.actionsService.acquistatoToggle(bodyParams);
  }

  @Delete('lista_spesa/elimina')  //endpoint per button 'Rimuovi Ingredienti Acquistati'
  async deleteListaSpesaByID(@Body(new ValidationPipe({ whitelist: true })) bodyparam: DeleteIngredientiDto) {

    return await this.actionsService.deleteListaSpesaByID(bodyparam.ids);
  }

}
