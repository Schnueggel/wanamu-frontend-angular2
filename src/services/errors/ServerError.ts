import { BaseError } from './BaseError';

export class ServerError extends BaseError {

    constructor() {
        super('Server failed to answer the response');
    }
}