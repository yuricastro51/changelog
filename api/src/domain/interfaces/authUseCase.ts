export interface AuthUseCase {
	auth(email: string, password: string): string | undefined;
}
