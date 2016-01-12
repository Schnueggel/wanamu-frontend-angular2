import {Injector} from 'angular2/core';

let appInjectorRef: Injector;

/**
 * This is a hack to workaround the injector tree flaws. Like to beeing able to get the injector in decorators like canActivate
 * @param injector
 * @returns {boolean|any}
 */
export const appInjector = (injector?: Injector) => {
    if (!injector) {
        return appInjectorRef;
    }

    appInjectorRef = injector;

    return appInjectorRef;
};