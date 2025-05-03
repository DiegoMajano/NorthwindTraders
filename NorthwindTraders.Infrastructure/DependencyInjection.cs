using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NorthwindTraders.Application.Interfaces;
using NorthwindTraders.Application.Services;
using NorthwindTraders.Domain.Interfaces;
using NorthwindTraders.Infrastructure.Persistence.DbContext;
using NorthwindTraders.Infrastructure.Persistence.Repositories;

namespace NorthwindTraders.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services,
                                                               IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("NorthwindDb"));
            });

            services.AddHttpClient();

            services.AddTransient<IGeocodingService, GeocodingService>();
            services.AddTransient<IOrderService, OrderService>();
            services.AddTransient<IOrderRepository, OrderRepository>();
            services.AddTransient<IOrderDetailsRepository, OrderDetailsRepository>();
            services.AddTransient<ICustomerRepository, CustomerRepository>();
            services.AddTransient<IEmployeeRepository, EmployeeRepository>();
            services.AddTransient<IProductRepository, ProductRepository>();
            services.AddTransient<IEmployeeService, EmployeeService>();
            services.AddTransient<ICustomerService, CustomerService>();
            services.AddTransient<IProductService, ProductService>();
            services.AddTransient<IPdfService, PdfService>();

            return services;
        }
    }
}
