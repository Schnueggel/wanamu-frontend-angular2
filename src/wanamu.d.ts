///<reference path="../node_modules/rxjs/Rx.d.ts"/>

declare module wu {

    module model {

        interface User {
            firstname: string;
            lastname: string;
            password: string;
            email: string;
            username: string;
            salutation: string;
        }

        interface Login {
            username: string;
            password: string;
        }

        interface LoginData {
            token: string;
            data: Array<User>
        }
    }
}