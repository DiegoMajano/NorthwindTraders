using Microsoft.AspNetCore.Mvc;
using NorthwindTraders.Application.DTOs.Creates;
using NorthwindTraders.Application.DTOs.Updates;
using NorthwindTraders.Application.Interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NorthwindTraders.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // Crear una nueva orden
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDTO createOrderDto)
        {
            if (createOrderDto == null)
                return BadRequest("El cuerpo de la solicitud no es válido.");

            var order = await _orderService.CreateOrderAsync(createOrderDto);
            return CreatedAtAction(nameof(GetOrderById), new { orderId = order.OrderId }, order);
        }

        // Obtener todas las órdenes
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderService.GetAllOrdersAsync();

            if (orders == null)
                return NoContent();

            return Ok(orders);
        }

        // Obtener una orden por su ID
        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrderById(int orderId)
        {
            var order = await _orderService.GetOrderByIdAsync(orderId);

            if (order == null)
                return NotFound();

            return Ok(order);
        }

        // Actualizar una orden existente
        [HttpPut("{orderId}")]
        public async Task<IActionResult> UpdateOrder(int orderId, [FromBody] UpdateOrderDTO updateOrderDto)
        {
            if (updateOrderDto == null)
                return BadRequest("El cuerpo de la solicitud no es válido.");

            if (orderId != updateOrderDto.OrderId)
                return BadRequest("El ID de la orden no coincide.");

            var updatedOrder = await _orderService.UpdateOrderAsync(updateOrderDto);

            if (updatedOrder == null)
                return NotFound();

            return Ok(updatedOrder);
        }

        // Eliminar una orden
        [HttpDelete("{orderId}")]
        public async Task<IActionResult> DeleteOrder(int orderId)
        {
            var result = await _orderService.DeleteOrderAsync(orderId);

            if (!result)
                return NotFound();

            return NoContent();
        }

        // Generar reporte PDF de todas las órdenes
        [HttpGet("GenerateAllOrdersPdf")]
        public async Task<IActionResult> GenerateAllOrdersPdf()
        {
            await _orderService.GenerateAllOrdersPdfAsync();
            return NoContent();
        }
    }
}
