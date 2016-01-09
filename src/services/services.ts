import { AuthService } from './AuthService';
import { UserService } from './UserService';
import { TodoListService } from './TodoListService';
import { ConfigService } from './ConfigService';

export const WU_SERVICES = [AuthService, UserService, TodoListService, ConfigService];

export default {
    AuthService,
    UserService,
    TodoListService,
    ConfigService
};