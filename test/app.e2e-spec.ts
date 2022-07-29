import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "./../src/app.module";
import { Connection, connect, Types } from "mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import Web3 from "web3";
import request from "supertest";
import { Messages } from "./../src/common/constants";
import Jwt from "jsonwebtoken";

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

    let account2 = await web3.eth.accounts.create();

    let getNonceResult1 = await request(httpServer).get(
      `/auth/nonce/${account1.address}`
    );

    //-----check status code
    expect(getNonceResult1.statusCode).toBe(200);

    //-----check body format

    expect(getNonceResult1.body).toMatchObject({
      message: expect.any(String),
      userId: expect.any(String),
    });

    //------------- check user insert

    let user = await mongoConnection.db
      .collection("users")
      .findOne({ _id: new Types.ObjectId(getNonceResult1.body.userId) });

    expect(user).toBeTruthy();

    expect(user.walletAddress).toBe(account1.address);

    expect(`${Messages.SIGN_MESSAGE}${user.nonce}`).toBe(
      getNonceResult1.body.message
    );

    //check user collection count (must be 1 [newUser Added!])
    let usersCountAfterFirstGetNonceForAccount1 = await mongoConnection.db
      .collection("users")
      .countDocuments();

    expect(usersCountAfterFirstGetNonceForAccount1).toBe(1);

    ///// ---------------------- get nonce for account1 and nonce must be the same

    let getNonceResult2 = await request(httpServer).get(
      `/auth/nonce/${account1.address}`
    );

    expect(getNonceResult2.body.message).toBe(getNonceResult1.body.message);

    //check user collection count (must be 1 [no user Added!])
    let usersCountAfterFirstGetNonceForAccount2: number =
      await mongoConnection.db.collection("users").countDocuments();

    expect(usersCountAfterFirstGetNonceForAccount2).toBe(1);

    //--------------- get nonce for new user (create new user)

    let getNonceResult3 = await request(httpServer).get(
      `/auth/nonce/${account2.address}`
    );

    //-----check status code
    expect(getNonceResult3.statusCode).toBe(200);

    //-----check body format

    expect(getNonceResult3.body).toMatchObject({
      message: expect.any(String),
      userId: expect.any(String),
    });

    let user2 = await mongoConnection.db
      .collection("users")
      .findOne({ _id: new Types.ObjectId(getNonceResult3.body.userId) });

    expect(user2).toBeTruthy();

    expect(user2.walletAddress).toBe(account2.address);

    expect(`${Messages.SIGN_MESSAGE}${user2.nonce}`).toBe(
      getNonceResult3.body.message
    );

    //check user collection count (must be 2 [newUser Added!])

    let usersCountAfterFirstGetNonceForAccount3: number =
      await mongoConnection.db.collection("users").countDocuments();

    expect(usersCountAfterFirstGetNonceForAccount3).toBe(2);
  });

  it("fail to get nonce", async () => {
    let getNonceResult1 = await request(httpServer).get(`/auth/nonce/${1}`);

    expect(getNonceResult1.statusCode).toBe(400);

    expect(getNonceResult1.body.statusCode).toBe(400);

    expect(getNonceResult1.body.message).toBe("invalid wallet");

    let getNonceResult2 = await request(httpServer).get(
      `/auth/nonce/${0x4111d150e622d079dea00f25f130fd733f1e7180}`
    );

    expect(getNonceResult2.statusCode).toBe(400);

    expect(getNonceResult2.body.statusCode).toBe(400);

    expect(getNonceResult2.body.message).toBe("invalid wallet");

    let getNonceResult3 = await request(httpServer).get(
      `/auth/nonce/${"not wallet address"}`
    );

    expect(getNonceResult3.statusCode).toBe(400);

    expect(getNonceResult3.body.statusCode).toBe(400);

    expect(getNonceResult3.body.message).toBe("invalid wallet");
  });

  it("signin with wallet", async () => {
    let account = await web3.eth.accounts.create();

    let res = await request(httpServer).get(`/auth/nonce/${account.address}`);

    const userBeforeLogin = await mongoConnection.db
      .collection("users")
      .findOne({ _id: new Types.ObjectId(res.body.userId) });

    let signResult = account.sign(res.body.message);

    let loginResult = await request(httpServer)
      .post(`/auth/signinWithWallet/${account.address}`)
      .send({ signature: signResult.signature });

    const userAfterLogin = await mongoConnection.db
      .collection("users")
      .findOne({ _id: new Types.ObjectId(res.body.userId) });

    expect(loginResult.statusCode).toBe(201);

    expect(loginResult.body.access_token).toBeTruthy();

    const accessToken: string = loginResult.body.access_token;

    let decodedAccessToken = Jwt.decode(accessToken);

    expect(decodedAccessToken["walletAddress"]).toBe(account.address);

    expect(decodedAccessToken["userId"]).toBe(res.body.userId);

    // after login nonce must be changed

    expect(userAfterLogin.nonce).not.toBe(userBeforeLogin.nonce);
  });

  it("fail to signin with wallet", async () => {
    const account1 = await web3.eth.accounts.create();

    const account2 = await web3.eth.accounts.create();

    const invalidMessageToSign: string = "invalid message to sign";

    let getNonceResultForAccount1 = await request(httpServer).get(
      `/auth/nonce/${account1.address}`
    );

    //fail because signature is not string
    let loginResult1 = await request(httpServer)
      .post(`/auth/signinWithWallet/${account1.address}`)
      .send({ signature: 1 });

    expect(loginResult1.body.statusCode).toBe(400);
    expect(loginResult1.body.message).toContain("signature must be a string");

    //fail because of invalid wallet

    let loginResult2 = await request(httpServer)
      .post(`/auth/signinWithWallet/${1}`)
      .send({ signature: "string" });

    expect(loginResult2.statusCode).toBe(400);

    expect(loginResult2.body.statusCode).toBe(400);

    expect(loginResult2.body.message).toBe("invalid wallet");

    let loginResult3 = await request(httpServer)
      .post(`/auth/signinWithWallet/${"invaid wallet"}`)
      .send({ signature: "string" });

    expect(loginResult3.statusCode).toBe(400);

    expect(loginResult3.body.statusCode).toBe(400);

    expect(loginResult3.body.message).toBe("invalid wallet");

    // not found user
    let loginResult4 = await request(httpServer)
      .post(`/auth/signinWithWallet/${account2.address}`)
      .send({ signature: "string" });

    expect(loginResult4.statusCode).toBe(404);

    expect(loginResult4.body.statusCode).toBe(404);

    expect(loginResult4.body.message).toBe("user not exist");

    // fail because user sign other message
    let invalidSignatureResult1 = await account1.sign(invalidMessageToSign);

    let loginResult5 = await request(httpServer)
      .post(`/auth/signinWithWallet/${account1.address}`)
      .send({ signature: invalidSignatureResult1.signature });

    expect(loginResult5.statusCode).toBe(403);

    expect(loginResult5.body.statusCode).toBe(403);

    expect(loginResult5.body.message).toBe("invalid credentials");

    // other user sign with another user's nonce
    let getNonceResultForAccount2 = await request(httpServer).get(
      `/auth/nonce/${account2.address}`
    );

    let invalidSignatureResult2 = await account2.sign(
      getNonceResultForAccount1.body.message
    );

    let loginResult6 = await request(httpServer)
      .post(`/auth/signinWithWallet/${account2.address}`)
      .send({ signature: invalidSignatureResult2.signature });

    expect(loginResult6.statusCode).toBe(403);

    expect(loginResult6.body.statusCode).toBe(403);

    expect(loginResult6.body.message).toBe("invalid credentials");
    //---------------- sign with correct user and every thing work correct
    const signatureResult1 = await account1.sign(
      getNonceResultForAccount1.body.message
    );

    const signatureResult2 = await account2.sign(
      getNonceResultForAccount2.body.message
    );

    let loginResult7 = await request(httpServer)
      .post(`/auth/signinWithWallet/${account1.address}`)
      .send({ signature: signatureResult1.signature });

    expect(loginResult7.statusCode).toBe(201);

    let loginResult8 = await request(httpServer)
      .post(`/auth/signinWithWallet/${account2.address}`)
      .send({ signature: signatureResult2.signature });
    expect(loginResult8.statusCode).toBe(201);
  });
});
