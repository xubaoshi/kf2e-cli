const INJECT_FILES = ['package.json'];
const FRAMEWORKS = [
	{
		name: 'Vue',
		value: 'Vue'
	},
	{
		name: 'React',
		value: 'React'
	},
	{
		name: 'React-Native',
		value: 'React-Native'
	}
]
const VUE_TEMPLATES = [
	{
		name: 'vue-admin-template',
		value: 'direct:https://github.com/mofang-cli/vue-admin-template.git'
	},
	{
		name: 'vue-mobile-template',
		value: 'direct:https://github.com/mofang-cli/vue-mobile-template.git'
	},
	{
		name: 'vue-ssr-template',
		value: 'direct:https://github.com/mofang-cli/vue-ssr-template.git'
	},
	{
		name: 'vue-cms-template',
		value: 'direct:https://github.com/mofang-cli/vue-cms-template.git'
	}
]

const REACT_TEMPLATES = [
	{
		name: 'react-admin-template',
		value: 'direct:https://github.com/mofang-cli/react-admin-template.git'
	},
	{
		name: 'react-nextjs-template',
		value: 'direct:https://github.com/mofang-cli/react-nextjs-template.git'
	},
	{
		name: 'react-electron-template',
		value: 'direct:https://github.com/mofang-cli/react-electron-template.git'
	}
]

const REACT_NATIVE_TEMPLATES = [
	{
		name: 'react-native-template',
		value: 'direct:https://github.com/mofang-cli/react-native-template.git'
	}
]

module.exports = {
	INJECT_FILES,
	FRAMEWORKS,
	VUE_TEMPLATES,
	REACT_TEMPLATES,
	REACT_NATIVE_TEMPLATES
};
