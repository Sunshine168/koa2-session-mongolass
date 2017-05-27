"use strict";
/*

MongoDB storage layer for koa2-session-store.

Based on https://github.com/kcbanner/connect-mongo

MongoDB dirver  https://github.com/mongolass/mongolass

*/

const debug = require('debug')('koa2-session-mongolass');
const Mongolass = require('mongolass');
const DEFAULT_URL = "mongodb://localhost:27017/session";


/*
SessionModal api 
*/
class SessionModel {
  constructor(url, opts) {
    this.mongolass = new Mongolass();
    this.mongolass.connect(url, opts);
    /*defined the session modele for mongolass */
    this.session = this.mongolass.model('Session', {
      _id: {
        type: 'string'
      },
      blob: {
        type: 'object'
      },
      updateAt: {
        type: 'date'
      }
    });
  }
  get(sid) {
    return this.session.findOne({
      _id: sid
    }).exec()
  }
  save(sid, data) {
    return this.session.create({
      _id: sid,
      blob: data,
      updatedAt: new Date()
    }).exec()
  }
  update(sid, data) {
    var data = {
      _id: sid,
      blob: data,
      updatedAt: new Date()
    };
    return this.session.update({
      _id: sid
    }, data).exec()
  }
  delete(sid) {
    return this.session.remove({
      _id: sid
    }).exec();
  }
  closeModel() {
    /*
     * disconnect mongodb
       mongolass may did auto destory  ?  
     */
    this.session.disconnect()
  }
}
/*
  store unify api(async)
*/
module.exports = class MongoStore {
  /*
   @param  url{String} to connect mongodb 
   @param  opts{Object} options for mongodb 
  */
  constructor(url, opts) {
      this._url = url || DEFAULT_URL;
      this._opts = opts || defaultOptions;
      this.session = new SessionModel(this._url, this._opts);
    }
    /*
     @param  sid{String}  sessionId
     @param  blob{Object} session content
    */
  async save(sid, data) {
      var data = JSON.parse(data);
      try {
        var session = await this.session.get(sid);
        if (session) {
          //the session exist so update the session
          var result = await this.session.update(sid, data)
        } else {
          //the session did not exist so create it
          var result = await this.session.save(sid, data);
          console.log(result);
        }
      } catch (e) {
        console.log(e);
      }
      return result;
    }
    /*
      @param  sid{String}  sessionId
     */
  async load(sid) {
      try {
        var result = await this.session.get(sid);
      } catch (e) {
        console.log(e);
        return null;
      }
      var blob = {};
      if (result) {
        blob = result.blob;
      }
      return JSON.stringify(blob);
    }
    /*
      @param  sid{String}  sessionId
     */
  async remove(sid) {
    try {
      await this.session.delete(sid);
    } catch (e) {
      console.log(e);
    }
    return 0;
  }
}

/**
 * Default options 
    supported params please see mongolass doc 
 */
var defaultOptions = {
  ssl: false,
  w: 1
};