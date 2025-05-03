using NorthwindTraders.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NorthwindTraders.Domain.Interfaces
{
    public interface IOrderDetailsRepository
    {
        Task<List<OrderDetails>> GetByOrderIdAsync(int orderId, int productId);
        Task AddAsync(OrderDetails orderDetail);
        Task UpdateAsync(OrderDetails orderDetail);
        Task DeleteAsync(int orderId, int productId);
    }
}
