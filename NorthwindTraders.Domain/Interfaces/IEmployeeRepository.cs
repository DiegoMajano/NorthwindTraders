using NorthwindTraders.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NorthwindTraders.Domain.Interfaces
{
    public interface IEmployeeRepository
    {
        Task<Employee> GetByIdAsync(int employeeId);
        Task<IEnumerable<Employee>> GetAllAsync();
    }
}
