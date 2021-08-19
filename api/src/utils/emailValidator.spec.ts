import validator from 'validator';

class EmailValidator {
	isValid(email: string) {
		return validator.isEmail(email);
	}
}

describe('Email Validator', () => {
	test('Should return true if validator returns true', () => {
		const sut = new EmailValidator();
		const isEmailValid = sut.isValid('valid_email@mail.com');
		expect(isEmailValid).toBe(true);
	});

	test('Should return false if validator returns false', () => {
		const sut = new EmailValidator();
		//@ts-ignore
		validator.isEmailValid = false;
		const isEmailValid = sut.isValid('invalid_email@mail.com');
		expect(isEmailValid).toBe(false);
	});
});
