import { ForbiddenException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./../user/dtos";
import * as bcrypt from "bcryptjs";
import * as ESU from "eth-sig-util";
import { ConfigService } from "@nestjs/config";
import { UserService } from "src/user/user.service";
import { LoginDto } from "./dtos";
import { JwtService } from "@nestjs/jwt";
import { MailerService } from "@nestjs-modules/mailer";
import { VerificationRepository } from "./auth.repository";

import { getRandomNonce, checkPublicKey } from "./../common/helpers";
@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private authRepo: VerificationRepository
  ) {}

  // async signup(dto: CreateUserDto) {
  //   const secretPepper = this.configService.get<string>("PEPPER");
  //   const hashPass = bcrypt.hashSync(dto.password + secretPepper, 10);

  //   dto.password = hashPass;

  //   const user = await this.userService.create(dto);

  //   const tokens = await this.getTokens(user._id, user.username);

  //   await this.updateRtHash(user._id, tokens.refresh_token);

  //   return tokens;
  // }
  // async signin(dto: LoginDto) {
  //   const user = await this.userService.findUser(dto.username);
  //   if (!user) {
  //     throw new ForbiddenException("not found or invalid password");
  //   }

  //   const secretPepper = this.configService.get<string>("PEPPER");
  //   const isCorrectPassword = bcrypt.compareSync(
  //     dto.password + secretPepper,
  //     user.password
  //   );

  //   if (!isCorrectPassword) {
  //     throw new ForbiddenException("not found or invalid password");
  //   }
  //   const tokens = await this.getTokens(user._id, user.username);

  //   await this.updateRtHash(user._id, tokens.refresh_token);

  //   const verificationCodes = await this.authRepo.find({
  //     username: user.username,
  //     expireAt: { $gt: new Date() },
  //   });

  //   console.log("now", new Date());
  //   console.log(verificationCodes);

  //   if (verificationCodes.length > 0) {
  //     throw new ForbiddenException("email sended to you");
  //   }

  //   await this.authRepo.deleteMany({
  //     username: user.username,
  //     expireAt: { $lt: new Date() },
  //   });

  //   await this.authRepo.create({
  //     username: user.username,
  //     code: this.genRandomToken(),
  //   });

  //   return "please verify your self";
  // }

  // async verify(username, code) {
  //   let verificationObj = await this.authRepo.findOne({ username });

  //   if (verificationObj.code != code) {
  //     return "not verified";
  //   }
  //   return "verified";
  // }

  getMe(userId: string) {
    return this.userService.findUserById(userId);
  }

  // async logout(userId: string) {
  //   return await this.userService.updateUserById(userId, { hashedRt: null });
  // }

  // async refreshToken(userId: string, rt: string) {
  //   const user = await this.userService.findUser(userId);
  //   if (!user) {
  //     throw new ForbiddenException("not found or invalid password");
  //   }

  //   const isCorrectPassword = bcrypt.compareSync(rt, user.hashedRt);

  //   if (!isCorrectPassword) {
  //     throw new ForbiddenException("not found or invalid password");
  //   }

  //   const tokens = await this.getTokens(user._id, user.username);

  //   await this.updateRtHash(user._id, tokens.refresh_token);

  //   return tokens;
  // }

  async getNonce(wallet: string) {
    // check valid wallet address

    console.log("checkPublicKey(wallet) = ", checkPublicKey(wallet));

    if (!checkPublicKey(wallet)) throw new ForbiddenException("invalid wallet");
    let user = await this.userService.findUserByWallet(wallet);

    const nonce = getRandomNonce();

    if (user) {
      return { nonce: user.nonce, userId: user._id };
    }

    const newUser = await this.userService.create({
      nonce,
      walletAddress: wallet,
    });

    return { nonce: newUser.nonce, userId: newUser._id };
  }

  async loginWithWallet(walletAddress: string) {
    if (!checkPublicKey(walletAddress))
      throw new ForbiddenException("invalid wallet");
    const user = await this.userService.findUserByWallet(walletAddress);
    if (!user) throw new ForbiddenException("user not exist");

    const signature = {
      address: "0x4111d150e622d079dea00f25f130fd733f1e7180",
      msg: "0x37383838",
      sig: "01479e1cceddaa45bf5543aa77c972f0913d41d51105a4d3c6ca78fc5f1d0a1d018e72d315251273add93e8d1a201792d4eaff5a23d151b8378d3455f4e042191c",
      version: "3",
      signer: "MEW",
    };

    const exampleMessage = "Example `personal_sign` message";
    const msg = `0x${Buffer.from(exampleMessage, "utf8").toString("hex")}`;
    const sign =
      "0x1df72e6afe7311284d7680f852928a80a4d8557baf41e01e318c65c09bb13de737e854caffe704e752bbf064149c775ca11523cb65a8d14195c3db2d6d5687c21b";
    const recoveredAddr = ESU.recoverPersonalSignature({
      data: msg,
      sig: sign,
    });

    console.log("ddddd", recoveredAddr);
    const ok = true;
    if (!ok) throw new ForbiddenException("invalid credentials");

    //change users nonce

    const nonce: number = getRandomNonce();

    await this.userService.updateUserById(user._id, { nonce });

    return {
      access_token: await this.getAccessToken(user._id, user.walletAddress),
    };
  }

  async getAccessToken(userId: string, walletAddress: string) {
    const payload = { userId, walletAddress };

    return this.jwtService.signAsync(payload, {
      expiresIn: 60 * 60 * 24 * 30,
      secret: this.configService.get<string>("JWT_SECRET"),
    });
  }

  async getTokens(userId: string, username: string) {
    const payload = { sub: userId, username };
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: 60 * 15,
        secret: "at-secret",
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: 60 * 60 * 24,
        secret: "rt-secret",
      }),
    ]);

    return { access_token: at, refresh_token: rt };
  }

  async updateRtHash(userId, rt: string) {
    const hash = await bcrypt.hashSync(rt, 10);
    await this.userService.updateUserById(userId, { hashedRt: hash });
  }

  async sendConfirmationEmail(email: string, fullName: string, code: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: "Welcome to Nice App",
      template: "cofirm",
      context: {
        fullName,
        code,
      },
    });
  }
  async sendConfirmedEmail(email: string, fullName: string) {
    return await this.mailerService.sendMail({
      to: email,
      subject: "you are confirmed",
      text: "hello",
      html: "<b> hello world? </b>",
    });
  }
  //return 6 digit random token
  genRandomToken() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
