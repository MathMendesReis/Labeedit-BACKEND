import { UserDataBase } from '../database/UserDataBase';
import { Input } from '../inteface/InputLogin';
import { OutputGetUser } from '../inteface/outputGetUse';
import { IdGenerator } from '../services/IdGenerator';
    // eslint-disable-next-line no-unused-vars
import { TokenManager, TokenPayload } from '../services/TokenManager';
import { InputSingUp } from '../DTOs/InputSingUp.DTO';
import { BadRequestError } from '../error/BadRequestError';
import { Role, Users } from '../models/User';
import { HashManager } from '../services/HashManager';
import { NotFoundError } from '../error/NotFoundError';
import { InputUpdate } from '../DTOs/inputUpdate.DTO';
import { InputDelete } from '../DTOs/inputDelete.DTO';


export class UserBusiness {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private userBaseDataBase :  UserDataBase,
     // eslint-disable-next-line no-unused-vars
    private idGenerator: IdGenerator,
    // eslint-disable-next-line no-unused-vars
    private tokenManager: TokenManager,
    // eslint-disable-next-line no-unused-vars
    private hashManager: HashManager,

  ) {}

  public login = async ({email,password}: Input): Promise<OutputGetUser | Error> => {
    const userDB = await this.userBaseDataBase.findUsersByEmail(email);
    if (!userDB) throw new NotFoundError('EMAIL não encontrado');
    const hashedPassword = userDB.password;
    const isPasswordCorrect = await this.hashManager.compare(password, hashedPassword);
    if (!isPasswordCorrect) throw new BadRequestError(' email ou password incorretos');
    const tokenPayload: TokenPayload = {
      id: userDB.id,
      role:userDB.email
  };
  const token = this.tokenManager.createToken(tokenPayload);
    return {
      message:'Login realizado com sucesso',
      token
    };
  };

  public singUp =async ({name,email,password}: InputSingUp):Promise<OutputGetUser | Error> => {
    const isEmail =  await this.userBaseDataBase.findUsersByEmail(email);
    if(isEmail) throw new BadRequestError('Requisição inválida');
    const id = this.idGenerator.generate();
    const hashedPassword = await this.hashManager.hash(password);
    const newUser = new Users(
      id,
      name,
      email,
      Role.USER,
      hashedPassword,
      new Date().toISOString()
      );
      await this.userBaseDataBase.insertUserInDB(newUser);
      const tokenPayload: TokenPayload = {
        id: newUser.getId(),
        role: newUser.getRole()
      };
      const token = this.tokenManager.createToken(tokenPayload);
      return {
        message:'Usúario cadastrado com sucesso.',
        token
      };
    };

    public updateUser =async (newData:InputUpdate):Promise<string | Error> => {
      const userDB = await this.userBaseDataBase.findUserById(newData.id);
       if (!userDB) throw new NotFoundError();
       if(newData.email && newData.email !== userDB.email){
          const isEmailInSB = await this.userBaseDataBase.findUsersByEmail(newData.email);
          if (isEmailInSB) throw new BadRequestError('Email já cadastrado');
        }
        const updateUser = new Users(
          userDB.id,
          newData.name || userDB.name,
          newData.email || userDB.email,
          userDB.role,
          userDB.password,
          userDB.created_at
        );
       await this.userBaseDataBase.updateUser(updateUser);
      return 'Cadastro atualizado com sucesso.';
   };

  public deleteUserById =async (id:InputDelete):Promise<string | Error> => {
    const userDB = await this.userBaseDataBase.findUserById(id.id);
    if (!userDB) throw new NotFoundError('ID não cadastrado');
    await this.userBaseDataBase.deleteUserById(userDB.id);
    return 'Delete user sucesseful';
  };
}
