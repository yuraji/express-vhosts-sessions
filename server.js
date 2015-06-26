var express = require('express'),
	vhost = require('express-vhost'),
	chalk = require('chalk'),
	fs = require('fs');


var server = express();
server.use(vhost.vhost());

var config = JSON.parse( fs.readFileSync('config.json') );

server.listen(config.http_port);

config.projects.forEach(function(project_config){

	if( project_config.disabled ) return;

	var project_module = require( project_config.path );
	var project_app = project_module(project_config);

	vhost.register( project_config.domain , project_app );

	console.log(
		chalk.bgYellow.black('listening') +
		chalk.underline.bgWhite.blue(' '+project_config.domain+':'+config.http_port+' '), 'for', chalk.green(project_config.path) 
	);

});





