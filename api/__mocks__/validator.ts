module.exports = {
	isEmailValid: true,
	isEmail(email: string) {
		this.email = email;

		return this.isEmailValid;
	},
};
