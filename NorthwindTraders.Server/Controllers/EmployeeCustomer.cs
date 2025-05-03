using Microsoft.AspNetCore.Mvc;
using NorthwindTraders.Application.Interfaces;
using NorthwindTraders.Domain.Entities;
using NorthwindTraders.Domain.Interfaces;

namespace NorthwindTraders.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetAll()
        {
            var employees = await _employeeService.GetAllAsync();
            return Ok(employees);
        }
    }
}
