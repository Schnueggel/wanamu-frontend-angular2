import {appInjector} from './app-injector';
import {Injector} from 'angular2/core';
import {AuthService} from '../services/AuthService';
import {ComponentInstruction} from 'angular2/router';

/**
 * Checks if there is a current user and a user token
 * @param prev
 * @param next
 * @returns {boolean}
 */
export function canActivateAuthCheck(prev: ComponentInstruction, next: ComponentInstruction) {

    const injector: Injector = appInjector();
    const authService: AuthService = injector.get(AuthService);

    const authed = typeof authService.getToken() === 'string';

    if (!authed) {
        return false;
    }

    if (!authService.user) {
        return authService.hasCurrentUser();
    }

    return true;
}