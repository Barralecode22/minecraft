(() => {
  const config = window.FIREBASE_CONFIG;
  const requiredConfig = ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'appId'];

  function getRoomId() {
    const url = window.location.pathname + window.location.search;
    let hash = 2166136261;
    for (let i = 0; i < url.length; i++) {
      hash = Math.imul(hash ^ url.charCodeAt(i), 16777619);
    }
    return `room-${(hash >>> 0).toString(36)}`;
  }

  function getTabId(roomId) {
    const storageKey = `minicraft-tab:${roomId}`;
    let id = sessionStorage.getItem(storageKey);
    if (!id) {
      id = typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID().replace(/-/g, '')
        : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(storageKey, id);
    }
    return id;
  }

  function openRoom(user) {
    const roomId = getRoomId();
    const tabId = getTabId(roomId);
    const peerId = `${user.uid}_${tabId}`;
    const playersRef = firebase.database().ref(`rooms/${roomId}/players`);
    const selfRef = playersRef.child(user.uid).child(tabId);
    let lastPresence = { nm: 'Jugador' };
    let connected = false;
    let peersHandler = null;
    let disconnectHandler = null;

    function reportError(message, error) {
      console.error(`[Minicraft multiplayer] ${message}`, error);
    }

    const room = {
      presence(data) {
        Object.assign(lastPresence, data);
        if (!connected) return Promise.resolve();
        return selfRef.set({ kind: 'viewer', presence: lastPresence });
      },
      onPeers(handler, onDisconnect) {
        peersHandler = handler;
        disconnectHandler = onDisconnect;

        playersRef.on('value', snapshot => {
          if (!peersHandler) return;
          const users = snapshot.val() || {};
          const peers = [];
          Object.entries(users).forEach(([uid, tabs]) => {
            Object.entries(tabs || {}).forEach(([tab, player]) => {
              const peer = `${uid}_${tab}`;
              peers.push({
                peer,
                kind: player.kind || 'viewer',
                sameTab: peer === peerId,
                presence: player.presence || {}
              });
            });
          });
          peersHandler({ peers });
        }, error => {
          reportError('Falló la escucha de jugadores.', error);
          if (disconnectHandler) disconnectHandler();
        });

        firebase.database().ref('.info/connected').on('value', snapshot => {
          connected = snapshot.val() === true;
          if (!connected) return;

          selfRef.onDisconnect().remove()
            .then(() => selfRef.set({ kind: 'viewer', presence: lastPresence }))
            .catch(error => reportError('No se pudo registrar la presencia.', error));
        }, error => {
          reportError('Falló la conexión con Realtime Database.', error);
          if (disconnectHandler) disconnectHandler();
        });
      }
    };

    return room;
  }

  window.claude = window.claude || {};
  window.claude.use = async name => {
    if (name !== 'room') throw new Error(`Servicio de sala desconocido: ${name}`);
    if (!window.firebase || !firebase.auth || !firebase.database) {
      throw new Error('No se cargó el SDK de Firebase.');
    }
    if (!config || requiredConfig.some(key => !config[key] || config[key].startsWith('PEGAR_'))) {
      throw new Error('Completá la configuración web en firebase-config.js.');
    }

    const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(config);
    const auth = app.auth();
    const user = auth.currentUser || (await auth.signInAnonymously()).user;
    if (!user) throw new Error('Firebase no devolvió un usuario autenticado.');
    return openRoom(user);
  };
})();
