declare module wu {

    interface Config {
        apiUrl: string;
    }

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

        interface Todo {
            _id: string;
            title: string;
            description: string;
            owner: string;
            finished: boolean;
        }

        interface LoginData {
            token: string;
            data: Array<User>
        }

        interface TodoData {
            error?: any;
            data?: Array<Todo>
        }
    }
}