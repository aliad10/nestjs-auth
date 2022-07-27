// import { INestApplication, ValidationPipe } from "@nestjs/common";
// import { Test, TestingModule } from "@nestjs/testing";
// import { AppModule } from "./../src/app.module";
// import { Connection, connect } from "mongoose";
// import { ConfigModule, ConfigService } from "@nestjs/config";
// import Web3 from "web3";
// import { spec } from "pactum";

// describe("App e2e", () => {
//   let app: INestApplication;
//   let mongoConnection: Connection;
//   let config: ConfigService;
//   let web3: Web3;

//   beforeAll(async () => {
//     const moduleRef: TestingModule = await Test.createTestingModule({
//       imports: [AppModule, ConfigModule.forRoot({ isGlobal: true })],
//       providers: [ConfigService],
//     }).compile();

//     config = moduleRef.get<ConfigService>(ConfigService);

//     web3 = new Web3(
//       `https://rinkeby.infura.io/v3/${config.get("INFURA_PROJECT_ID")}`
//     );

//     mongoConnection = (await connect(config.get("MONGO_TEST_CONNECTION")))
//       .connection;

//     app = moduleRef.createNestApplication();

//     app.useGlobalPipes(
//       new ValidationPipe({
//         whitelist: true,
//       })
//     );

//     await app.init();
//     await app.listen(3333);
//   });

//   afterAll(async () => {
//     await mongoConnection.dropDatabase();
//     await mongoConnection.close();
//     app.close();
//   });

//   afterEach(async () => {
//     const collections = mongoConnection.collections;
//     for (const key in collections) {
//       const collection = collections[key];
//       await collection.deleteMany({});
//     }
//   });

//   it("get nonce", async () => {
//     //-----create account

//     let account = await web3.eth.accounts.create();

//     let test = await spec().get(
//       `http://localhost:3333/auth/nonce/${account.address}`
//     );

//     console.log("xxxxxxxxxxxxx", test);
//   });
// });

import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "./../src/app.module";
import { Connection, connect, Types } from "mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import Web3 from "web3";
import request from "supertest";
import { spec } from "pactum";

describe("App e2e", () => {
  let app: INestApplication;
  let mongoConnection: Connection;
  let config: ConfigService;
  let web3: Web3;
  let httpServer: any;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ConfigModule.forRoot({ isGlobal: true })],
      providers: [ConfigService],
    }).compile();

    config = moduleRef.get<ConfigService>(ConfigService);

    web3 = new Web3(
      `https://rinkeby.infura.io/v3/${config.get("INFURA_PROJECT_ID")}`
    );

    mongoConnection = (await connect(config.get("MONGO_TEST_CONNECTION")))
      .connection;

    app = moduleRef.createNestApplication();

    httpServer = app.getHttpServer();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      })
    );

    await app.init();
    await app.listen(3333);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await app.close();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  it("get nonce successfully", async () => {
    let account1 = await web3.eth.accounts.create();

    let res = await request(httpServer).get(`/auth/nonce/${account1.address}`);
    console.log("res = ", res.body.userId);

    //-----check status code
    // expect(res.statusCode).toBe(200);

    // //-----check body format

    // expect(res.body).toMatchObject({
    //   message: expect.any(String),
    //   userId: expect.any(String),
    // });

    let x = await mongoConnection.db
      .collection("users")
      .findOne({ _id: new Types.ObjectId(res.body.userId) });

    console.log("x = ", x);

    // let user = mongoConnection.collection("users").find({});
    // let x = mongoConnection.db
    //   .collection("users")
    //   .find()
    //   .forEach((it) => {
    //     console.log("it = ", it);
    //   });

    // console.log("user", await mongoConnection.db["users"].find({}));
  });
});
