import axios, { AxiosRequestConfig } from 'axios';
import { from, firstValueFrom } from 'rxjs';

// export class HttpClient {
//     constructor() { }

//     get<T = any>(url: string, config?: AxiosRequestConfig): Promise<any> {
//         return firstValueFrom(from(axios.get<T>(url, config)));
//     }

//     post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
//         return firstValueFrom(from(axios.post<T>(url, data, config)));
//     }

//     put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
//         return firstValueFrom(from(axios.put<T>(url, data, config)));
//     }

//     delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<any> {
//         return firstValueFrom(from(axios.delete<T>(url, config)));
//     }
// }


export class HttpClient {
    constructor() { }

    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return firstValueFrom(from(
            axios.get<T>(url, config).then(res => res.data)
        ));
    }

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return firstValueFrom(from(
            axios.post<T>(url, data, config).then(res => res.data)
        ));
    }

    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return firstValueFrom(from(
            axios.put<T>(url, data, config).then(res => res.data)
        ));
    }

    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return firstValueFrom(from(
            axios.delete<T>(url, config).then(res => res.data)
        ));
    }
}
