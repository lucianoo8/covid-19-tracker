import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from './Map';
import LineGraph from './LineGraph'; 
import Table from './Table';
import {sortData,prettyPrintStat} from './util';
import "leaflet/dist/leaflet.css";
import './App.css';

function App() {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('wordlwide');
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
    const [mapZoom, setMapZoom] = useState(3);
    const [mapCountries, setMapCountries] = useState([]);
    const [casesType, setCaseType] = useState("cases");

        // USEEFFECT = runs a piece of code base on 
        // a given condition

    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all" )
        .then((response) => response.json())
        .then((data) => {
            setCountryInfo(data);
        });
    }, []);

    useEffect(() => {
        //this code will run once when the component loads and not again after
        // async -> seed a request, wait for it, do something with
        const getCountriesData = async() => {
            await fetch("https://disease.sh/v3/covid-19/countries")
                .then((Response) => Response.json())
                .then((data) => {
                    const countries = data.map((country) => ({
                        name: country.country,   // country name
                        value: country.countryInfo.iso2 //fr, en
                    }));
                    const sortedData = sortData(data);
                    setTableData(sortedData);
                    setMapCountries(data);
                    setCountries(countries);
                });
        };
        getCountriesData();

    }, []); // empty array mean fire one and don't fire it again.

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;
        setCountry(countryCode);
        
        // Fecth data
    const url = countryCode === "worldwide"
       ? "https://disease.sh/v3/covid-19/all"

       :  `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
       await fetch(url)
        .then((response) => response.json())
        .then((data) =>{
           setCountry(countryCode);
           // All of the data from country response
           setCountryInfo(data);

           setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
           setMapZoom(4);
        });
     };

      //https://disease.sh/v3/covid-19/all
      //https://disease.sh/v3/covid-19/countries

      console.log("country Info",countryInfo);

return (
        
    <div className = "app" >

        <div className = "app__left"> 
               { /* Header*/ } { /*Title + select input drowpdown field */ }

            <div className = "app__header">

                <h1> COVID - 19 TRACKER </h1>
                { /* loop through all the countries and show a dropdowm list of option*/ }
                <FormControl className = "app__dropdown" >
                    <Select variant = "outlined"
                        onChange = { onCountryChange }
                        value = { country } 
                        >
                        <MenuItem value = "wordlwide" > Worldwide </MenuItem>
                        
                         {
                            //https://disease.sh/v3/covid-19/countries
                            countries.map(country => (
                                <MenuItem value = { country.value } > { country.name } </MenuItem>
                            ))
                        } 
                        
                    </Select> 
                </FormControl> 
            </div>

            <div className = "app__stats" > { /*InfoBoxs */ }
                <InfoBox title = "Coronavirus Cases" 
                isRed
                active ={casesType === "cases"}
                 onClick = {(e) =>setCaseType("cases")}
                 cases = {prettyPrintStat(countryInfo.todayCases)}
                  total = {prettyPrintStat(countryInfo.cases)} 
                  />
                <InfoBox title = "Recovered" 
                active ={casesType === "recovered"}
                onClick = {(e) =>setCaseType("recovered")}
                cases={prettyPrintStat(countryInfo.todayRecovered)} 
                total = {prettyPrintStat(countryInfo.recovered)} /> 

                <InfoBox title = "Deaths" 
                isRed
                active ={casesType === "deaths"}
                onClick = {(e) =>setCaseType("deaths")}
                cases = {prettyPrintStat(countryInfo.todayDeaths)} 
                total = {prettyPrintStat(countryInfo.deaths)} />
            </div>
 
            { /*Map  npm  i react-leafleft*/ }
            <Map
            casesType = {casesType}
             center={ mapCenter }
              zoom={ mapZoom } 
              countries = {mapCountries}
              />
        </div>
        
        <Card className="app__rightS">
            <CardContent>
                <h3>Live Cases by Country</h3>
                { /*table */ } 
                <Table countries={tableData}/>

                <h3>Worldwide new {casesType}</h3>

                { /*Graph */ } 
                <LineGraph ClassName="app__graph" casesType={casesType}/> 
                
            </CardContent>
        </Card>
    </div>
    );
}

export default App;