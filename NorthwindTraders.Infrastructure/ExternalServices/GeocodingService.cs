using Microsoft.Extensions.Configuration;
using NorthwindTraders.Application.DTOs;
using NorthwindTraders.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace NorthwindTraders.Application.Services
{
    public class GeocodingService : IGeocodingService
    {
        private readonly string _apiKey;
        private readonly HttpClient _httpClient;

        public GeocodingService(IConfiguration configuration, HttpClient httpClient)
        {
            _apiKey = configuration["GoogleMaps:ApiKey"]; 
            _httpClient = httpClient;
        }

        public async Task<GeocodingResponse> GetCoordinatesAsync(string address)
        {
            var url = $"https://maps.googleapis.com/maps/api/geocode/json?address={Uri.EscapeDataString(address)}&key={_apiKey}";

            var response = await _httpClient.GetStringAsync(url);
            return JsonSerializer.Deserialize<GeocodingResponse>(response);
        }
    }    

}
