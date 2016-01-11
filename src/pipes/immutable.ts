import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
    name: 'immutable',
    pure: false
})
export class UnMapPipe  implements PipeTransform {

    transform(value:any, args:string[]):any {
        if (typeof value === 'object' && typeof value.values === 'function') {
            return value.values();
        }

        return value;
    }
}