import React, { useState, useEffect } from "react";
import "./App.css";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import axios from "axios";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import { preetyPrintStat } from "./util";
//https://disease.sh/docs/#/COVID-19:%20Worldometers/get_v3_covid_19_continents

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tabledata, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    axios.get("https://disease.sh/v3/covid-19/all").then((res) => {
      setCountryInfo(res.data);
    });
  }, []);
  useEffect(() => {
    axios.get("https://disease.sh/v3/covid-19/countries").then((res) => {
      const result = res.data.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso2,
      }));
      setTableData(sortData(res.data));
      setMapCountries(res.data);
      setCountries(result);
    });
  }, []);

  const onCountryChange = (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    axios.get(url).then((res) => {
      setCountry(countryCode);
      setCountryInfo(res.data);
      countryCode === "worldwide"
        ? setMapCenter([34.80746, -40.4796])
        : setMapCenter([res.data.countryInfo.lat, res.data.countryInfo.long]);
      console.log(mapCenter);
      setMapZoom(4);
    });
  };
  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide" key="wwd">
                Worldwide
              </MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value} key={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app_stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            title="Coronavirus cases"
            cases={preetyPrintStat(countryInfo.todayCases)}
            total={preetyPrintStat(countryInfo.cases)}
            onClick={(e) => setCasesType("cases")}
          />
          <InfoBox
            active={casesType === "recovered"}
            title="Recovered"
            cases={preetyPrintStat(countryInfo.todayRecovered)}
            total={preetyPrintStat(countryInfo.recovered)}
            onClick={(e) => setCasesType("recovered")}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            title="Deaths"
            cases={preetyPrintStat(countryInfo.todayDeaths)}
            total={preetyPrintStat(countryInfo.deaths)}
            onClick={(e) => setCasesType("deaths")}
          />
        </div>
        <h1>{casesType}</h1>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tabledata} />
          <h3 className="app_graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app_graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
