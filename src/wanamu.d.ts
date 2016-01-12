declare module wu {

    interface Config {
        apiUrl: string;
    }

    module model {

        interface User extends UserData, Immutable.Map<string, any> {}

        interface UserResponseData {
            error?: any;
            data?: Array<UserData>
        }

        interface UserData {
            _id: string;
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

        interface LoginData {
            token: string;
            data: Array<User>
        }

        interface Todo extends TodoData, Immutable.Map<string, any> {}

        interface TodoResponseData {
            error?: any;
            data?: Array<Todo>
        }

        interface TodoData {
            _id?: string;
            title: string;
            description?: string;
            owner?: string;
            finished?: boolean;
        }

        interface TodoList extends Immutable.OrderedMap<string, Todo> {}
    }
}