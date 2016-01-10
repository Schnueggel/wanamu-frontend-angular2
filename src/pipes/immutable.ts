import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
    name: 'immutable',
    pure: false
})
export class ImmutablePipe  implements PipeTransform {

    transform(value:any, args:string[]):any {
        console.log(value);

        return value;
    }
}