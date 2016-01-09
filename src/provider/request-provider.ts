import { RequestOptions, Headers, RequestMethod } from 'angular2/http';
import {AuthService} from '../services/AuthService';
import {provide} from 'angular2/core';


export class WuRequestOptions extends RequestOptions {
    constructor() {
        super({
            method: RequestMethod.Get,
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': AuthService.getToken()
            })
        });
    }
}

export const WU_REQUEST_PROVIDERS: any = [
    provide(RequestOptions, {useClass: WuRequestOptions})
];