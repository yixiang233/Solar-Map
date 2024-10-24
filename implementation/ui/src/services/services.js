import axios from 'axios';
const baseURL = "https://solar.googleapis.com/v1";
const tmrURL = "https://api.tomorrow.io/v4/weather/forecast?location=";
const localURL = "http://localhost:3001";

const getParams = () => {
    return (
        axios
        .get(localURL + "/params")
        .then(res => res.data)
    )
}

const sendParams = (params) => {
    console.log(params);
    return (
        axios
        .put(localURL + "/params", params)
    )
}

const getResults = () => {
    return (
        axios
        .get(localURL + "/results")
        .then(res => res.data)
    )
}

const sendResults = (results) => {
    return (
        axios
        .put(localURL + "/results", results)
    )
}

const getBuildingInsights = (params) => {
    /*
    const params = 
    {
        location: 
            {
                lat: "",
                lng: ""
            },
        requiredQuality: ""
    }
    */
    const parameters = "?location.latitude=" + params.location.lat + "&location.longitude=" + params.location.lng + 
        "&requiredQuality=" + params.requiredQuality + "&key=" + process.env.REACT_APP_SOLAR_API_KEY;
    const requestURL = baseURL + "/buildingInsights:findClosest" + parameters;

    return (
        axios
        .get(requestURL)
        .then(response => response.data)
        .catch(e => console.log("No building found near here. Error: ", e))
    );
};

const getWeatherInfo = (coords) => {
    const requestURL = tmrURL + coords.lat + "," + coords.lng + "&apikey=" + process.env.REACT_APP_TMR_API_KEY;

    return (
        axios
        .get(requestURL)
        .then(response => response.data)
    )
}

const services = {getBuildingInsights, getWeatherInfo, getParams, sendParams, getResults, sendResults};
export default services;