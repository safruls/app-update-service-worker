import React, { useEffect, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import {
  registerNewServiceWorkerHandler,
  sendSkipWaitingCommand,
  unregisterNewServiceWorkerHandler,
} from "./workers/serviceWorker.main";
import "./App.css";

const Home = React.lazy(() => import("./Home"));
const Page1 = React.lazy(() => import("./Page1"));
const Page2 = React.lazy(() => import("./Page2"));

const App = () => {
  const [isServiceWorkerUpdated, setIsServiceWorkerUpdated] = useState(false);
  const [registration, setRegistration] = useState();
  const [appVersion, setAppVersion] = useState();
  const history = useHistory();

  const newAppUpdateHandler = async (registration) => {
    setIsServiceWorkerUpdated(true);
    setRegistration(registration);
    const { APP_VERSION } = await import("./version");
    setAppVersion(APP_VERSION);
  };

  const handleUpdateServiceWorker = () => {
    console.log('handleUpdate invoked');
    sendSkipWaitingCommand(registration)
  };

  useEffect(() => {
    // register service worker here
    registerNewServiceWorkerHandler(newAppUpdateHandler);

    return () => {
      unregisterNewServiceWorkerHandler(newAppUpdateHandler);
    };
  }, []);

  useEffect(() => {
    history.listen( () => {
      console.log("history.listen");
      console.log("isServiceWorkerUpdated === ", isServiceWorkerUpdated);
      handleUpdateServiceWorker();
    });
  }, []);

  return (
    <React.Suspense fallback="loading...">
      <div id="new-updates" className={isServiceWorkerUpdated ? 'show' : ''}>
        There is a new version available. Version {appVersion}.{" "}
        {/* <button onClick={handleUpdateServiceWorker}>Update</button> */}
      </div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/page1" component={Page1} />
        <Route path="/page2" component={Page2} />
      </Switch>
    </React.Suspense>
  );
};

export default App;
