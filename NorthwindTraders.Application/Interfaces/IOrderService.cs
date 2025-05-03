using NorthwindTraders.Application.DTOs.Creates;
using NorthwindTraders.Application.DTOs.Updates;
using NorthwindTraders.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NorthwindTraders.Application.Interfaces
{
    public interface IOrderService
    {
        Task<OrderDTO> CreateOrderAsync(CreateOrderDTO createOrderDto);

        Task<List<OrderDTO>> GetAllOrdersAsync();

        Task<OrderDTO> GetOrderByIdAsync(int orderId);

        Task<OrderDTO> UpdateOrderAsync(UpdateOrderDTO updateOrderDto);

        Task<bool> DeleteOrderAsync(int orderId);

        Task GenerateAllOrdersPdfAsync();
    }

}
