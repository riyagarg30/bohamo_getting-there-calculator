import React, { useState, useEffect } from "react";
import L from "leaflet";
import {
    Marker,
    useMap,
    Polyline,
    Popup,
    MapContainer,
    TileLayer
  } from "react-leaflet";
  import { Box } from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import { renderToString } from "react-dom/server";
import useStyles from "./styles";

const toRadians = (degrees) => (degrees * Math.PI) / 180;

// Convert radians to degrees
const toDegrees = (radians) => (radians * 180) / Math.PI;

const calculateLineEquation = (source, destination) => {
  // Convert latitude and longitude to x, y (approximating as Cartesian coordinates)
  const x1 = source.lat; // Longitude of source
  const y1 = source.lng; // Latitude of source
  const x2 = destination.lat; // Longitude of destination
  const y2 = destination.lng; // Latitude of destination

  // Calculate the slope (m)
  const m = (y2 - y1) / (x2 - x1);

  // Calculate the y-intercept (b)
  const b = y1 - m * x1;

  // Return the line equation y = mx + b
  return { m, b };
};

const getEquidistantPoints = (source, destination, numPoints = 10) => {
    const { m, b } = calculateLineEquation(source, destination);
    const point1 = [];
    let tempLat = source.lat;
    const diffLat = (destination.lat - source.lat) / 10;
    for (let i = 0; i < 10; i++) {
      tempLat += diffLat;
      const tempLng = m * tempLat + b;
      point1.push({
        lat: tempLat,
        lng: tempLng,
      });
    }
    return point1;
  };

  function calculateBearing(/* lat1, lon1, lat2, lon2 */) {
    const lat1 = 28.6139; // Source latitude
    const lon1 = 77.209; // Source longitude
    const lat2 = 34.0522; // Destination latitude
    const lon2 = -118.2437; // Destination longitude
    const toRad = (degree) => degree * (Math.PI / 180); // Convert degrees to radians
  
    // Convert latitude and longitude from degrees to radians
    const lat1Rad = toRad(lat1);
    const lon1Rad = toRad(lon1);
    const lat2Rad = toRad(lat2);
    const lon2Rad = toRad(lon2);
  
    // Difference in longitudes
    const deltaLon = lon2Rad - lon1Rad;
  
    // Calculate the bearing using the formula
    const x = Math.sin(deltaLon) * Math.cos(lat2Rad);
    const y =
      Math.cos(lat1Rad) * Math.sin(lat2Rad) -
      Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLon);
  
    // Calculate the initial bearing in radians
    const initialBearing = Math.atan2(x, y);
  
    // Convert from radians to degrees
    const initialBearingDeg = (initialBearing * 180) / Math.PI;
  
    // Normalize the bearing to a positive value between 0° and 360°
    const normalizedBearing = (initialBearingDeg + 360) % 360;
  
    return -normalizedBearing - 45;
  }
  
  const createFlightDivIcon = () => {
    const div = document.createElement("div");
    div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path fill="#FF0000" d="M10.18 9" /><path fill="none" d="M0 0h24v24H0z" />
    </svg>`;
    return L.divIcon({
      className: "",
      html: div,
      iconSize: [24, 24],
    });
  };
  
  // Component for animating a flight icon along a path
  const FlightAnimation = ({ path, duration }) => {
    const [position, setPosition] = useState(path[0] || null); // Start at first point
    const [index, setIndex] = useState(0);
    const map = useMap();
  
    useEffect(() => {
      if (!path || path.length === 0) {
        console.error("FlightAnimation: Path is invalid or empty");
        return;
      }
  
      const stepInterval = duration / path.length; // Time per step
      const interval = setInterval(() => {
        setIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= path.length) {
            clearInterval(interval); // Stop animation at the end
            return prevIndex;
          }
          setPosition(path[nextIndex]); // Update current position
          map?.panTo(path[nextIndex]); // Pan map to follow animation
          return nextIndex;
        });
      }, stepInterval);
  
      return () => clearInterval(interval); // Cleanup
    }, [path, duration, map]);
  
    if (!position) return null;
  
    return <Marker position={position} icon={createFlightDivIcon()} />;
  };
  

  const FlightMap = ({ routes }) => {
    const classes = useStyles();
    // Define line styles
    const directLineStyle = {
      color: "blue",
      weight: 3,
      opacity: 1,
    };
  
    const connectingLineStyle = {
      color: "red",
      weight: 2,
      opacity: 0.8,
    };
  
    // Render routes, animations, and markers
    const RenderRoutesAndMarkers = () => {
      const classes = useStyles();
      const redIcon = new L.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png",
        shadowSize: [41, 41],
        // className: classes.redIcon,
      });
  
      const flightIcon = new L.DivIcon({
        html: renderToString(
          <FlightIcon
            style={{
              fill: "red !important",
              fontSize: 40,
              transform: `rotate(${calculateBearing()}deg)`,
            }}
          />
        ),
        className: classes.customFlightIcon, // Optional class for styling
        iconSize: [40, 40], // Adjust size if necessary
        iconAnchor: [20, 20], // Center the icon
      });
  
      const [flightCurr, setflightCurr] = useState({ lat: 28.6139, lng: 77.209 });
  
      const [sourceCoords, setSourceCoords] = useState({
        lat: 28.6139,
        lng: 77.209,
      }); // Default source: New Delhi
      const [destinationCoords, setDestinationCoords] = useState({
        lat: 40.7128,
        lng: -74.006,
      });
      const [equidistantPoints, setEquidistantPoints] = useState([]);
      const [currentPointIndex, setCurrentPointIndex] = useState(0); // Track the current point
      const [markerPosition, setMarkerPosition] = useState(null); 
  
      //   console.log(getEquidistantPoints(sourceCoords, destinationCoords));
  
      const greenIcon = new L.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png",
        shadowSize: [41, 41],
      });
      // const equidistantPoints = getEquidistantPoints(sourceCoords, destinationCoords);
  
      useEffect(() => {
        const points = getEquidistantPoints(sourceCoords, destinationCoords, 10); // 10 equidistant points
        setEquidistantPoints(points);
      }, [sourceCoords, destinationCoords]);
  
      // Use effect to animate the marker over time
      useEffect(() => {
        if (equidistantPoints.length > 0) {
          const interval = setInterval(() => {
              console.log(equidistantPoints[currentPointIndex], currentPointIndex)
              // setflightCurr(equidistantPoints[currentPointIndex])
            setCurrentPointIndex((prevIndex) => {
              const nextIndex = prevIndex + 1;
              console.log("idxs ",prevIndex, nextIndex)
              if (nextIndex >= equidistantPoints.length) {
                clearInterval(interval); // Stop the animation when we reach the last point
                return prevIndex;
              }
              // setMarkerPosition(equidistantPoints[nextIndex]);
              setflightCurr(equidistantPoints[nextIndex])
              return nextIndex;
            });
          }, 1000); // Update every 1 second
  
          return () => clearInterval(interval); // Cleanup interval on unmount
        }
      }, [equidistantPoints]);
  
      return routes.map((route, index) => {
        const elements = [];
        //   const equidistantPoints = getEquidistantPoints(sourceCoords, destinationCoords);
        if (route.flight_type === "Direct") {
          const line = [
            [route.departure_coords.latitude, route.departure_coords.longitude],
            [
              route.destination_coords.latitude,
              route.destination_coords.longitude,
            ],
          ];
          if (line.length > 1) {
            elements.push(
              <Polyline
                key={`direct-line-${index}`}
                positions={line}
                pathOptions={directLineStyle}
              />,
              <FlightAnimation
                key={`direct-flight-${index}`}
                path={line}
                duration={5000}
              />,
              <Marker
                key={`direct-departure-marker-${index}`}
                position={[
                  route.departure_coords.latitude,
                  route.departure_coords.longitude,
                ]}
                icon={redIcon}
                // icons = {<FlightClassOutlined/>}
              >
                <Popup>{`Departure: ${route.departure}`}</Popup>
              </Marker>,
              <Marker
                key={`direct-departure-marker-${index}`}
                position={[flightCurr.lat, flightCurr.lng]}
                icon={flightIcon}
                // icons = {<FlightClassOutlined/>}
              >
                <Popup>{`Departure: ${route.departure}`}</Popup>
              </Marker>,
              <Marker
                key={`direct-destination-marker-${index}`}
                position={[
                  route.destination_coords.latitude,
                  route.destination_coords.longitude,
                ]}
                icon={greenIcon}
              >
                <Popup>{`Destination: ${route.destination}`}</Popup>
              </Marker>
            );
          }
        } else if (route.flight_type === "Connecting") {
          const lineToConnecting = [
            [route.departure_coords.latitude, route.departure_coords.longitude],
            [route.connecting_coords.latitude, route.connecting_coords.longitude],
          ];
          const lineToDestination = [
            [route.connecting_coords.latitude, route.connecting_coords.longitude],
            [
              route.destination_coords.latitude,
              route.destination_coords.longitude,
            ],
          ];
  
          if (lineToConnecting.length > 1) {
            elements.push(
              <Polyline
                key={`connecting-line1-${index}`}
                positions={lineToConnecting}
                pathOptions={connectingLineStyle}
              />,
              <FlightAnimation
                key={`connecting-flight1-${index}`}
                path={lineToConnecting}
                duration={3000}
              />,
              <Marker
                key={`connecting-departure-marker-${index}`}
                position={[
                  route.departure_coords.latitude,
                  route.departure_coords.longitude,
                ]}
                icon={redIcon}
              >
                <Popup>{`Departure: ${route.departure}`}</Popup>
              </Marker>,
              <Marker
                key={`connecting-stopover-marker-${index}`}
                position={[
                  route.connecting_coords.latitude,
                  route.connecting_coords.longitude,
                ]}
              >
                <Popup>{`Stopover: ${route.connecting_airport}`}</Popup>
              </Marker>
            );
          }
  
          if (lineToDestination.length > 1) {
            elements.push(
              <Polyline
                key={`connecting-line2-${index}`}
                positions={lineToDestination}
                pathOptions={connectingLineStyle}
              />,
              <FlightAnimation
                key={`connecting-flight2-${index}`}
                path={lineToDestination}
                duration={3000}
              />,
              <Marker
                key={`connecting-destination-marker-${index}`}
                position={[
                  route.destination_coords.latitude,
                  route.destination_coords.longitude,
                ]}
                icon={greenIcon}
              >
                <Popup>{`Destination: ${route.destination}`}</Popup>
              </Marker>
            );
          }
        }
      //   equidistantPoints.forEach((point, idx) => {
      //     elements.push(
      //       <Marker
      //         key={`equidistant-point-${idx}`}
      //         position={[point.lat, point.lng]}
      //         icon={greenIcon}
      //       >
      //         <Popup>{`Equidistant Point ${point.lat}, ${point.lng}`}</Popup>
      //       </Marker>
      //     );
      //   });
        return elements;
      });
    };
  
    return (
      <Box sx={{ width: "100%", height: "95vh", position: "relative" }}>
        <MapContainer
          center={[28.6139, 77.209]} // Center at New Delhi
          zoom={3}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
  
          {/* Render routes and markers */}
          <RenderRoutesAndMarkers />
        </MapContainer>
      </Box>
    );
  };
  

export default FlightMap