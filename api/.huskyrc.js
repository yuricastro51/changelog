export default {
	hooks: {
		'pre-commit': 'yarn test:ci',
		'pre-push': 'yarn test:ci',
	},
};
