var http = require('http');
var helper = require('sendgrid').mail;
var port = 8081;

var s = http.createServer();
s.on('request', function(request, response) {
    response.writeHead(200);
    console.log("Data received by the server :");
    console.log(request.method);
    console.log(request.headers);
    console.log(request.url);

    var data = '';
    request.on('data', function(chunk) {
        data += chunk.toString();
    });
    request.on('end', function() {
        console.log(data);
        var information=JSON.parse(data);
        from_email = new helper.Email(information.from);
        to_email = new helper.Email(information.to);
        subject = information.subject;
        content = new helper.Content("text/plain", information.content);
        mail = new helper.Mail(from_email, subject, to_email, content);
        var sg = require('sendgrid')('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');
        var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });

        sg.API(request, function(error, response) {
            console.log("Response from sendGrid Api :");
            console.log(response.statusCode);
            console.log(response.body);
            console.log(response.headers);
        })
        response.write('hi');
        response.end();
    });

});

s.listen(port);
console.log('Browse to http://127.0.0.1:' + port);









// var http = require('http');
// var url = require('url');
// var querystring = require('querystring');
// var static = require('node-static');
// var file = new static.Server('.');
//
//
// function accept(req, res) {
//
//   // если URL запроса /vote, то...
//   if (req.url == '/vote') {
//     // через 1.5 секунды ответить сообщением
//     setTimeout(function() {
//       res.end('Ваш голос принят: ' + new Date());
//     }, 1500);
//   } else {
//     // иначе считаем это запросом к обычному файлу и выводим его
//     file.serve(req, res); // (если он есть)
//   }
//
// }
//
//
// // ------ этот код запускает веб-сервер -------
//
// if (!module.parent) {
//   http.createServer(accept).listen(8080);
// } else {
//   exports.accept = accept;
// }