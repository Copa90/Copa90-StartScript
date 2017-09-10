var cron = require('cron')
var shell = require('shelljs')
var app = require('../../server/server')

module.exports = function(starter) {

	var startServices = cron.job("0 */1 * * * *", function () {
		shell.exec('/root/./startScript.sh')
	})

	startServices.start()

}
