// import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
// import { Observable } from "rxjs";

// @Injectable()
// export class AuthGuard extends NestAuth{
//   constructor(private readonly jwtService: JwtService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const token = this.extractToken(request);

    
//   }
// }