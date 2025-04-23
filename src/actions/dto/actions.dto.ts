import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsString, IsUUID } from "class-validator";


export interface Categoria {
    idCategory: string;
    category: string;
    thumbnail: string | null;
}

export class TogglePreferitoDto {
    @IsNotEmpty()
    @IsUUID()
    idUtente: string;

    @IsString()
    @IsNotEmpty()
    idMeal: string;
}

export class ListaSpesaDto {
    @IsNotEmpty()
    @IsUUID()
    idUtente: string;

    @IsString()
    @IsNotEmpty()
    idMeal: string;

    @IsString()
    @IsNotEmpty()
    idIngrediente: string;

    @IsString()
    @IsNotEmpty()
    ingrediente: string;

    @IsString()
    @IsNotEmpty()
    quantita: string;

    @IsBoolean()
    @IsNotEmpty()
    insert: boolean;
} 


export interface RicettaListaSpesa {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    listaSpesa: {
      idIngrediente: string;
      strIngredient: string;
      strMeasure: string;
      acquistato: boolean;
      idLista: string;
    }[];
}

export class AcquistatoToggleDto {
    @IsNotEmpty()
    @IsUUID(undefined, {message: 'Pippo è scemo'})
    idUtente: string;

    @IsNotEmpty()
    @IsUUID()
    idLista: string;
}

export class DeleteIngredientiDto {
    @IsArray({ message: 'Deve essere un array' })
    @IsUUID(undefined, { each: true, message: 'Ogni ID deve essere un UUID valido' })
    @ArrayMinSize(1, { message: 'Almeno un ID è richiesto' })
    ids: string[];
}

 