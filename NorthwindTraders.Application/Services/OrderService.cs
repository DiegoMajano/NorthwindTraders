using NorthwindTraders.Application.DTOs;
using NorthwindTraders.Application.DTOs.Creates;
using NorthwindTraders.Application.DTOs.Updates;
using NorthwindTraders.Application.Interfaces;
using NorthwindTraders.Domain.Entities;
using NorthwindTraders.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NorthwindTraders.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IOrderDetailsRepository _detailsRepository;
        private readonly IGeocodingService _geocodingService;

        public OrderService(
            IOrderRepository orderRepository,
            IOrderDetailsRepository detailsRepository,
            IGeocodingService geocodingService)
        {
            _orderRepository = orderRepository;
            _detailsRepository = detailsRepository;
            _geocodingService = geocodingService;
        }

        public async Task<OrderDTO> CreateOrderAsync(CreateOrderDTO createOrderDto)
        {
            var coords = await _geocodingService.GetCoordinatesAsync(createOrderDto.ShipAddress);

            var order = new Order
            {
                CustomerId = createOrderDto.CustomerId,
                EmployeeId = createOrderDto.EmployeeId,
                OrderDate = DateTime.Now,
                ShipAddress = createOrderDto.ShipAddress,
                ShipCity = createOrderDto.ShipCity,
                ShipPostalCode = createOrderDto.ShipPostalCode,
                ShipCountry = createOrderDto.ShipCountry
            };

            var orderId = await _orderRepository.AddAsync(order);


            foreach (var item in createOrderDto.OrderDetails)
            {
                var detail = new OrderDetails
                {
                    OrderId = orderId,
                    ProductId = item.ProductId,
                    UnitPrice = item.UnitPrice,
                    Quantity = item.Quantity,
                    Discount = item.Discount
                };

                await _detailsRepository.AddAsync(detail);
            }

            return await GetOrderByIdAsync(orderId);
        }

        public async Task<List<OrderDTO>> GetAllOrdersAsync()
        {
            var orders = await _orderRepository.GetAllAsync();

            if (orders == null || !orders.Any())
                return new List<OrderDTO>();

            return orders.Select(order => new OrderDTO
            {
                OrderId = order.OrderId,
                OrderDate = order.OrderDate ?? DateTime.MinValue,
                CustomerId = order.CustomerId,
                EmployeeId = order.EmployeeId ?? default,
                ShipAddress = order.ShipAddress ?? string.Empty,
                ShipCity = order.ShipCity ?? string.Empty,
                ShipPostalCode = order.ShipPostalCode ?? string.Empty,
                ShipCountry = order.ShipCountry ?? string.Empty,
                OrderDetails = order.OrderDetails.Select(d => new OrderDetailsDTO
                {
                    ProductId = d.ProductId,
                    UnitPrice = d.UnitPrice,
                    Quantity = d.Quantity,
                    Discount = d.Discount
                }).ToList()
            }).ToList();
        }

        public async Task<OrderDTO> GetOrderByIdAsync(int orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
                return null;

            return new OrderDTO
            {
                OrderId = order.OrderId,
                OrderDate = order.OrderDate ?? DateTime.MinValue,
                CustomerId = order.CustomerId,
                EmployeeId = order.EmployeeId ?? default,
                ShipAddress = order.ShipAddress ?? string.Empty,
                ShipCity = order.ShipCity ?? string.Empty,
                ShipPostalCode = order.ShipPostalCode ?? string.Empty,
                ShipCountry = order.ShipCountry ?? string.Empty,
                OrderDetails = order.OrderDetails.Select(d => new OrderDetailsDTO
                {
                    ProductId = d.ProductId,
                    UnitPrice = d.UnitPrice,
                    Quantity = d.Quantity,
                    Discount = d.Discount
                }).ToList()
            };
        }

        public async Task<OrderDTO> UpdateOrderAsync(UpdateOrderDTO updateOrderDto)
        {
            var order = await _orderRepository.GetByIdAsync(updateOrderDto.OrderId);
            if (order == null)
                throw new Exception("Order not found");

            // Actualizar datos generales
            if (order.ShipAddress != updateOrderDto.ShipAddress)
                order.ShipAddress = updateOrderDto.ShipAddress;

            if (order.ShipCity != updateOrderDto.ShipCity)
                order.ShipCity = updateOrderDto.ShipCity;

            if (order.ShipPostalCode != updateOrderDto.ShipPostalCode)
                order.ShipPostalCode = updateOrderDto.ShipPostalCode;

            if (order.ShipCountry != updateOrderDto.ShipCountry)
                order.ShipCountry = updateOrderDto.ShipCountry;

            // Actualizar o agregar ítems
            foreach (var updatedItem in updateOrderDto.UpdatedItems)
            {
                var detail = order.OrderDetails.FirstOrDefault(d => d.ProductId == updatedItem.ProductID);
                if (detail != null)
                {
                    detail.UnitPrice = updatedItem.UnitPrice;
                    detail.Quantity = updatedItem.Quantity;
                    detail.Discount = updatedItem.Discount;
                }
                else
                {
                    var newDetail = new OrderDetails
                    {
                        ProductId = updatedItem.ProductID,
                        UnitPrice = updatedItem.UnitPrice,
                        Quantity = updatedItem.Quantity,
                        Discount = updatedItem.Discount,
                        OrderId = order.OrderId
                    };
                    order.OrderDetails.Add(newDetail);
                }
            }

            // Agregar nuevos ítems
            foreach (var newItem in updateOrderDto.NewItems)
            {
                if (!order.OrderDetails.Any(d => d.ProductId == newItem.ProductId))
                {
                    var newDetail = new OrderDetails
                    {
                        ProductId = newItem.ProductId,
                        UnitPrice = newItem.UnitPrice,
                        Quantity = newItem.Quantity,
                        Discount = newItem.Discount,
                        OrderId = order.OrderId
                    };
                    order.OrderDetails.Add(newDetail);
                }
            }

            // Eliminar ítems
            foreach (var deletedItem in updateOrderDto.DeletedItems)
            {
                var detailToDelete = order.OrderDetails.FirstOrDefault(d => d.ProductId == deletedItem.ProductID);
                if (detailToDelete != null)
                {
                    order.OrderDetails.Remove(detailToDelete); // Quitar de la colección local
                    await _detailsRepository.DeleteAsync(detailToDelete.OrderId, detailToDelete.ProductId); // Y delegar la eliminación
                }
            }

            await _orderRepository.UpdateAsync(order);
            return await GetOrderByIdAsync(updateOrderDto.OrderId);
        }


        public async Task<bool> DeleteOrderAsync(int orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) return false;

            return await _orderRepository.DeleteAsync(order.OrderId);
        }

        public async Task GenerateAllOrdersPdfAsync()
        {
            var orders = await _orderRepository.GetAllAsync();

            // Aquí usarías una librería como iTextSharp, QuestPDF o PdfSharp para generar el PDF.
            // Puedes crear un servicio separado para generación de PDF si prefieres separar responsabilidades.
            throw new NotImplementedException("Generación de PDF aún no implementada");
        }
    }



}
