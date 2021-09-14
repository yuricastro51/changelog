import { IEncrypter } from 'src/interfaces/encrypter';
import { ILoadUserByEmailRepository } from 'src/interfaces/loadUserByEmailRepository';
import { ITokenGenerator } from 'src/interfaces/tokenGenerator';
import { IUpdateAccessTokenRepository } from 'src/interfaces/updateAccessTokenRepository';

export type LoginType = {
	email: string;
	password: string;
};

export type HttpRequestType = {
	body: LoginType;
};

export type HttpResponseType = {
	statusCode: number;
	body: any;
};

export interface IUser {
	id: string;
	email: string;
	password: string;
	accessToken?: string;
}

export type AuthUseCaseProps = {
	loadUserByEmailRepository: ILoadUserByEmailRepository;
	encrypter: IEncrypter;
	tokenGenerator: ITokenGenerator;
	updateAccessTokenRepository: IUpdateAccessTokenRepository;
};
