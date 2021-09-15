export interface IEncrypter {
	compare(password: string, hashedPassword: string): Promise<boolean>;
}
