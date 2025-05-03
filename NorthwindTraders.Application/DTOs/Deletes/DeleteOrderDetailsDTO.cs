using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NorthwindTraders.Application.DTOs.Deletes
{
    public class DeleteOrderDetailsDTO
    {
        public int OrderID { get; set; }
        public int ProductID { get; set; }
    }
}
