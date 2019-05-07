const URI = require('urijs');
const localforage = require('localforage');

function setState(state) {
  return localforage.setItem('auth', state);
}

function getState() {
  return localforage.getItem('auth');
}

module.exports = (OPTIONS) => ({
  authenticated: (query, next) => {
    return new Promise(resolve => {
      if (typeof query === 'string') {
        // set auth state in local storage
        setState(
          URI(query.replace('#', '?')).query(true)
        ).then(resolve);
      } else {
        resolve();
      }
    }).then(() => next('/'))
  },
  setState,
  getState,
});
