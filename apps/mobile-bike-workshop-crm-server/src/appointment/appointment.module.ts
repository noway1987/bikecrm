import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { AppointmentModuleBase } from "./base/appointment.module.base";
import { AppointmentService } from "./appointment.service";
import { AppointmentController } from "./appointment.controller";
import { AppointmentResolver } from "./appointment.resolver";

@Module({
  imports: [AppointmentModuleBase, forwardRef(() => AuthModule)],
  controllers: [AppointmentController],
  providers: [AppointmentService, AppointmentResolver],
  exports: [AppointmentService],
})
export class AppointmentModule {}
