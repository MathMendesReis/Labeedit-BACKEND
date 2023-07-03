import { message } from '../DTOs/ReturnCreateAccoout.DTO';
import { OutputUserLogin } from '../DTOs/outputUserLogin.DTO';
import { UserDataBase } from '../database/UserDataBase';
import { BadRequestError } from '../error/BadRequestError';
import { NotFoundError } from '../error/NotFoundError';
import { User, user } from '../models/User';
import { HashManager } from '../services/HashManager';
import { IdGenerator } from '../services/IdGenerator';
import {
	TokenManager,
	TokenPayload,
	USER_ROLES,
} from '../services/TokenManager';

export class UserBusines {
	constructor(
		private userDataBase: UserDataBase,
		private idGenerator: IdGenerator,
		private tokenManager: TokenManager,
		private hashManager: HashManager
	) {}

	public userLogin = async (
		email: string,
		password: string
	): Promise<OutputUserLogin> => {
		const userDB = await this.userDataBase.foundUserByEmail(email);
		if (!userDB) {
			throw new NotFoundError('Not found Email');
		}
		const hashedPassword = userDB.password;
		const isPasswordCorrect = await this.hashManager.compare(
			password,
			hashedPassword
		);

		if (!isPasswordCorrect) {
			throw new BadRequestError('\'email\' ou \'password\' incorretos');
		}

		const payload: TokenPayload = {
			id: userDB.id,
			role: userDB.role,
		};

		const token = this.tokenManager.createToken(payload);

		return {
			token,
		};
	};
	public createAccount = async (
		name: string,
		email: string,
		password: string,
		accept_terms: string
	): Promise<message | Error> => {
		const userDB = await this.userDataBase.foundUserByEmail(email);
		if (userDB) throw new BadRequestError('E-mail already registered');
		const id = this.idGenerator.generate();
		const hashedPassword = await this.hashManager.hash(password);
		const newUser = new User(
			id,
			name,
			email,
			hashedPassword,
			new Date().toString(),
			new Date().toString(),
			USER_ROLES.NORMAL,
			accept_terms
		);
		const insertUser: user = {
			id: newUser.getId(),
			name: newUser.getName(),
			email: newUser.getEmail(),
			password: newUser.getPassword(),
			creation_date: newUser.getPassword(),
			information_update: newUser.getCREATION_DATE(),
			role: newUser.getRole(),
			accept_terms: newUser.getAccept_terms(),
		};
		await this.userDataBase.addNewUserInDB(insertUser);
		return {
			message: 'successful registration',
		};
	};
}