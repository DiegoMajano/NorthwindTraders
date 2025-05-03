using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace NorthwindTraders.Application.DTOs
{
    public class GeocodingResponse
    {
        [JsonPropertyName("results")]
        public List<GeocodingResult> Results { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; }
    }

    public class GeocodingResult
    {
        [JsonPropertyName("geometry")]
        public GeocodingGeometry Geometry { get; set; }
    }

    public class GeocodingGeometry
    {
        [JsonPropertyName("location")]
        public GeocodingLocation Location { get; set; }
    }

    public class GeocodingLocation
    {
        [JsonPropertyName("lat")]
        public double Latitude { get; set; }

        [JsonPropertyName("lng")]
        public double Longitude { get; set; }
    }
}
