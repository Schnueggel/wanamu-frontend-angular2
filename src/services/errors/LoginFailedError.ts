import { BaseError } from './BaseError';

export class LoginFailedError extends BaseError {

    constructor() {
        super('Login failed');
    }
}