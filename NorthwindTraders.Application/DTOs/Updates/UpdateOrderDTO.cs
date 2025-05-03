using NorthwindTraders.Application.DTOs.Creates;
using NorthwindTraders.Application.DTOs.Deletes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NorthwindTraders.Application.DTOs.Updates
{
    public class UpdateOrderDTO
    {
        public int OrderId { get; set; }

        public string CustomerId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime OrderDate { get; set; }

        public string ShipAddress { get; set; } = string.Empty;
        public string ShipCity { get; set; } = string.Empty;
        public string ShipPostalCode { get; set; } = string.Empty;
        public string ShipCountry { get; set; } = string.Empty;

        public List<UpdateOrderDetailsDTO> UpdatedItems { get; set; } = new();
        public List<CreateOrderDetailsDTO> NewItems { get; set; } = new();
        public List<DeleteOrderDetailsDTO> DeletedItems { get; set; } = new();
    }
}
