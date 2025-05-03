"use client"

import { useEffect, useState } from "react"
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"

const containerStyle = {
  width: "100%",
  height: "200px",
}

function AddressMap({ coordinates, updateCoordinates, address }) {
  const [center, setCenter] = useState({ lat: 41.8781, lng: -87.6298 }) // Default to Chicago

  useEffect(() => {
    if (!window.google) return
  }, [])

  
  useEffect(() => {
    if (coordinates) {
      const [lat, lng] = coordinates.split(",").map((coord) => Number.parseFloat(coord.trim()))
      if (!isNaN(lat) && !isNaN(lng)) {
        setCenter({ lat, lng })
      }
    }
  }, [coordinates])

  return (
    <div className="space-y-2">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
          <Marker position={center} draggable={false} />
        </GoogleMap>
      <p className="text-xs text-gray-500">
        Tip: Haz clic en el mapa o arrastra el marcador para actualizar las coordenadas
      </p>
    </div>
  )
}

export default AddressMap
