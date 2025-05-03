using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NorthwindTraders.Application.DTOs
{
    public class OrderDTO
    {
        public int OrderId { get; set; }
        public string? CustomerId { get; set; } = string.Empty;
        public int? EmployeeId { get; set; } = default;
        public string? ContactName { get; set; } = string.Empty;
        public string? EmployeeName { get; set; } = string.Empty;
        public DateTime? OrderDate { get; set; } = DateTime.MinValue;

        public string? ShipAddress { get; set; } = string.Empty;
        public string? ShipCity { get; set; } = string.Empty;
        public string? ShipPostalCode { get; set; } = string.Empty;
        public string? ShipCountry { get; set; } = string.Empty;

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public List<OrderDetailsDTO> OrderDetails { get; set; } = new List<OrderDetailsDTO>();
    }
}
