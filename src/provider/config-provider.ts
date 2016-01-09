import { provide } from 'angular2/core';
import { WU_CONFIG } from '../config';

export const WU_CONFIG_PROVIDERS: any = [
    provide(WU_CONFIG, {useValue: WU_CONFIG})
];