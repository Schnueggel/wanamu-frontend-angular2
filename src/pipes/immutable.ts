import {Pipe, PipeTransform} from 'angular2/core';
import { ReplaySubject } from 'rxjs/Rx';
import * as _ from 'lodash';

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
            if (value !== null && typeof value === 'object' && typeof value.toArray === 'function') {
                this.data = this.orgValue.toArray();
            } else {
                this.data = value;
            }
        }

        return this.data;
    }
}
@Pipe({
    name: 'toObject',
    pure: false
})
export class ToObjectPipe  implements PipeTransform {
    orgValue: any;
    data: any;

    transform(value:any, args:string[]):any {

        if (this.orgValue !== value) {
            this.orgValue = value;
            if (value !== null && typeof value === 'object' && typeof value.toObject === 'function') {
                this.data = this.orgValue.toObject();
            } else {
                this.data = value;
            }
        }

        return this.data;
    }
}

@Pipe({
    name: 'toJS',
    pure: false
})
export class ToJSPipe  implements PipeTransform {
    orgValue: any;
    data: any;

    transform(value:any, args:string[]):any {

        if (this.orgValue !== value) {
            this.orgValue = value;
            if (value !== null && typeof value === 'object' && typeof value.toJS === 'function') {
                this.data = this.orgValue.toJS();
            } else {
                this.data = value;
            }
        }

        return this.data;
    }
}

@Pipe({
    name: 'toJSIterable',
    pure: false
})
export class toJSIterable  implements PipeTransform {
    orgValue: any;
    data: any;

    transform(value:any, args:string[]):any {
        if (this.orgValue !== value) {
            this.orgValue = value;
            if (value !== null && typeof value === 'object' && typeof value.toJS === 'function') {
                this.data = this.orgValue.toJS();
                if (typeof this.data === 'object') {
                    this.data = Object.keys(this.data).map( (v) => this.data[v] );
                }
            } else {
                this.data = value;
            }
        }

        return this.data;
    }
}

/**
 * Transform a list with values into a list with ReplaySubjects that replay the value
 * The param path can be used to track changes on the list by the value of a property
 *
 * Example:
 *  // todos is a ImmutableJS List or OrderedMap containing Maps or something else
 *  todo of todos | toObservable:'_id'
 *
 *  This will map every todo in todos to the value todo['_id']. If a todo changes (By reference) this pipe will look for a ReplaySubject mapped to the given key and call next(todo)
 *  If the key does not exist a new ReplaySubject will be created.
 *  If no path is given the todo object will be used as key
 */
@Pipe({
    name: 'toObservable',
    pure: false
})
export class ToObservablePipe  implements PipeTransform {
    orgValue: any;
    entries: Map<any,any> = new Map();
    map: Map<string, ReplaySubject> = new Map();
    data: Array<ReplaySubject>;
    path: string;

    transform(value:any, args:string[]):any {
        if (value === null) {
            return null;
        }

        if (this.orgValue === value ) {
            return this.data;
        } else {
            this.orgValue = value;
        }

        if (args.length > 0) {
            this.path = args[0];
        }

        if (typeof value === 'object' && typeof value.forEach === 'function') {
            const updatedKeys = [];
            value.forEach((entry)=> {
                let key;
                if(this.path) {
                    key = _.get(entry, this.path);
                    if (!key) {
                        throw Error(`ToObservablePipe, cant find value for given path ${key}`);
                    }
                } else {
                    key = entry
                }
                updatedKeys.push(key);

                if (this.map.has(key)) {
                    if (this.entries.get(key) !== entry) {
                        this.map.get(key).next(entry);
                    }
                } else {
                    const obs = new ReplaySubject(1);
                    obs.next(entry);
                    this.map.set(key, obs);
                }
                this.entries.set(key, entry);
            });
            //Remove not used keys
            Array.from(this.map.keys()).filter( k => updatedKeys.indexOf(k) === -1).map( k => this.map.delete(k));

            this.data = Array.from(this.map.values());
        } else {
            return value;
        }

        return this.data;
    }
}
