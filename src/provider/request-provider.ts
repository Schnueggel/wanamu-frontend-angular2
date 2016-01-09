import { RequestOptions, Headers, RequestMethod, BaseRequestOptions, HTTP_PROVIDERS } from 'angular2/http';
import {AuthService} from '../services/AuthService';
import {provide} from 'angular2/core';
import {NG1_HTTP_BACKEND} from 'angular2/src/upgrade/constants';


export class WuRequestOptions extends BaseRequestOptions {
    constructor() {
        super();
        this.headers.set('Content-Type', 'application/json');
    }
}

export const WU_REQUEST_PROVIDERS: any = [
    provide(RequestOptions, {useClass: WuRequestOptions})
];