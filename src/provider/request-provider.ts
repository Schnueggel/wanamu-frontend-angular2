import { RequestOptions, Headers, RequestMethod, BaseRequestOptions, HTTP_PROVIDERS } from 'angular2/http';
import {AuthService} from '../services/AuthService';
import {provide} from 'angular2/core';
import {NG1_HTTP_BACKEND} from 'angular2/src/upgrade/constants';


export class WuRequestOptions extends BaseRequestOptions {
    withCredentials: boolean = true;

    constructor() {
        super();
        this.headers.set('Content-Type', 'application/json');
        this.headers.set('X-Requested-With', 'XMLHttpRequest');
    }
}

export const WU_REQUEST_PROVIDERS: any = [
    provide(RequestOptions, {useClass: WuRequestOptions})
];