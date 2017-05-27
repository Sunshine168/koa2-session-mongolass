# koa2-session-mongolass

MongoDB storage layer 

you can use with [koa2-session-store](https://github.com/Sunshine168/koa2-session-store) 

## Installation

```
npm install koa2-session-mongolass
```
## Usage

```
const session = require('koa2-session-store2');
const MongoStore = require('koa2-session-mongolass');
const koa = require('koa');
const app = new koa();

app.keys = ['some secret key']; // needed for cookie-signing

// cookie will be named "koa:sess" and session data will be stored in the cookie itself

app.use(session({
    name: "test1",
    secret: "test",
    store: new MongoStore()
}));

app.use(async(ctx, next) => {
    var n = ctx.session.views || 0;
    ctx.session.views = ++n;
    ctx.response.body = n + ' views';
})
app.use(async(ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});
app.use(controller());
app.listen(3000);
console.log('listening on port 3000');

```

default config 

```
new MongoStore(url,opts);

// default urlis 'mongodb://localhost:27017/session'
/* defaultOptions = {
  ssl: false,
  w: 1
};
*/
//more detail in https://mongodb.github.io/node-mongodb-native/api-generated/mongoclient.html
```


