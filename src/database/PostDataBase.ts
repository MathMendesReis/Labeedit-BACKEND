import { outoutGetAllPostsDTO } from '../DTOs/OutputGetAllPosts.DTO';
import { Post } from '../models/Post';
import { user } from '../models/User';
import { BaseDatabase } from './sqlite/Database';

export class PostDataBase extends BaseDatabase {
	private static TABLE_ACCOUNT = 'posts';
	private static TABLE_ACCOUNT_USERS = 'users';
	private static TABLE_ACCOUNT_LIKE_DISLIKE = 'like_dislike';

	public addPostInDB = async (data: Post): Promise<void> => {
		await BaseDatabase.connection(PostDataBase.TABLE_ACCOUNT).insert(data);
	};
	public getAllPosts = async (): Promise<outoutGetAllPostsDTO[]> => {
		return await BaseDatabase.connection(PostDataBase.TABLE_ACCOUNT)
			.select(
				`${PostDataBase.TABLE_ACCOUNT}.id`,
				`${PostDataBase.TABLE_ACCOUNT}.contents`,
				`${PostDataBase.TABLE_ACCOUNT_USERS}.name as name_user`
			)
			.leftJoin(
				PostDataBase.TABLE_ACCOUNT_USERS,
				`${PostDataBase.TABLE_ACCOUNT}.user_id`,
				`${PostDataBase.TABLE_ACCOUNT_USERS}.id`
			);
	};
}