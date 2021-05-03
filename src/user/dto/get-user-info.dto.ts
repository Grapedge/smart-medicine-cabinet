import { IUserInfo } from '../user.interface';

export class GetUserInfoRsp implements IUserInfo {
  name: string;
  phone: string;
}
