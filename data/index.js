const Koa = require('koa');
const app = new Koa();
const Web3 = require('web3');
const redis = require("redis");

// const client = redis.createClient({host : 'redis'});
const pub = redis.createClient({host : 'redis'});
const sub = redis.createClient({host : 'redis'});
const web3 = new Web3(new Web3.providers.HttpProvider("http://geth:8545"));

sub.on("message", function (channel, message) {
  const msg = message.split('&');
  const command = msg[0];
  const data = msg[1];
  const reply = msg[2];
  
  if(command === 'coinbase') {
    web3.eth.getCoinbase().then(value => pub.publish('web3',`${reply}&${value}`))
  }
});

sub.subscribe("web3");



app.use(async ctx => {
  ctx.body = 'Data/Caching Service: OK';
});

app.listen(3000);

console.log("Listening on 3000");