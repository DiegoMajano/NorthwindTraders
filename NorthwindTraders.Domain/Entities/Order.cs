using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NorthwindTraders.Domain.Entities
{
    public class Order
    {
        public int OrderId { get; set; }

        public string? CustomerId { get; set; } = string.Empty;
        public int? EmployeeId { get; set; } = default;

        public DateTime? OrderDate { get; set; } = DateTime.MinValue;
        public string? ShipAddress { get; set; } = string.Empty;
        public string? ShipCity { get; set; } = string.Empty;
        public string? ShipPostalCode { get; set; } = string.Empty;
        public string? ShipCountry { get; set; } = string.Empty;

        public Customer? Customer { get; set; }
        public Employee? Employee { get; set; }
        public ICollection<OrderDetails> OrderDetails { get; set; } = new List<OrderDetails>();


    }
}
