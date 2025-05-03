using Microsoft.EntityFrameworkCore;
using NorthwindTraders.Domain.Entities;
using NorthwindTraders.Domain.Interfaces;
using NorthwindTraders.Infrastructure.Persistence.DbContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NorthwindTraders.Infrastructure.Persistence.Repositories
{
    public class OrderDetailsRepository : IOrderDetailsRepository
    {
        private readonly AppDbContext _context;
        public OrderDetailsRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<OrderDetails>> GetByOrderIdAsync(int orderId, int productId)
        {
            return await _context.OrderDetails
                                 .Where(od => od.OrderId == orderId)
                                 .Where(od => od.ProductId == productId)
                                 .Include(od => od.Product)
                                 .ToListAsync();
        }

        public async Task AddAsync(OrderDetails orderDetails)
        {
            await _context.OrderDetails.AddAsync(orderDetails);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(OrderDetails orderDetails)
        {
            _context.OrderDetails.Update(orderDetails);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int orderId, int productId)
        {
            var orderDetail = await _context.OrderDetails
                                             .FirstOrDefaultAsync(od => od.OrderId == orderId && od.ProductId == productId);

            if (orderDetail != null)
            {
                _context.OrderDetails.Remove(orderDetail);
                await _context.SaveChangesAsync();
            }
        }

    }
}
