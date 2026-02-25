export interface IError {
    isError: boolean;
    message: string;
    resource: string;
    action: string;
    payload: any;
}
