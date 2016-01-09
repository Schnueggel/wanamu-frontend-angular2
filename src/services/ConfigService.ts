import {Injectable} from 'angular2/core';
import config from '../config';

@Injectable()
export class ConfigService {
    config: wu.Config = config;

    constructor() {}
}

