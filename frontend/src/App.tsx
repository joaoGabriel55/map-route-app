import { useState } from "react";
import "./App.css";
import { Map } from "./components/map/Map";
import { RouteForm } from "./components/route-form/RouteForm";
import { GeoJSON } from "./domain/GeoJSON";
import { Toaster } from "react-hot-toast";

function App() {
  const [route, setRoute] = useState<GeoJSON | null>(null);

  return (
    <main className="app">
      <RouteForm onRouteLoaded={setRoute} />
      <Map route={route} />
      <Toaster />
    </main>
  );
}

export default App;
