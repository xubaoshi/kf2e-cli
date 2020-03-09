// main.js
const program = require('commander');
const path = require('path');
const { getPackageVersion } = require('./utils');
const version = getPackageVersion()

const mapAction = { // 需要生成的指令数据
	create: {
		alias: 'c',
		description: 'create a project',
		examples: [
			'kf2e create <project-name>',
		],
	},
	'*': {
		alias: '',
		description: 'command not found',
		examples: [],
	},
};
Reflect.ownKeys(mapAction).forEach((action) => {
	program
		.command(action) // 命令名
		.alias(mapAction[action].alias) // 命令别名
		.description(mapAction[action].description) // 命令描述
		.action(() => { // 命令执行的操作
			if (action === '*') { // 命令不存在
				console.log(mapAction[action].description);
			} else {
				require(path.resolve(__dirname, action))(...process.argv.slice(3)); // 引入命令对应操作模块
			}
		});
});

program.on('--help', () => { // help命令打印帮助信息
	console.log('\nExample');
	Reflect.ownKeys(mapAction).forEach((action) => {
		mapAction[action].examples.forEach((item) => {
			console.log(item);
		});
	});
});

// process.argv就是用户在命令行中传入的参数
program.version(version)
	.parse(process.argv);
