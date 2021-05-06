import React, { useState, useEffect } from "react";
import "./App.css";
import { FormControl, Select, MenuItem } from "@material-ui/core";
import axios from "axios";
//https://disease.sh/docs/#/COVID-19:%20Worldometers/get_v3_covid_19_continents

function App() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get("https://disease.sh/v3/covid-19/countries").then((res) => {
      const result = res.data.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso2,
      }));
      setCountries(result);
    });
  }, []);
  return (
    <div className="app">
      <div className="app_header">
        <h1>COVID-19 TRACKER</h1>
        <FormControl className="app_dropdown">
          <Select variant="outlined" value="abc">
            {countries.map((country) => (
              <MenuItem value={country.value} key={country.value}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
}

export default App;
