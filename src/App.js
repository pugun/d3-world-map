import './App.css';
import React, { useState } from "react";
import GeoChart from './GeoChart';
import data from './GeoChart.world.geo.json'

function App() {
  const [property, setProperty] = useState("pop_est")

  return (
    <div className="App">
      <h2>World Map with d3-geo</h2>
      <GeoChart data={data} property={property} />
      <h2>Select property to highlight</h2>
      <select
        value={property}
        onChange={e => setProperty(e.target.value)}
      >
        <option value="pop_est">Population</option>
        <option value="name_len">Name length</option>
        <option value="gdp_md_est">GDP</option>
        </select>    
    </div>
  );
}

export default App;
