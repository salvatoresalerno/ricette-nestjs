import { Injectable } from '@nestjs/common';
//import { DatabaseService } from 'src/database/database.service';
import { FindRicetteDto, GetRicettaParamsDto } from './dto/find-ricette.dto';
import { Ricetta, RicettaFull } from './dto/ricette.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
//import { Prisma } from 'generated/prisma';
//import { Prisma } from '../../_generatedXXX/prisma'
//import { DatabaseService } from '../../src/database/database.service';

@Injectable()
export class RicetteService {

  constructor(private readonly databaseService: DatabaseService) { }

  
    

  async getRicette(queryParam: FindRicetteDto) {
    const { limit, name, categoria, tag } = queryParam;       

    const where: any = {
        ...(name && {
          strMeal: {
            contains: name.toLowerCase(),
          },
        }),
        ...(categoria && {
          strCategory: {
            equals: categoria.toLowerCase(),
          },
        }),
        ...(tag && {
            strTags: {
            contains: tag.toLowerCase(),
            },
        }),
    };
        
    let ricette = await this.databaseService.ricette.findMany({
      where,
      take: limit,
    });
  
    // Ordina casualmente come ORDER BY RAND() in sql
    ricette = ricette.sort(() => Math.random() - 0.5);

    return {
        success: true,
        message: null,
        data: ricette,
        error: null,
    };        
  }

    
  async  getRicettaCompleta(params: GetRicettaParamsDto):Promise<ResponseCompleta<RicettaFull | null>> {

    const { idMeal, idUtente } = params; 

    //try {
      const result = await this.databaseService.$transaction(async (tx) => {
        // trovo ricetta
        const ricettaBase = await tx.ricette.findUnique({
          where: { idMeal },
        });               

        if (!ricettaBase) {
            return null;
        }

        // trovo i dettagli
        const dettagli = await tx.dettagli.findFirst({
          where: { idMeal },
          select: {
            strInstructions: true,
            strYoutube: true,
          },
        }) ?? { strInstructions: null, strYoutube: null };                 
    
        // trovo ingredienti
        const ingredienti = await tx.ingredienti.findMany({
          where: {
            dettagli: {
              idMeal,
            },
          },
          select: {
            idIngredient: true,
            strIngredient: true,
            strMeasure: true,
          },
        });
    
        // trovo Lista spesa
        const listaSpesa = await tx.lista_spesa.findMany({
          where: {
            idMeal,
            idUtente,
          },
          select: {
              idLista: true,
              idUtente: true,
              idMeal: true,
              idIngrediente: true,
              ingrediente: true,
              quantita: true
          }              
        });
          
        const ricettaCompleta = {
            ...ricettaBase,
            ...dettagli,
            ingredienti: ingredienti,
            lista_spesa: listaSpesa
        };           

        return ricettaCompleta;          
      });

      return {
          success: true,
          message: null,
          data: result,
          error: null,
      }
    /* } catch (error) {
      return {
          error: 'Errore imprevisto in  Ricetta Completa',
          success: false,
          data: null
      }
    }    */      
  }


  async getRicettePreferite(idUtente: string) {

    //try {
        const ricettePreferite = await this.databaseService.$queryRaw<Ricetta[]>(
          Prisma.sql `SELECT r.* FROM ricette r 
            INNER JOIN preferiti p ON r.idMeal = p.idMeal 
            WHERE p.idUtente = ${idUtente}`
        );


        return {
            success: true,
            mesaage: null,
            data: ricettePreferite,
            error: null,
        };             
    /* } catch (error) {
        return {
            error: 'Errore interno in getRicettePreferite',
            success: false,
            data: null,
        }; 
    } */
}


    
          

         
    
}
