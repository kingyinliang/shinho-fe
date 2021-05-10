import {AxiosInstance, AxiosResponse} from 'axios'

export interface Option {
    NODE_ENV?: string;
    host: string;
    tenant: string;
    clientId: string;
    clientSecret: string;
    redirectUri?: string;
}

export interface SSOLoginStatic {
    new(Option): SSOLoginConstructor
}

export interface SSOLoginConstructor{
    readonly option: Option

    readonly Axios: AxiosInstance

    getUserInfo(): Promise<AxiosResponse>

    logout(): Promise<AxiosResponse>

    expiredToken(res: any): void

    syncToken(id: string): void

    createProxy(redirectUri: string, token: string): void
}

declare const SSOLogin: SSOLoginStatic;

export default SSOLogin;
