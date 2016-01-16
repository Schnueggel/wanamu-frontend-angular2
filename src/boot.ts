import { bootstrap } from 'angular2/platform/browser';
import { AppComponent} from './components/app';
import { ROUTER_PROVIDERS } from 'angular2/router';
import { HTTP_PROVIDERS } from 'angular2/http';
import { WU_REQUEST_PROVIDERS } from './provider/request-provider';
import { WU_CONFIG_PROVIDERS } from './provider/config-provider';
import { ComponentRef, enableProdMode } from 'angular2/core';
import { appInjector } from './util/app-injector';
import { WU_SERVICES } from './services/services';
import { WU_STORES } from './stores/stores';

bootstrap(AppComponent, [ROUTER_PROVIDERS, HTTP_PROVIDERS, WU_CONFIG_PROVIDERS, WU_REQUEST_PROVIDERS, WU_SERVICES, WU_STORES])
    .then((app: ComponentRef) => {
        appInjector(app.injector);
    });