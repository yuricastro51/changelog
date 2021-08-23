export interface IAuthUseCase {
	auth(email: string, password: string): Promise<string | undefined>;
}
