using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NorthwindTraders.Application.DTOs.Creates
{
    public class CreateOrderDTO
    {
        public string CustomerId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime OrderDate { get; set; }

        public string ShipAddress { get; set; } = string.Empty;
        public string ShipCity { get; set; } = string.Empty;
        public string ShipPostalCode { get; set; } = string.Empty;
        public string ShipCountry { get; set; } = string.Empty;

        public double? Latitude { get; set; }  
        public double? Longitude { get; set; }

        public List<CreateOrderDetailsDTO> OrderDetails { get; set; } = new();
    }
}
