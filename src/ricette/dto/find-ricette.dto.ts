import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";



export class FindRicetteDto {
    @IsOptional()
    @Type(() => Number) // fa cast da string a int (il param arriva sempre come string)
    @IsNumber({}, { message: 'Il parametro limit deve essere un numero NN' })    
    limit?: number;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    categoria?: string;

    @IsOptional()
    @IsString()
    tag?: string;    
}

export class GetRicettaParamsDto {
    @IsString()
    @IsNotEmpty()
    idMeal: string;
  
    @IsNotEmpty()
    @IsUUID()
    idUtente: string;
  }