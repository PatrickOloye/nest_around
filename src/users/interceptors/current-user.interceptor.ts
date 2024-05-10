import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { UsersService } from "../users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor (private userService: UsersService){}


    async intercept(context: ExecutionContext, handler: CallHandler){
        const request = context.switchToHttp().getRequest()
        const { userId } = request.session || {};
        // console.log(" the new " , userId)
        if(userId){
            const user = await this.userService.findOne(userId);
            request.currentUser = user
            // console.log("request is", request.currentUser)
            // console.log("user isu", user)
        }

        return handler.handle()
    }
}