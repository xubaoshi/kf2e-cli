const Project = require('../src/project');

module.exports = (projectName = 'my-project') => {

	const project = new Project({
		projectName
	});

	project.create();
};
