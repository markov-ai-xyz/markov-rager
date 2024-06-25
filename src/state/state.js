const stateManager = (initialState) => {
  let state = initialState;
  const listeners = [];

  const stateUpdater = (updater) => {
    if (typeof updater === "function") {
      state = updater(state);
    } else {
      state = { ...state, ...updater };
    }
    fireListeners();
  };

  const registerListener = (listenerFunc) => {
    listeners.push(listenerFunc);
  };

  const fireListeners = () => {
    listeners.forEach((listener) => {
      listener(state);
    });
  };

  return [state, stateUpdater, registerListener];
};

export default stateManager;
