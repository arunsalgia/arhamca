if (true) {
importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../firebase-messaging-sw.js')
      .then(function(registration) {
        console.log('Arun Salgia SW Registration successful, scope is:', registration.scope);
      }).catch(function(err) {
        console.log('Service worker registration failed, error:', err);
      });
    }

firebase.initializeApp({
	messagingSenderId: "1018469539659"
})


const messaging = firebase.messaging()


messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/Content/Img/logo-amezze-120.png'
    };

    //return self.registration.showNotification(notificationTitle,
    //    notificationOptions);
});


/*
messaging.getToken().then((currentToken) => {
	if (currentToken) {
				console.log('currentToken', currentToken);
	} else {
				// Show permission request.
				console.log('No Instance ID token available. Request permission to generate one.');
	}
}).catch((err) => {
		console.log('An error occurred while retrieving token. ', err);
});
*/

	
/*
messaging.usePublicVapidKey("BMh2i6ChRLOt1ZgI3mRdBF8yLJ_VmR9oYIbwAs9s7-6dPjxQXPss75gXaVG29ixLgGGv19EUEJrxgy9VU69l0LU");


	
messaging.onMessage((payload) => {
	console.log('Message received. ', payload);
	alert('Message received. ');
	
	//toastr["info"](payload.notification.body, payload.notification.title);
		// ...
});


messaging.onBackgroundMessage((payload) => {
    console.log('Message received.onBackgroundMessage ', payload);
		alert('Message received.onBackgroundMessage ');
});
*/


/*
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
*/
}
