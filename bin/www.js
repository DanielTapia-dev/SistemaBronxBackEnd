const http = require('http');
const app = require('../app');
const port = parseInt(process.env.port, 10) || 5000;
app.set('port', port);

const server = http.createServer(app);
server.listen(process.env.PORT || 8010, function() {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});