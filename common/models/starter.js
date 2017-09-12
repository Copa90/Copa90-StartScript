var cron = require('cron')
var shell = require('shelljs')
var app = require('../../server/server')

const fs = require('fs')
const fse = require('fs-extra')

function dateConvertor() {
	var d = new Date()
	var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	return ('' + weekday[d.getDay()] + '-' + months[d.getMonth()] + '-' + d.getFullYear())
}

module.exports = function(starter) {

	var startServices = cron.job("0 */1 * * * *", function () {
		shell.exec('/root/./startScript.sh')
	})

	startServices.start()

	var dailyBackup = cron.job("00 00 00 * * 1-7", function () {
		var now = dateConvertor()
		var dir = path.resolve(__dirname + '/../../../backupLogs/' + now + '/')
		fse.ensureDir(dir, err => {
			if (err)
				return console.error(err)
			var directory = path.resolve(__dirname + '/../../../')
			var serviceNohupPath = directory + '/Copa90-StartScript/nohup.out'
			var oldFilePath = {
				telegramBot: directory + '/Copa90-TelegramBot/nohup.out',
				CoreEngine: directory + '/Copa90-CoreEngine/nohup.out',
				ZarinPal: directory + '/Copa90-ZarinPalGateway/nohup.out'
			}
			var newFilePath = {
				telegramBot: dir + '/Copa90-TelegramBot/nohup.out',
				CoreEngine: dir + '/Copa90-CoreEngine/nohup.out',
				ZarinPal: dir + '/Copa90-ZarinPalGateway/nohup.out'
			}
			fs.writeFile(serviceNohupPath, '', function() {
				fse.copy(oldFilePath.telegramBot, newFilePath.telegramBot, err => {
					if (err)
						return console.error(err)
					fs.writeFile(oldFilePath.telegramBot, '', function(){
						console.log('COPY META LOGS DONE:  TELEGRAM BOT')
					})
				})
				fse.copy(oldFilePath.CoreEngine, newFilePath.CoreEngine, err => {
					if (err)
						return console.error(err)
					fs.writeFile(oldFilePath.CoreEngine, '', function(){
						console.log('COPY META LOGS DONE:  CORE ENGINE')
					})
				})
				fse.copy(oldFilePath.ZarinPal, newFilePath.ZarinPal, err => {
					if (err)
						return console.error(err)
					fs.writeFile(oldFilePath.ZarinPal, '', function(){
						console.log('COPY META LOGS DONE:  ZARINPAL')
					})
				})							
			})
		})
	})

	// dailyBackup.start()

}
