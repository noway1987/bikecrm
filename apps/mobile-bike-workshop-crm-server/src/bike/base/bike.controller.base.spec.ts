import { Test } from "@nestjs/testing";
import {
  INestApplication,
  HttpStatus,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import request from "supertest";
import { ACGuard } from "nest-access-control";
import { DefaultAuthGuard } from "../../auth/defaultAuth.guard";
import { ACLModule } from "../../auth/acl.module";
import { AclFilterResponseInterceptor } from "../../interceptors/aclFilterResponse.interceptor";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { map } from "rxjs";
import { BikeController } from "../bike.controller";
import { BikeService } from "../bike.service";

const nonExistingId = "nonExistingId";
const existingId = "existingId";
const CREATE_INPUT = {
  battery: "exampleBattery",
  brakes: "exampleBrakes",
  brand: "exampleBrand",
  cassette: "exampleCassette",
  chain: "exampleChain",
  chainGuide: "exampleChainGuide",
  charger: "exampleCharger",
  crank: "exampleCrank",
  createdAt: new Date(),
  damper: "exampleDamper",
  display: "exampleDisplay",
  fork: "exampleFork",
  frame: "exampleFrame",
  gear: "exampleGear",
  handlebar: "exampleHandlebar",
  headset: "exampleHeadset",
  id: "exampleId",
  kilometers: "exampleKilometers",
  lever: "exampleLever",
  model: "exampleModel",
  motor: "exampleMotor",
  pedalArm: "examplePedalArm",
  remote: "exampleRemote",
  seat: "exampleSeat",
  seatPost: "exampleSeatPost",
  seatPostRemote: "true",
  stem: "exampleStem",
  tires: "exampleTires",
  updatedAt: new Date(),
  wheelSet: "exampleWheelSet",
  year: "exampleYear",
};
const CREATE_RESULT = {
  battery: "exampleBattery",
  brakes: "exampleBrakes",
  brand: "exampleBrand",
  cassette: "exampleCassette",
  chain: "exampleChain",
  chainGuide: "exampleChainGuide",
  charger: "exampleCharger",
  crank: "exampleCrank",
  createdAt: new Date(),
  damper: "exampleDamper",
  display: "exampleDisplay",
  fork: "exampleFork",
  frame: "exampleFrame",
  gear: "exampleGear",
  handlebar: "exampleHandlebar",
  headset: "exampleHeadset",
  id: "exampleId",
  kilometers: "exampleKilometers",
  lever: "exampleLever",
  model: "exampleModel",
  motor: "exampleMotor",
  pedalArm: "examplePedalArm",
  remote: "exampleRemote",
  seat: "exampleSeat",
  seatPost: "exampleSeatPost",
  seatPostRemote: "true",
  stem: "exampleStem",
  tires: "exampleTires",
  updatedAt: new Date(),
  wheelSet: "exampleWheelSet",
  year: "exampleYear",
};
const FIND_MANY_RESULT = [
  {
    battery: "exampleBattery",
    brakes: "exampleBrakes",
    brand: "exampleBrand",
    cassette: "exampleCassette",
    chain: "exampleChain",
    chainGuide: "exampleChainGuide",
    charger: "exampleCharger",
    crank: "exampleCrank",
    createdAt: new Date(),
    damper: "exampleDamper",
    display: "exampleDisplay",
    fork: "exampleFork",
    frame: "exampleFrame",
    gear: "exampleGear",
    handlebar: "exampleHandlebar",
    headset: "exampleHeadset",
    id: "exampleId",
    kilometers: "exampleKilometers",
    lever: "exampleLever",
    model: "exampleModel",
    motor: "exampleMotor",
    pedalArm: "examplePedalArm",
    remote: "exampleRemote",
    seat: "exampleSeat",
    seatPost: "exampleSeatPost",
    seatPostRemote: "true",
    stem: "exampleStem",
    tires: "exampleTires",
    updatedAt: new Date(),
    wheelSet: "exampleWheelSet",
    year: "exampleYear",
  },
];
const FIND_ONE_RESULT = {
  battery: "exampleBattery",
  brakes: "exampleBrakes",
  brand: "exampleBrand",
  cassette: "exampleCassette",
  chain: "exampleChain",
  chainGuide: "exampleChainGuide",
  charger: "exampleCharger",
  crank: "exampleCrank",
  createdAt: new Date(),
  damper: "exampleDamper",
  display: "exampleDisplay",
  fork: "exampleFork",
  frame: "exampleFrame",
  gear: "exampleGear",
  handlebar: "exampleHandlebar",
  headset: "exampleHeadset",
  id: "exampleId",
  kilometers: "exampleKilometers",
  lever: "exampleLever",
  model: "exampleModel",
  motor: "exampleMotor",
  pedalArm: "examplePedalArm",
  remote: "exampleRemote",
  seat: "exampleSeat",
  seatPost: "exampleSeatPost",
  seatPostRemote: "true",
  stem: "exampleStem",
  tires: "exampleTires",
  updatedAt: new Date(),
  wheelSet: "exampleWheelSet",
  year: "exampleYear",
};

const service = {
  createBike() {
    return CREATE_RESULT;
  },
  bikes: () => FIND_MANY_RESULT,
  bike: ({ where }: { where: { id: string } }) => {
    switch (where.id) {
      case existingId:
        return FIND_ONE_RESULT;
      case nonExistingId:
        return null;
    }
  },
};

const basicAuthGuard = {
  canActivate: (context: ExecutionContext) => {
    const argumentHost = context.switchToHttp();
    const request = argumentHost.getRequest();
    request.user = {
      roles: ["user"],
    };
    return true;
  },
};

const acGuard = {
  canActivate: () => {
    return true;
  },
};

const aclFilterResponseInterceptor = {
  intercept: (context: ExecutionContext, next: CallHandler) => {
    return next.handle().pipe(
      map((data) => {
        return data;
      })
    );
  },
};
const aclValidateRequestInterceptor = {
  intercept: (context: ExecutionContext, next: CallHandler) => {
    return next.handle();
  },
};

describe("Bike", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: BikeService,
          useValue: service,
        },
      ],
      controllers: [BikeController],
      imports: [ACLModule],
    })
      .overrideGuard(DefaultAuthGuard)
      .useValue(basicAuthGuard)
      .overrideGuard(ACGuard)
      .useValue(acGuard)
      .overrideInterceptor(AclFilterResponseInterceptor)
      .useValue(aclFilterResponseInterceptor)
      .overrideInterceptor(AclValidateRequestInterceptor)
      .useValue(aclValidateRequestInterceptor)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  test("POST /bikes", async () => {
    await request(app.getHttpServer())
      .post("/bikes")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        createdAt: CREATE_RESULT.createdAt.toISOString(),
        updatedAt: CREATE_RESULT.updatedAt.toISOString(),
      });
  });

  test("GET /bikes", async () => {
    await request(app.getHttpServer())
      .get("/bikes")
      .expect(HttpStatus.OK)
      .expect([
        {
          ...FIND_MANY_RESULT[0],
          createdAt: FIND_MANY_RESULT[0].createdAt.toISOString(),
          updatedAt: FIND_MANY_RESULT[0].updatedAt.toISOString(),
        },
      ]);
  });

  test("GET /bikes/:id non existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/bikes"}/${nonExistingId}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No resource was found for {"${"id"}":"${nonExistingId}"}`,
        error: "Not Found",
      });
  });

  test("GET /bikes/:id existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/bikes"}/${existingId}`)
      .expect(HttpStatus.OK)
      .expect({
        ...FIND_ONE_RESULT,
        createdAt: FIND_ONE_RESULT.createdAt.toISOString(),
        updatedAt: FIND_ONE_RESULT.updatedAt.toISOString(),
      });
  });

  test("POST /bikes existing resource", async () => {
    const agent = request(app.getHttpServer());
    await agent
      .post("/bikes")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        createdAt: CREATE_RESULT.createdAt.toISOString(),
        updatedAt: CREATE_RESULT.updatedAt.toISOString(),
      })
      .then(function () {
        agent
          .post("/bikes")
          .send(CREATE_INPUT)
          .expect(HttpStatus.CONFLICT)
          .expect({
            statusCode: HttpStatus.CONFLICT,
          });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
