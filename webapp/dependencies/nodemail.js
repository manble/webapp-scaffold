/**
 * @description：捕获异常，发邮件通知
 * @author: manble@live.com
 */
var password = 'xxx';
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://manble001%40163.com:'+ password +'@smtp.163.com');

module.exports = {
    send: function(err, req) {
        if (req.app.get('env') !== 'development') {
            var msg = Object.prototype.toString.call(err) == '[object Object]' ? err.message || 'Error' : err,
                url = req.originalUrl;
            if(/Not Found/i.test(msg)) {
                return;
            }
            transporter.sendMail({
                from: 'manble001@163.com',
                to: 'manble@live.com',
                subject: 'Error - ' + msg + ' - ' + url,
                html: 'url: ' + url + ' <br/> ' + 'message: ' + msg
            }, function(error, info) {
                if (error) {
                    console.log(error);
                }
            });
        }
    }
}
