import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AcquistatoToggleDto, Categoria, ListaSpesaDto, RicettaListaSpesa, TogglePreferitoDto,  } from './dto/actions.dto';


interface RawResultRicetteLista {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    idIngrediente: string;
    ingrediente: string;
    quantita: string;
    acquistato: boolean;
    idLista: string;
  }
  
  

@Injectable()
export class ActionsService {

    constructor(private readonly databaseService: DatabaseService) { }
    
    async getAllCategory(): Promise<ResponseCompleta<Categoria[] | null>> {
        //try {
            let categorie = await this.databaseService.categorie.findMany();

            return {
                success: true,
                message: null,
                data: categorie,
                error: null,
            };     
        /* } catch (error) {
            return {
                error: 'Errore imprevisto in get Categorie',
                success: false,
                data: null,
            };  
        } */
         
    }

    async togglePreferito(bodyParams: TogglePreferitoDto): Promise<ResponseCompleta<null>> {

        const { idUtente, idMeal } = bodyParams;

        //try {
            const existing = await this.databaseService.preferiti.findFirst({  //controllo esistenza preferito
                where: {
                    idUtente,
                    idMeal
                },
                select: {
                    idPreferito: true
                }
            });
    
            if (existing) {
                //cancella
                await this.databaseService.preferiti.delete({
                    where: {
                        idPreferito: existing.idPreferito
                    }
                });
            } else {
                //inserisci
                await this.databaseService.preferiti.create({
                    data: {
                        idMeal,
                        idUtente
                    }
                });
            }
    
            return {
                success: true,
                message: 'togglePreferito avvenuto con successo',                
                data: null,
                error: null,
            }; 
        /* } catch (error) {
            return {
                error: 'Errore interno in togglePreferito',
                success: false,
                data: null,
            }; 
        } */
    }

    async setListaSpesa(bodyParams: ListaSpesaDto): Promise<ResponseCompleta<null>> {
        const { idUtente, idMeal, idIngrediente, ingrediente, quantita, insert } = bodyParams;

        //try {
            if (insert) {
                await this.databaseService.lista_spesa.create({
                    data: {
                        idUtente, idMeal, idIngrediente, ingrediente, quantita,
                    }
                });
            } else {
                await this.databaseService.lista_spesa.deleteMany({
                    where: {
                        idUtente,
                        idMeal,
                        idIngrediente
                    }
                })
            }

            return {
                success: true,
                message: null,
                data: null,
                error: null,
            }; 
        /* } catch (error) {
            return {
                error: 'Errore interno in getListaSpesa',
                success: false,
                data: null,
            }; 
        } */
    }

    async getListaSpesaConRicette(idUtente: string): Promise<ResponseCompleta<RicettaListaSpesa[] | null>> {
        //try {
            const rawData = await this.databaseService.$queryRawUnsafe<RawResultRicetteLista[]>(`
                SELECT 
                  r.idMeal,
                  r.strMeal,
                  r.strMealThumb,
                  ls.idIngrediente,
                  ls.ingrediente,
                  ls.quantita,
                  ls.acquistato,
                  ls.idLista
                FROM lista_spesa ls
                JOIN ricette r ON ls.idMeal = r.idMeal
                WHERE ls.idUtente = ?
              `, idUtente);
              
            const grouped = Object.values(
                rawData.reduce((acc: Record<string, RicettaListaSpesa>, curr: RawResultRicetteLista) => {
                    const { idMeal, strMeal, strMealThumb, ...ingredienteData } = curr;
              
                    if (!acc[idMeal]) {
                        acc[idMeal] = {
                        idMeal,
                        strMeal,
                        strMealThumb,
                        listaSpesa: [],
                        };
                    }
              
                    acc[idMeal].listaSpesa.push({
                        idIngrediente: ingredienteData.idIngrediente,
                        strIngredient: ingredienteData.ingrediente,
                        strMeasure: ingredienteData.quantita,
                        acquistato: ingredienteData.acquistato,
                        idLista: ingredienteData.idLista,
                    });
              
                    return acc;
                }, {})
            ) as RicettaListaSpesa[];

            return {
                success: true,
                message: null,
                data: grouped,
                error: null,
            }; 
        /* } catch (error) {
            return {
                error: 'Errore interno in getListaSpesaConRicette',
                success: false,
                data: null,
            } ; 
        }*/
    }

    async acquistatoToggle(bodyParams: AcquistatoToggleDto): Promise<ResponseCompleta<null>> {

        const { idUtente, idLista } = bodyParams;

        const result = await this.databaseService.lista_spesa.findFirst({
            where: {
                idLista,
                idUtente
            },
            select: {
                acquistato: true
            }
        });

        if (result) {  //se il record non esiste, result = undefined
            await this.databaseService.lista_spesa.update({
                where: {
                    idLista
                },
                data: { acquistato: !result.acquistato}                    
            })
        } else {    
            throw new NotFoundException("Item non trovato!");            
        }

        return {
            success: true,
            message: null,
            data: null,
            error: null
        }; 
    }

    async deleteListaSpesaByID(ids: string[]): Promise<ResponseCompleta<null>> {

        console.log('ecco gli id: ', ids)

            
        await this.databaseService.lista_spesa.deleteMany({
            where: {
                idLista: { in: ids }  // Elimina tutti i record dove idLista è nell'array
            }
        }); 

        return {
            success: true,
            message: 'Lista della spesa cancellata correttamente',
            data: null,
            error: null
        };
    }
      
}
