import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
    name: 'toArray',
    pure: false
})
export class ToArrayPipe  implements PipeTransform {
    orgValue: any;
    data: Array<any>;

    transform(value:any, args:string[]):any {
        if (this.orgValue !== value) {
            this.orgValue = value;

            if (typeof this.orgValue === 'object' && typeof this.orgValue.toArray === 'function') {
                this.data = this.orgValue.toArray();
            } else {
                this.data = value;
            }
        }

        return this.data;
    }
}