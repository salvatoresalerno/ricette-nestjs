export interface Ricetta  {
    idMeal: string;
    strMeal:string;
    strMealThumb:string;
    strCategory:string;
    strArea:string;
    strTags:string;

}

export interface Ingrediente  {
    idIngredient: string;
    strIngredient: string;
    strMeasure: string | null;
}

export interface ItemSpesa  {
    idLista: string;
    idIngrediente: string;
    ingrediente: string;
    quantita: string;
}

export interface RicettaFull  {
    idMeal: string;
    strMeal: string;
    strMealThumb: string | null;
    strCategory: string | null;
    strArea: string | null;
    strTags: string | null;
    strInstructions: string | null;
    strYoutube: string | null;
    ingredienti:Ingrediente[];
    lista_spesa: ItemSpesa[];
}



/* export interface ResponseCompleta2  {
    error: string | null;
    success: boolean;
    data: RicettaCompleta | null;
} */

/* export interface RicettaCompleta {
    ricetta: {
      idMeal: string;
      strMeal: string;
      strMealThumb: string | null;
      strCategory: string | null;
      strArea: string | null;
      strTags: string | null;
      strInstructions: string | null;
      strYoutube: string | null;
    };
    ingredienti: Array<{
      idIngredient: string;
      strIngredient: string;
      strMeasure: string;
    }>;
    lista_spesa: Array<{
      idLista: string;
      idIngrediente: string;
      ingrediente: string;
      quantita: string;
    }>;
} */