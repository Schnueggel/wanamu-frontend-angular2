import { bootstrap } from 'angular2/platform/browser';
import { AppComponent} from './components/app';
import { ROUTER_PROVIDERS } from 'angular2/router';
import { HTTP_PROVIDERS } from 'angular2/http';
import { WU_REQUEST_PROVIDERS } from './provider/request-provider';
import { WU_CONFIG_PROVIDERS } from './provider/config-provider';

bootstrap(AppComponent, [ROUTER_PROVIDERS, HTTP_PROVIDERS, WU_CONFIG_PROVIDERS, WU_REQUEST_PROVIDERS]);