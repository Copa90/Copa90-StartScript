var cron = require('cron')
var shell = require('shelljs')
var app = require('../../server/server')

module.exports = function(starter) {

	var startServices = cron.job("0 */1 * * * *", function () {
		shell.exec('/root/./startScript.sh', function(code, stdout, stderr) {
			console.log('EXIT CODE: ', code)
			console.log('PROGRAM OUTPUT:')
			console.log(stdout)
			console.log('PROGRAM STDERR:')
			console.log(stderr)
		})
	})

	startServices.start()

}
