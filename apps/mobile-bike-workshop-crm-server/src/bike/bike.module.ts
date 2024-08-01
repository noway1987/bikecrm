import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { BikeModuleBase } from "./base/bike.module.base";
import { BikeService } from "./bike.service";
import { BikeController } from "./bike.controller";
import { BikeResolver } from "./bike.resolver";

@Module({
  imports: [BikeModuleBase, forwardRef(() => AuthModule)],
  controllers: [BikeController],
  providers: [BikeService, BikeResolver],
  exports: [BikeService],
})
export class BikeModule {}
