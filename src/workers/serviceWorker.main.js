let newServiceWorkerHandlers = [];
export const registerNewServiceWorkerHandler = handler => {
  newServiceWorkerHandlers.push(handler);
};

export const unregisterNewServiceWorkerHandler = handler => {
  newServiceWorkerHandlers = newServiceWorkerHandlers.filter(
    (theHandler) => theHandler !== handler
  );
};

const getRegistration = async () => {
  return await navigator.serviceWorker.getRegistration();
};

const UPDATE_WORKER_INTERVAL = 60 * 1000; // Ask for worker update every minute

const initWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "serviceWorker.js",
        { scope: "/" }
      );

      if (registration.waiting) {
        newServiceWorkerHandlers.forEach((handler) => handler(registration));
      }

      registration.addEventListener("updatefound", () => {
        if (registration.installing) {
          registration.installing.addEventListener("statechange", () => {
            if (registration.waiting) {
              if (navigator.serviceWorker.controller) {
                newServiceWorkerHandlers.forEach((handler) =>
                  handler(registration)
                );
              } else {
                console.log("Service Worker initialized for the first time");
              }
            }
          });
        }
      });
    } catch (e) {
      console.error(e);
    }

    setInterval(async () => {
      console.log("Checking for ServiceWorker update");
      const registration = await getRegistration();
      await registration?.update();
    }, UPDATE_WORKER_INTERVAL);

    let refreshing = false;

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log("Controller changed");
      if (!refreshing) {
        location.reload();
        refreshing = true;
      }
    });
  }
};

await initWorker();

/**
 * Send the skip waiting command to the `waiting` service worker
 */
export const sendSkipWaitingCommand = async (registration) => {
  console.log("sendSkipWaitingCommand invoked");
  console.log(registration, ' skip waiting registration')

  navigator.serviceWorker.getRegistrations().then((regs) =>
    regs.forEach((reg) => {
      if (reg?.waiting) {
        reg.waiting.postMessage({ type: "SKIP_WAITING_COMMAND" });
        console.log("sendSkipWaitingCommand executed");
      }
    })
  );
  // if (registration?.waiting) {
  //   registration.waiting.postMessage({ type: "SKIP_WAITING_COMMAND" });
  // }
};
