using iText.IO.Font.Constants;
using iText.IO.Image;
using iText.Kernel.Font;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using NorthwindTraders.Application.DTOs;
using NorthwindTraders.Application.Interfaces;
using System;
using System.IO;
using System.Threading.Tasks;

namespace NorthwindTraders.Application.Services
{
    public class PdfService : IPdfService
    {
        public async Task<byte[]> GenerateOrderPdf(OrderDTO orderDto)
        {
            using (var memoryStream = new MemoryStream())
            {
                using (var writer = new PdfWriter(memoryStream))
                {
                    using (var pdf = new PdfDocument(writer))
                    {
                        var document = new Document(pdf);
                        var font = PdfFontFactory.CreateFont(StandardFonts.HELVETICA_BOLD);

                        var imagePath = "C:\\Users\\Diego Majano\\Desktop\\RSM\\FinalAssignment\\NorthwindTraders\\NorthwindTraders.Application\\src\\images.jpeg"; // Ruta de tu imagen
                        var imageData = ImageDataFactory.Create(imagePath);
                        var image = new Image(imageData)
                            .ScaleToFit(200, 200)
                            .SetFixedPosition(36, pdf.GetDefaultPageSize().GetTop() - 90);
                        document.Add(image);

                        document.Add(new Paragraph("\n\n\n\n"));

                        document.Add(new Paragraph($"Order ID: {orderDto.OrderId}")
                            .SetFont(font).SetFontSize(18).SetTextAlignment(TextAlignment.CENTER));

                        document.Add(new Paragraph($"Customer: {orderDto.CustomerId} - {orderDto.
                            ContactName}")
                            .SetFont(font).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT));
                        document.Add(new Paragraph($"Employee: {orderDto.EmployeeId} - {orderDto.
                            EmployeeName}")
                            .SetFont(font).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT));

                        document.Add(new Paragraph($"Ship Address: {orderDto.ShipAddress}, {orderDto.ShipCity}, {orderDto.ShipCountry}")
                            .SetFont(font).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT));
                        document.Add(new Paragraph($"Order Date: {orderDto.OrderDate}")
                            .SetFont(font).SetFontSize(12).SetTextAlignment(TextAlignment.LEFT));

                        var table = new Table(UnitValue.CreatePercentArray(new float[] { 1, 4, 2, 2, 2 })).UseAllAvailableWidth();

                        table.AddHeaderCell(new Cell().Add(new Paragraph("Product ID").SetFont(font)));
                        table.AddHeaderCell(new Cell().Add(new Paragraph("Product Description").SetFont(font)));
                        table.AddHeaderCell(new Cell().Add(new Paragraph("Quantity").SetFont(font)));
                        table.AddHeaderCell(new Cell().Add(new Paragraph("Unit Price").SetFont(font)));
                        table.AddHeaderCell(new Cell().Add(new Paragraph("Discount").SetFont(font)));

                        foreach (var detail in orderDto.OrderDetails)
                        {
                            table.AddCell(new Cell().Add(new Paragraph(detail.ProductId.ToString())));
                            table.AddCell(new Cell().Add(new Paragraph(detail.ProductName)));
                            table.AddCell(new Cell().Add(new Paragraph(detail.Quantity.ToString())));
                            table.AddCell(new Cell().Add(new Paragraph($"{detail.UnitPrice:C}")));
                            table.AddCell(new Cell().Add(new Paragraph($"{detail.Discount * 100}%")));
                        }

                        document.Add(table);
                    }
                }
                return await Task.FromResult(memoryStream.ToArray());
            }
        }
    }
}
