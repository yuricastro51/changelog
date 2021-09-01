class ValidatorTest {
	isEmailValid = true;
	email = '';

	isEmail(email: string) {
		this.email = email;
		return this.isEmailValid;
	}
}

jest.mock('validator', () => new ValidatorTest());

import validator from 'validator';
import { EmailValidator } from './emailValidator';

const makeSut = () => {
	const sut = new EmailValidator();

	return { sut };
};

describe('Email Validator', () => {
	test('Should return true if validator returns true', () => {
		const { sut } = makeSut();
		const isEmailValid = sut.isValid('valid_email@mail.com');
		expect(isEmailValid).toBe(true);
	});

	test('Should return false if validator returns false', () => {
		const { sut } = makeSut();
		//@ts-ignore
		validator.isEmailValid = false;
		const isEmailValid = sut.isValid('invalid_email@mail.com');
		expect(isEmailValid).toBe(false);
	});

	test('Should call validator with correct param', () => {
		const { sut } = makeSut();
		sut.isValid('any_email@mail.com');
		//@ts-ignore
		expect(validator.email).toBe('any_email@mail.com');
	});
});
