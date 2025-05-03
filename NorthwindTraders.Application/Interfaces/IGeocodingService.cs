using NorthwindTraders.Application.DTOs;
using NorthwindTraders.Application.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NorthwindTraders.Application.Interfaces
{
    public interface IGeocodingService
    {
        Task<GeocodingResponse> GetCoordinatesAsync(string address);
    }
}
