import app from './app';
import config from './config/config';
app.listen(app.get('port'));
console.log(
  `Server is running on: http://${config.HOST}:${app.get('port')}${
    config.API_URL
  }`
);