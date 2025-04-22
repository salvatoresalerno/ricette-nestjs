



interface ResponseCompleta<T = any>  {
    success: boolean;
    message: string | null;
    data: T | null;
    error: string | null;
}