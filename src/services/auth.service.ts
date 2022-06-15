import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CreateUserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken, TokenData } from '../interfaces/auth.interface';
import { User } from '../interfaces/users.interface';
import { Provider } from '../interfaces/provider.interface';
import userModel from '../models/users.model';
import { isEmptyObject, isNullOrEmpty, slugify, randomString } from '../utils/util';
import shortid from 'shortid';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

class AuthService {
  public users = userModel;

  public async signup(userData: CreateUserDto): Promise<string> {
    if (isEmptyObject(userData)) throw new HttpException(400, 'All fields are required');
    userData.birthDate = new Date(userData.birthDate);
    userData.fullName = userData.firstName + ' ' + userData.lastName;
    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `Email address ${userData.email} already exists`);
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const u = new this.users({ ...userData, password: hashedPassword });
    u.slug = slugify(u.fullName);
    u.activated = false;
    if (await this.users.exists({ slug: u.slug })) {
      u.slug = u.slug + shortid.generate();
    }

    u.confirmationToken = uuidv4() + randomString(60) + shortid.generate();
    u.activated = false;

    const url = `https://linkedfishers.com/activate/${u.confirmationToken}`;
    try {
      await this.sendConfirmationEmail(u, url);
    } catch (err) {
      throw new HttpException(500, err);
    }
    const createUserData: User = await u.save();
    return ` Sent confirmation mail`;
  }

  public async providerSignup(providerData): Promise<Provider> {
    if (isEmptyObject(providerData)) throw new HttpException(400, 'All fields are required');
    const exists = await userModel.exists({ companyEmail: providerData.email });
    if (exists) {
      if (isEmptyObject(providerData)) throw new HttpException(400, 'There is already a provider with this email address');
    }
    const hashedPassword = await bcrypt.hash(providerData.password, 10);
    const provider = new userModel({ ...providerData, password: hashedPassword });
    provider.slug = slugify(provider.companyName);
    provider.profilePicture = 'profilePictures/default-company.png';
    provider.role = 'provider';
    if (await userModel.exists({ slug: provider.slug })) {
      provider.slug = provider.slug + shortid.generate();
    }
    return await provider.save();
  }

  public async requestPasswordReset(email: string) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const resetPasswordToken = randomString(60) + shortid.generate() + uuidv4();
    const user = await this.users.findOneAndUpdate(
      { email: email },
      {
        $set: {
          resetPasswordToken: resetPasswordToken,
          resetPasswordExpires: tomorrow,
        },
      },
    );

    if (!user) {
      throw new HttpException(400, 'No user with this email');
    }

    const url = `https://linkedfishers.com/reset-password/${resetPasswordToken}`;
    this.sendPasswordResetEmail(user, url);
    return 'Sent Reset password mail';
  }

  public async verifyResetPasswordToken(token: string): Promise<User> {
    if (!token) {
      throw new HttpException(409, 'Missing token!');
    }
    const user: User = await this.users.findOne({ resetPasswordToken: token });
    if (!user) {
      throw new HttpException(409, 'Invalid password token');
    }
    if (user.resetPasswordExpires < new Date()) {
      throw new HttpException(409, 'Token expired');
    }
    return user;
  }

  public async resetPassword(token: string, newPassword: string) {
    let user: User = await this.verifyResetPasswordToken(token);
    if (!user) {
      throw new HttpException(409, 'Token expired');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user = await this.users.findByIdAndUpdate(user._id, {
      $set: {
        password: hashedPassword,
      },
      $unset: {
        resetPasswordExpires: '',
        resetPasswordToken: '',
      },
    });
    const tokenData = this.createToken(user);
    return tokenData;
  }

  public async login(userData: CreateUserDto): Promise<TokenData> {
    if (isEmptyObject(userData)) throw new HttpException(400, 'Missing credentials');

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(409, `No user was found with email address: ${userData.email}`);

    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Wrong password!');

    if (!findUser.activated) {
      throw new HttpException(409, 'Email not verified');
    }
    const tokenData = this.createToken(findUser);
    return tokenData;
  }

  public async loginwithFacebook(userData: User): Promise<TokenData> {
    if (isEmptyObject(userData)) throw new HttpException(400, 'Miqsing credentials');

    let user: User = await this.users.findOne({ facebook: userData.facebook });
    console.log(user);

    if (!user) {
      const userAlreadyExists = await this.users.exists({ email: userData.email });
      if (userAlreadyExists) {
        throw new HttpException(400, 'There is already an account exist with this email ');
      }

      const u = new this.users({ ...userData });
      u.slug = slugify(u.fullName);
      u.activated = true;
      if (this.users.exists({ slug: u.slug })) {
        u.slug = u.slug + shortid.generate();
      }
      user = await u.save();
    }
    const tokenData = this.createToken(user);
    return tokenData;
  }

  public async loginWithGoogle(userData: User): Promise<TokenData> {
    if (isEmptyObject(userData)) throw new HttpException(400, 'Missing credentials');
    let user: User = await this.users.findOne({ googleId: userData.googleId });
    if (!user) {
      const userAlreadyExists = await this.users.exists({ email: userData.email });
      if (userAlreadyExists) {
        throw new HttpException(400, 'There is already an account with this email address');
      }
      const u = new this.users({ ...userData });
      u.slug = slugify(u.fullName);
      u.activated = true;
      if (this.users.exists({ slug: u.slug })) {
        u.slug = u.slug + shortid.generate();
      }
      user = await u.save();
    }
    const tokenData = this.createToken(user);
    return tokenData;
  }

  public async providerLogin(providerData): Promise<TokenData> {
    if (isEmptyObject(providerData)) throw new HttpException(400, 'Missing credentials');

    const provider: Provider = await this.users.findOne({
      $and: [{ email: providerData.email }, { role: 'provider' }],
    });
    if (!provider) throw new HttpException(409, `No provider was found with email address: ${providerData.email}`);

    const isPasswordMatching: boolean = await bcrypt.compare(providerData.password, provider.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Wrong password!');

    if (!provider.activated) {
      throw new HttpException(409, 'Provider account not verified');
    }
    const tokenData = this.createProviderToken(provider);
    return tokenData;
  }

  public async verifyActivationToken(token: string): Promise<User> {
    const user: User = await this.users.findOne({ confirmationToken: token });
    if (!user || user.activated) {
      throw new HttpException(409, 'Invalid confirmation token');
    }
    await this.users.findByIdAndUpdate(user._id, { $set: { activated: true }, $unset: { confirmationToken: 1 } });
    return user;
  }

  public async logout(userData: User): Promise<User> {
    if (isEmptyObject(userData)) throw new HttpException(400, 'Invalid user');

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(409, 'User not found');

    return findUser;
  }

  public async updatePassword(user: User, oldPassword: string, newPassword: string): Promise<TokenData> {
    if (isNullOrEmpty(oldPassword) || isNullOrEmpty(newPassword)) {
      throw new HttpException(409, "Password can't be empty");
    }
    const isPasswordMatching: boolean = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatching) {
      throw new HttpException(409, 'Old Password is wrong!');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user = await this.users.findByIdAndUpdate(user._id, {
      $set: {
        password: hashedPassword,
      },
    });
    const tokenData = this.createToken(user);
    return tokenData;
  }

  public async updateUser(userId: string, userData: User): Promise<TokenData> {
    if (isEmptyObject(userData)) throw new HttpException(400, 'Missing user data');
    if (userId != userData._id) throw new HttpException(401, 'Unauthorized');

    if (await this.users.exists({ $and: [{ email: userData.email }, { _id: { $ne: userId } }] })) {
      throw new HttpException(400, 'Email already exists!');
    }

    if (userData.slug) {
      userData.slug = slugify(userData.slug);
    }

    if (await this.users.exists({ $and: [{ slug: userData.slug }, { _id: { $ne: userId } }] })) {
      throw new HttpException(400, 'user url already exists!');
    }

    const user: User = await this.users.findByIdAndUpdate(userId, userData, { new: true }).select('-__v -password');
    if (!user) throw new HttpException(409, 'User not found');

    const tokenData = this.createToken(user);
    return tokenData;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
      profilePicture: user.profilePicture,
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      language: user.language,
      slug: user.slug,
    };
    const secret: string = process.env.JWT_SECRET;
    const expiresIn: number = 60 * 60 * 60;

    return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }) };
  }

  public createProviderToken(provider: Provider): TokenData {
    const dataStoredInToken = {
      _id: provider._id,
      profilePicture: provider.profilePicture,
      companyName: provider.companyName,
      role: provider.role,
      language: provider.language,
      slug: provider.slug,
    };
    const secret: string = process.env.JWT_SECRET;
    const expiresIn: number = 60 * 60 * 60;

    return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }

  public async sendEmail(emailAdress: string, content: string, subject: string): Promise<any> {
    const smtpConfig = {
      host: 'cp7.tn.oxa.host',//mail.oxa.host
      port: 465,
      secure: true,
  /*  key: fs.readFileSync('/etc/ssl/private/www.linkedfishers.com.key', { encoding: 'utf8' }),
      cert: fs.readFileSync('/etc/ssl/private/www.linkedfishers.com.pem', { encoding: 'utf8' }), */
      requireTLS: true,
      auth: {
        user: 'direction@hookedup.tn',
        pass: 'HoukedUp@2021',
      },
      /*
      key: fs.readFileSync('/etc/ssl/private/www.linkedfishers.com.key', { encoding: 'utf8' }),
      cert: fs.readFileSync('/etc/ssl/private/www.linkedfishers.com.pem', { encoding: 'utf8' }), */
      tls: {
        rejectUnauthorized: false,
      },
      logger: true,
    };

    const transporter = nodemailer.createTransport(smtpConfig);
    const mailOptions = {
      from: 'direction@hookedup.tn',
      to: emailAdress,
      subject: subject,
      html: content,
    };
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error, info) {
        try {
          if (error) {
            console.log('error is ' + error);
            reject(error);
          } else {
            console.log('Email sent: ' + info.response);
            resolve(true);
          }
        } catch (err) {
          console.log(err);
        }
      });
    });
  }

  private async sendConfirmationEmail(user: User, url: string): Promise<any> {
    const html = `
    <center>
    <td>
    <table align="center" bgcolor="#FFFFFF" class="m_444611345908390707row" style="margin:0 auto">
        <tbody>
            <tr>
                <td class="m_444611345908390707spacer" colspan="2" height="30"
                    style="font-size:30px;line-height:30px;margin:0;padding:0">&nbsp;</td>
            </tr>

            <tr>
                <td class="m_444611345908390707spacer" colspan="2" height="30"
                    style="font-size:30px;line-height:30px;margin:0;padding:0">&nbsp;</td>
            </tr>
        </tbody>
    </table>

    <table align="center" bgcolor="#FFFFFF" class="m_444611345908390707row"
        style="word-break:break-all;border-spacing:0;margin:0 auto;border-top:1px solid #eeeeee">
        <tbody>
            <tr>
                <td class="m_444611345908390707spacer" colspan="2" height="30"
                    style="font-size:30px;line-height:30px;margin:0;padding:0" width="100%">&nbsp;</td>
            </tr>
            <tr class="m_444611345908390707mobile-full-width" style="vertical-align:top" valign="top">
                <th class="m_444611345908390707column m_444611345908390707mobile-last"
                    style="width:400px;padding:0;padding-left:30px;padding-right:30px;font-weight:400" width="400">
                    <table bgcolor="#FFFFFF" style="border-spacing:0;width:100%" width="100%">
                        <tbody>
                            <tr>
                                <th class="m_444611345908390707sans-serif" style="padding:0;text-align:left">
                                    <div class="m_444611345908390707sans-serif"
                                        style="color:rgb(150,154,161);font-weight:400;line-height:30px;margin:0;padding:0">


                                        <div style="margin-bottom:15px;font-size:15px;color:#747487">Hello <a
                                                href="mailto:${user.email}"
                                                style="color:#747487;text-decoration:none"
                                                target="_blank">${user.fullName}</a>,</div>
                                        <div style="margin-bottom:15px;font-size:15px;color:#747487">Welcome to Linked Fishers!
                                        <br>
                                        <center>
                                            <table bgcolor="#2D8CFF"
                                                style="border-spacing:0;border-radius:3px;margin:0 auto">
                                                <tbody>
                                                    <tr>
                                                        <td class="m_444611345908390707sans-serif" style="padding:0"><a
                                                                href="${url}"
                                                                style="border:0 solid #2d8cff;display:inline-block;font-size:14px;padding:15px 50px 15px 50px;text-align:center;font-weight:700;text-decoration:none;color:#ffffff"
                                                                target="_blank">
                                                                Activate Account</a></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </center>
                                        <table align="center" bgcolor="#FFFFFF" class="m_444611345908390707row"
                                            style="border-spacing:0;margin:0 auto">
                                            <tbody>
                                                <tr>
                                                    <td class="m_444611345908390707spacer" colspan="2" height="20"
                                                        style="font-size:20px;line-height:20px;margin:0;padding:0"
                                                        width="100%">&nbsp;</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div
                                            style="margin-bottom:15px;font-size:15px;color:#747487;word-break:break-all">
                                            Or paste this link into your browser:<br><a
                                                href="${url}"
                                                style="color:#2d8cff;font-weight:700;text-decoration:none"
                                                target="_blank">
                                                ${url}</a>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </th>
            </tr>

        </tbody>
    </table>


</td>
</center>

    `;
    return this.sendEmail(user.email, html, 'Please activate your LinkedFishers account');
  }

  private async sendPasswordResetEmail(user: User, url: string): Promise<any> {
    const html = `
    <center>
    <td>
    <table align="center" bgcolor="#FFFFFF" class="m_444611345908390707row" style="margin:0 auto">
        <tbody>
            <tr>
                <td class="m_444611345908390707spacer" colspan="2" height="30"
                    style="font-size:30px;line-height:30px;margin:0;padding:0">&nbsp;</td>
            </tr>

            <tr>
                <td class="m_444611345908390707spacer" colspan="2" height="30"
                    style="font-size:30px;line-height:30px;margin:0;padding:0">&nbsp;</td>
            </tr>
        </tbody>
    </table>

    <table align="center" bgcolor="#FFFFFF" class="m_444611345908390707row"
        style="word-break:break-all;border-spacing:0;margin:0 auto;border-top:1px solid #eeeeee">
        <tbody>
            <tr>
                <td class="m_444611345908390707spacer" colspan="2" height="30"
                    style="font-size:30px;line-height:30px;margin:0;padding:0" width="100%">&nbsp;</td>
            </tr>
            <tr class="m_444611345908390707mobile-full-width" style="vertical-align:top" valign="top">
                <th class="m_444611345908390707column m_444611345908390707mobile-last"
                    style="width:400px;padding:0;padding-left:30px;padding-right:30px;font-weight:400" width="400">
                    <table bgcolor="#FFFFFF" style="border-spacing:0;width:100%" width="100%">
                        <tbody>
                            <tr>
                                <th class="m_444611345908390707sans-serif" style="padding:0;text-align:left">
                                    <div class="m_444611345908390707sans-serif"
                                        style="color:rgb(150,154,161);font-weight:400;line-height:30px;margin:0;padding:0">


                                        <div style="margin-bottom:15px;font-size:15px;color:#747487">Hello <a
                                                href="mailto:${user.email}"
                                                style="color:#747487;text-decoration:none"
                                                target="_blank">${user.fullName}</a>,</div>
                                        <div style="margin-bottom:15px;font-size:15px;color:#747487">We received a password reset request for your Linked Fishers account!
                                        <br>
                                        <center>
                                            <table bgcolor="#2D8CFF"
                                                style="border-spacing:0;border-radius:3px;margin:0 auto">
                                                <tbody>
                                                    <tr>
                                                        <td class="m_444611345908390707sans-serif" style="padding:0"><a
                                                                href="${url}"
                                                                style="border:0 solid #2d8cff;display:inline-block;font-size:14px;padding:15px 50px 15px 50px;text-align:center;font-weight:700;text-decoration:none;color:#ffffff"
                                                                target="_blank">
                                                                Reset password</a></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </center>
                                        <table align="center" bgcolor="#FFFFFF" class="m_444611345908390707row"
                                            style="border-spacing:0;margin:0 auto">
                                            <tbody>
                                                <tr>
                                                    <td class="m_444611345908390707spacer" colspan="2" height="20"
                                                        style="font-size:20px;line-height:20px;margin:0;padding:0"
                                                        width="100%">&nbsp;</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div
                                            style="margin-bottom:15px;font-size:15px;color:#747487;word-break:break-all">
                                            Or paste this link into your browser:<br><a
                                                href="${url}"
                                                style="color:#2d8cff;font-weight:700;text-decoration:none"
                                                target="_blank">
                                                ${url}</a>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </th>
            </tr>

        </tbody>
    </table>


</td>
</center>

    `;
    return this.sendEmail(user.email, html, 'Password reset');
  }
}

export default AuthService;
