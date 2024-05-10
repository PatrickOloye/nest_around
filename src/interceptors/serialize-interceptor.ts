import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Observable, map } from "rxjs";
// import { UserDto } from "src/users/dtos/user.dto";


interface ClassConstructor{
    new (...args: any[]): {}
}

export function Serialize (dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor{
constructor(private dto: any){}

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any>{
        // console.log('Im running before response is sent', context);

        return handler.handle().pipe(
            map((data: any) => {
               return plainToClass(this.dto, data, {
                excludeExtraneousValues: true
               }) 
                
            })
        )
            }
}