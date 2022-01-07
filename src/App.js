import React, { useEffect, useMemo } from "react";
import { sortBy } from "lodash";
import CountrySelector from "./components/CountrySelector";
import { getCountries, getReportByCountry } from "./components/apis";
import Summary from "./components/Summary";
import Highlight from "./components/Highlight";
import { Container, Typography } from "@material-ui/core";
import "@fontsource/roboto";
import moment from "moment";
import "moment/locale/vi";
import "./App.css";
import image from "./images/image.png";

moment.locale("vi");
const App = () => {
  const [countries, setCountries] = React.useState([]);
  const [selectedCountryId, setSelectedCountryId] = React.useState("");
  const [report, setReport] = React.useState([]);

  useEffect(() => {
    getCountries().then((res) => {
      const { data } = res;
      const countries = sortBy(data, "Country");
      setCountries(countries);
      setSelectedCountryId("vn");
    });
  }, []);

  const handleOnChange = React.useCallback((e) => {
    setSelectedCountryId(e.target.value);
  }, []);

  useEffect(() => {
    if (selectedCountryId) {
      const selectedCountry = countries.find(
        (country) => country.ISO2 === selectedCountryId.toUpperCase()
      );
      getReportByCountry(selectedCountry.Slug).then((res) => {
        console.log("getReportByCountry", { res });
        // remove last item = current date
        res.data.pop();
        setReport(res.data);
      });
    }
  }, [selectedCountryId, countries]);

  const summary = useMemo(() => {
    if (report && report.length) {
      const latestData = report[report.length - 1];
      return [
        {
          title: "Số ca nhiễm",
          count: latestData.Confirmed,
          type: "confirmed",
        },
        {
          title: "Số ca khỏi",
          count: latestData.Recovered,
          type: "recovered",
        },
        {
          title: "Số ca tử vong",
          count: latestData.Deaths,
          type: "death",
        },
      ];
    }
    return [];
  }, [report]);

  return (
    <Container style={{ marginTop: 20 }}>
      <img src={image} alt="COVID-19" />
      <Typography>{moment().format("LLL")}</Typography>
      <CountrySelector
        handleOnChange={handleOnChange}
        countries={countries}
        value={selectedCountryId}
      />
      <Highlight summary={summary} />
      <Summary countryId={selectedCountryId} report={report} />

      <h2>Mot vai video</h2>
      <iframe
        width="610"
        height="510"
        src="https://www.youtube.com/embed/ioYr-CkYq5U"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
      <iframe
        width="610"
        height="510"
        src="https://www.youtube.com/embed/BtulL3oArQw?autoplay=1"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </Container>
  );
};

export default App;
