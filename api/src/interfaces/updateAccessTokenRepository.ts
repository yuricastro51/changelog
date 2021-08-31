export interface IUpdateAccessTokenRepository {
	update(userId: string, accessToken: string): Promise<void>;
}
