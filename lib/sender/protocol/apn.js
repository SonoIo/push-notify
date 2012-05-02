/**
 * Sender pour le protocole apn (iDevices)
 */

var apns = require("apn");


/**
 * Apn Sender
 */
var Sender = function()
{
   
};

/**
 * Nombre maxi de notifications par connexion
 */
Sender.MAX_NOTIF_BY_CONNECTION = 200;

/**
 * Connexion apn
 */
Sender.prototype.connection = null;

/**
 * Initialisé
 */
Sender.prototype.initialized = false;

/**
 * Configuration
 */
Sender.prototype.config = null;

/**
 * Nombre de notifications envoyées
 */
Sender.prototype.count = 0;

/**
 * Options de connexion
 */
Sender.prototype.connectionOptions = {};

/**
 * Initialisation du sender
 */
Sender.prototype.initialize = function()
{
   if(this.initialized)
   {
      return ;
   }
   
   this.connectionOptions = {
         cert: this.config.cert,
         key:  this.config.key,
         gateway: this.config.gateway,
         port: this.config.port,
         errorCallback: this.errorCallback.bind(this)
   };

   this.connect();
   
   this.initialized = true; 
};

/**
 * Connect
 */
Sender.prototype.connect = function()
{
   this.connection = new apns.Connection(this.connectionOptions);
};

/**
 * Garder la connexion en vie
 */
Sender.prototype.keepAliveConnection = function()
{
   if(this.count >= this.MAX_NOTIF_BY_CONNECTION)
   {
      this.connect();
      this.count = 0;
   }
};

/**
 * Callback error
 * @param int errorCode
 * @param object notification
 */
Sender.prototype.errorCallback = function(errorCode, notification)
{
   console.log("Erreur " + errorCode + " survenue sur la notification : ");
   console.log(notification);
};


/**
 * Envoi d'une notification
 * @param object data
 */
Sender.prototype.send = function(data, callback)
{
   this.initialize();
   this.keepAliveConnection();
   
   var notification = new apns.Notification(), device = new apns.Device(data.token);
   
   if(typeof data.badge !== "undefined" && data.badge)
   {
      notification.badge = data.badge;
   }
   
   if(typeof data.sound !== "undefined" && data.sound)
   {
      notification.sound = data.sound;
   }
   
   if(typeof data.alert !== "undefined" && data.alert)
   {
      notification.alert = data.alert;
   }
   
   if(typeof data.payload !== "undefined" && data.payload)
   {
      notification.payload = data.payload;
   }
   
   notification.device = device;
   
   this.count++;
   
   console.log("Send token : " + data.token);
   
   count++;
   console.log("-- " + count);
   
   if(typeof callback === "function")
   {
      callback();
   }
};

exports.Sender = Sender;
