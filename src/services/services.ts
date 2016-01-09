import { AuthService } from './AuthService';
import { UserService } from './UserService';
import {TodoListService} from './TodoListService';

export const WU_SERVICES = [AuthService, UserService, TodoListService];

export default {
    AuthService,
    UserService,
    TodoListService
};