export interface ILoader {
    isLoading: boolean;
    message: string;
    resource: string;
    action: string;
    payload: any;
}
