/**
 * Sender pour le protocole apn (iDevices)
 */

var Deferred = require("jquery-deferred").Deferred,
    apns = require("apn"),
    sender = {};

/**
 * Connexion apn
 */
sender.connection = null;

/**
 * Initialisé
 */
sender.initialized = false;

/**
 * Configuration
 */
sender.config = null;

/**
 * Initialisation du sender
 */
sender.initialize = function()
{
   if(this.initialized)
   {
      return ;
   }
   
   var options = {
         cert: this.config.cert,
         key:  this.config.key,
         gateway: this.config.gateway,
         port: this.config.port
   };

   this.connection = new apns.Connection(options);
   
   this.initialized = true; 
};

/**
 * Envoi d'une notification
 * @param object data
 * @return promise
 */
sender.send = function(data)
{
   this.initialize();
   
   var d = new Deferred(), notification = new apns.Notification(), device = new apns.Device(data.token);
   
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
   
   //this.connection.sendNotification(notification);
   
   console.log("Send token : " + data.token);
   
   count++;
   console.log("-- " + count);

   d.resolve();

   return d.promise();
};

exports.sender = sender;