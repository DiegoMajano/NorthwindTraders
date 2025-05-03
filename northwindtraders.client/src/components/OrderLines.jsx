"use client"

import { useEffect, useState } from "react"
import { fetchCustomers, fetchProducts, fetchEmployees } from "../services/apiService"

function OrderLines({ lines, setLines }) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await fetchProducts()
        console.log(productsData);
        
        setProducts(productsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const handleAddLine = () => {
    setLines([
      ...lines,
      { lineId: lines.length + 1, productId: "", quantity: 1, unitPrice: 0, total: 0, status: 1 },
    ])
  }

  const handleDeleteLine = () => {
    // Buscar el último índice de una línea activa (status: 1)
    const lastActiveIndex = [...lines]
      .map((line, index) => ({ line, index }))
      .reverse()
      .find(({ line }) => line.status === 1)?.index
  
    if (lastActiveIndex !== undefined) {
      const updatedLines = lines.map((line, index) =>
        index === lastActiveIndex ? { ...line, status: 0 } : line
      )
      setLines(updatedLines)
    }
  }
  
  const handleLineChange = (lineId, updates) => {
    setLines(
      lines.map((line) => {
        if (line.lineId === lineId) {
          let updatedLine = {
            ...line,
            ...updates, 
          }

          
          if (updates.productId){

            updatedLine = { ...updatedLine, status: 0 };

            const product = products.find((p) => p.id === updates.productId);
          const newLine = {
            lineId: lines.length+1,
            productId: updates.productId,
            quantity: line.quantity, 
            unitPrice: product ? product.unitPrice : 0, 
            total: product ? product.unitPrice * line.quantity : 0,
            status: 1, 
          };

          return [...lines, updatedLine, newLine]; 
          } 
  
          if (
            typeof updatedLine.quantity === "number" &&
            typeof updatedLine.unitPrice === "number"
          ) {
            updatedLine.total = updatedLine.quantity * updatedLine.unitPrice
          }
  
          return updatedLine
        }
        return line
      })
    )
  } 
 

  return (
    <div className="mt-6">
      <div className="flex items-center mb-2">
        <h3 className="font-medium text-black">Lines</h3>
        <div className="flex gap-2 ml-4">
          <button className="secondary" onClick={handleAddLine}>
            New
          </button>          
          <button className="primary" onClick={handleDeleteLine}>
            Delete
          </button>
        </div>
      </div>

      <div className="bg-gray-300 rounded-md overflow-hidden">
        <div className="grid grid-cols-4 bg-blue-950 text-sm font-medium p-2 text-white">
          <div>Product</div>
          <div>Quantity</div>
          <div>Unit Price</div>
          <div>Total</div>
        </div>

        <div className="p-2 space-y-2">
          {lines.map((line) => ( line.status === 1 &&
            <div key={line.lineId} className="grid grid-cols-4 gap-2">
              <select
                className="bg-gray-200 text-black px-2 border rounded-sm border-blue-950"
                value={line.productId}
                onChange={(e) => {
                  const selectedId = Number(e.target.value)
                  const selectedProduct = products.find((p) => p.id === selectedId)
                  if (selectedProduct) {
                    handleLineChange(line.lineId, {"productId" : selectedProduct.id, "unitPrice" : Number(selectedProduct.unitPrice)})
                  }
                }}
              >
                <option value="">-- Select Product --</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>

              <input
                className="bg-gray-200 text-black px-2 border rounded-sm border-blue-950"
                type="number"
                value={line.quantity}
                min={1}
                onChange={(e) => handleLineChange(line.lineId, {"quantity": Number(e.target.value)})}
              />

              <input
                className="bg-gray-200 text-black px-2 border rounded-sm border-blue-950"
                type="number"
                readOnly
                value={`${line.unitPrice.toFixed(2)}`}
                />

              <input
                className="bg-gray-200 text-black px-2 border rounded-sm border-blue-950"
                readOnly
                value={line.total ? `$ ${line.total}` : `$${line.quantity * line.unitPrice}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OrderLines
