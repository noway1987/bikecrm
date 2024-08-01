import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { BikeServiceBase } from "./base/bike.service.base";

@Injectable()
export class BikeService extends BikeServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
