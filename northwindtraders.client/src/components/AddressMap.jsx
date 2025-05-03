"use client"

import { useEffect, useState } from "react"
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"

const containerStyle = {
  width: "100%",
  height: "200px",
}

function AddressMap({ coordinates, updateCoordinates, address }) {
  const [center, setCenter] = useState({ lat: 41.8781, lng: -87.6298 }) // Default to Chicago

  // Parse coordinates string to lat/lng object
  useEffect(() => {
    if (coordinates) {
      const [lat, lng] = coordinates.split(",").map((coord) => Number.parseFloat(coord.trim()))
      if (!isNaN(lat) && !isNaN(lng)) {
        setCenter({ lat, lng })
      }
    }
  }, [coordinates])

  const onMarkerDragEnd = (e) => {
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    setCenter({ lat, lng })
    updateCoordinates(`${lat},${lng}`)
  }

  const onMapClick = (e) => {
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    setCenter({ lat, lng })
    updateCoordinates(`${lat},${lng}`)
  }

  const searchAddress = () => {
    // Combine address fields
    const addressString = `${address.street}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`

    // Use Google Maps Geocoding API
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address: addressString }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location
        const lat = location.lat()
        const lng = location.lng()

        setCenter({ lat, lng })
        updateCoordinates(`${lat},${lng}`)
      } else {
        alert("No se pudo encontrar la dirección: " + status)
      }
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <button className="secondary" onClick={searchAddress}>
          Buscar Dirección
        </button>
      </div>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15} onClick={onMapClick}>
          <Marker position={center} draggable={true} onDragEnd={onMarkerDragEnd} />
        </GoogleMap>
      </LoadScript>
      <p className="text-xs text-gray-500">
        Tip: Haz clic en el mapa o arrastra el marcador para actualizar las coordenadas
      </p>
    </div>
  )
}

export default AddressMap
