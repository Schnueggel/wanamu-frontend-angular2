declare module wu {

    interface Config {
        apiUrl: string;
    }

    module model {

        interface User {
            _id?: string;
            firstname: string;
            lastname: string;
            password: string;
            email: string;
            username: string;
            salutation: string;
            defaultTodolistId: string;
        }

        interface Registration {
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

        interface Todo extends Immutable.Map<string, any> {
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