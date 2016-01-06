///<reference path="../node_modules/rxjs/Rx.d.ts"/>

declare module wu {

    module model {

        interface User {

        }

        interface Login {
            token: string;
            data: Array<User>
        }
    }
}