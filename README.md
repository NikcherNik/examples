# exemples

##create notification in js file

```javascript
Notification.requestPermission();
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service_worker.js')
    .then(initialiseState);
} else {
    console.log('Service workers aren\'t supported in this browser.');
}

function initialiseState(registration) {

    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
        console.warn('Уведомления не поддерживаются браузером.');
        return;
    }
    if (Notification.permission === 'denied') {
        console.warn('Пользователь запретил прием уведомлений.');
        return;
    }
    if (!('PushManager' in window)) {
        console.warn('Push-сообщения не поддерживаются браузером.');
        return;
    }
}
```


##SUBSCRIBE

```javascript
navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true })
        .then(function (subscription) {
            if (!subscription) {
                return;
            }
            var endpoint = subscription.endpoint;

            var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
            var key = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : '';

            var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
            var authSecret = rawAuthSecret ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) : '';


            console.log('endpoint = ' + endpoint);
            console.log('key = ' + key);
            console.log('authSecret = ' + authSecret);

        })
        .catch(function (err) {
            console.warn('Ошибка при получении данных о подписчике.', err);
        });
});
```


##UNSUBSCRIBE
```javascript
navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.getSubscription().then(
        function(subscription) {
            if (!subscription) {
                return;
            }
            subscription.unsubscribe().then(function(successful) {

            }).catch(function(e) {
                console.log('Unsubscription error: ', e);
            });
        });
});
```
##SERVICE WORKER FILE

```javascript
var port;
var showNotification = false;
self.addEventListener('install', function (event) {
    event.waitUntil(self.skipWaiting()); 
});

self.addEventListener('activate', function (event) {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function (event) {

    var obj = JSON.parse(event.data.text());
    fireNotification(obj, event);
	
});
self.onmessage = function (e) {
    port = e.ports[0];
}
self.addEventListener('message', function (event) {
   
    showNotification = !!event.data;
    console.log(event.data);
});


self.addEventListener('notificationclick', function (event) {
    console.log('Пользователь кликнул по уведомлению: ', event.notification.tag);
    // Закрываем уведомление
    event.notification.close();
    event.waitUntil(
      self.clients.matchAll({
          type: 'window',
          includeUncontrolled: true
      })
      .then(function (clientList) {
          var url = "https://localhost/addons/talk/jabberclient.aspx";
           for (var i = 0; i < clientList.length; i++) {
               var client = clientList[i];
               console.log(i);
               console.log(client);
               if (client.url == url && 'focus' in client) 
                   return client.focus();
             }
           if (clients.openWindow) {
               return clients.openWindow(url);
           }
      })
    );
});

function fireNotification(obj, event) {
    var title = obj.from;
    var body = obj.msg+"   "+showNotification;
    var tag = 'simple-push-notification-tag';
    event.waitUntil(self.registration.showNotification(title, {
        icon:"https://d3b5653v7ash7c.cloudfront.net/studio/tag/nct.8.9.0/skins/default/images/onlyoffice_logo/favicon.ico",
		title:title,
		body: body,
        tag: tag
	}));
}
```
##Send notification

```C#
 var pushEndpoint = @"https://updates.push.services.mozilla.com/wpush/v1/gAAAAABYwW2ck4Q-JQqcrLCsZjjnTxLCTwXmh...";
                var p256dh = @"BE9ek+9pRE4RqKBvlfabIMH1DxkgbQcthxl0...";
                var auth = @"cF7b/C6KyK82l5..."; var gcmAPIKey = @"AIzaSyD_Vskul6AeP6KV...";
                var subscription = new PushSubscription(pushEndpoint, p256dh, auth);

                var webPushClient = new WebPushClient();
                try
                {
                    log.DebugFormat(message.ToString());
                    if (message.HasTag("active"))
                    {
                        webPushClient.SendNotification(subscription, "{\"msg\":" + "\"" + message.Body + "\",\"from\":" + "\"" + message.From + "\"}");
                    }
                   
                }
                catch (WebPushException exception)
                {

                }
```
