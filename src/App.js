
import {Route, Routes} from "react-router-dom"
import { useState, createContext } from "react";
import Calendar from "./pages/Calendar"
import './App.css';
import NavBar from "./components/NavBar";
import axios from "axios";

export const LocationsContext = createContext();


function App() {
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);



  const onLocationChange = (selectedOption) => {
    setSelectedLocation(selectedOption);
  };

  const fetchData = async () => {
    // If the data is already fetched it will not fetch it again 
    if (!fetched) {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://605c94c36d85de00170da8b4.mockapi.io/stations"
        );
        console.log(response.data);
        setLocations(response.data);
        // If the response is not empty it will set the selected location to Berlin - This was to populate the Calendar Immediately
        const berlinLocation = response.data.find(location => location.name === 'Berlin')
        if (berlinLocation) {
          setSelectedLocation(berlinLocation.id)
        }
        setFetched(true);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <LocationsContext.Provider value={{ locations, setLocations, selectedLocation, setSelectedLocation }}>
      <NavBar setSelectedLocation={setSelectedLocation} selectedLocation={selectedLocation} locations={locations} fetchData={fetchData} onLocationChange={onLocationChange} />
      <Routes>
        <Route path="/" element={<Calendar 
        locations={locations} setLocations={setLocations} loading={loading} fetchData={fetchData} selectedLocation={selectedLocation} />} />
        <Route path="*" element={<h1>404: Not Found</h1>} />
      </Routes>
      </LocationsContext.Provider>
    </div>
  );
}

export default App;