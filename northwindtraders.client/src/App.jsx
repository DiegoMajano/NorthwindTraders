"use client";

import { useEffect, useState } from "react";
import OrderLines from "./components/OrderLines";
import AddressMap from "./components/AddressMap";
import { FaCheck, FaEllipsisH } from "react-icons/fa";
import { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder } from "./services/orderService";
import { fetchEmployees, fetchCustomers } from "./services/apiService";

function App() {
  const orderId = 10248;
  const [orderData, setOrderData] = useState({
    orderId: 0,
    customerId: "",
    employeeId: 0,
    orderDate: "",
    shipAddress: "",
    shipCity: "",
    shipPostalCode: "",
    shipCountry: "",
    latitude: null,
    longitude: null,
    orderDetails: [
      {
        lineId: 1,
        productId: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
        status: 1,
      },
    ],
  });
  const [originalData, setOriginalData] = useState({
    orderId: 0,
    customerId: "",
    employeeId: 0,
    orderDate: "",
    shipAddress: "",
    shipCity: "",
    shipPostalCode: "",
    shipCountry: "",
    latitude: null,
    longitude: null,
    orderDetails: [
      {
        lineId: 1,
        productId: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
        status: 1,
      },
    ],
  });  
  const [employees, setEmployees] = useState([])
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        const employeesData = await fetchEmployees()
        const customersData = await fetchCustomers()

        console.log(employeesData, customersData)
        
        setOriginalData(data);
        setOrderData(data);
        setEmployees(employeesData)
        setCustomers(customersData)
      } catch (error) {
        console.error("Error al cargar la orden", error);
      }
    };

    fetchOrder();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setOrderData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setOrderData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNewOrder = () => {
    setOrderData({
      customerId: "",
      employeeId: 0,
      orderDate: "",
      shipAddress: "",
      shipCity: "",
      shipPostalCode: "",
      shipCountry: "",
      latitude: null,
      longitude: null,
      orderDetails: [
        {
          lineId: 1,
          productId: "",
          quantity: 1,
          unitPrice: 0,
          total: 0,
          status: 1,
        },
      ],
    });
  };

  const handleSaveOrder = async () => {
    try {
      const newItems = [];
      const updatedItems = [];
      const deletedItems = [];

      console.log("Order data before save:", orderData);

      orderData.orderDetails.forEach((orderDetail) => {
        const originalLine = originalData.orderDetails.find(
          (l) => l.lineId === orderDetail.lineId
        );

        if (orderDetail.status === 0) {
          // Si la línea está marcada como eliminada
          deletedItems.push({
            orderID: orderData.orderId,
            productID: orderDetail.productId,
          });
        } else if (!originalLine) {
          // Si es una línea nueva (no está en los datos originales)
          newItems.push({
            productId: orderDetail.productId,
            unitPrice: orderDetail.unitPrice,
            quantity: orderDetail.quantity,
            discount: 0,
          });
        } else if (
          orderDetail.quantity !== originalLine.quantity ||
          orderDetail.unitPrice !== originalLine.unitPrice
        ) {
          // Si es una línea existente y fue modificada
          updatedItems.push({
            orderID: orderData.orderId,
            productID: orderDetail.productId,
            unitPrice: orderDetail.unitPrice,
            quantity: orderDetail.quantity,
            discount: 0,
          });
        }
      });

      const orderDataToSend = {
        orderId: orderData.orderId,
        customerId: orderData.customerId,
        employeeId: orderData.employeeId,
        orderDate: orderData.orderDate,
        shipAddress: orderData.shipAddress,
        shipCity: orderData.shipCity,
        shipPostalCode: orderData.shipPostalCode,
        shipCountry: orderData.shipCountry,
        updatedItems: updatedItems,
        newItems: newItems,
        deletedItems: deletedItems,
      };

      console.log("Order data to send:", orderDataToSend);

      if (!orderData.orderId) {
        const response = await createOrder(orderDataToSend);
        console.log("Order created:", response);
      } else {
        const response = await updateOrder(
          orderDataToSend.orderId,
          orderDataToSend
        );
        console.log("Order updated:", response);
      }

      alert("Order saved successfully!");
    } catch (error) {
      console.error("Failed to save order:", error);
      alert("Error saving order.");
    }
  };

  const handleDeleteOrder = () => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      handleNewOrder();
      alert("Order deleted successfully!");
    }
  };

  const handleGenerateOrder = () => {
    console.log("Generating order document for:", orderData);
    alert("Order document generated successfully!");
  };

  const updateCoordinates = (newCoordinates) => {
    setOrderData((prev) => ({
      ...prev,
      validatedAddress: {
        ...prev.validatedAddress,
        coordinates: newCoordinates,
      },
    }));
  };

  return (
    <div className="m-3 w-full rounded-2xl bg-gray-200">
      <div className=" rounded-md shadow-sm border p-6">
        {/* Top Action Buttons */}
        <div className="flex gap-2 mb-4">
          <button className="secondary" onClick={handleNewOrder}>
            New
          </button>
          <button className="secondary" onClick={handleSaveOrder}>
            Save
          </button>
          <button className="primary" onClick={handleDeleteOrder}>
            Delete
          </button>
          <div className="ml-auto flex gap-2">
            <button className="secondary" onClick={handleNewOrder}>
              <p>before</p>
            </button>
            <button className="secondary" onClick={handleNewOrder}>
              <p>after</p>
            </button>
            <button className="primary" onClick={handleGenerateOrder}>
              Generate
            </button>
            {/* <button className="secondary px-1">
              <FaEllipsisH />
            </button> */}
          </div>
        </div>

        {/* Customer and Shipping Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-black">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer</label>
              <select
                name="customerId"
                value={orderData.customerId}
                onChange={handleInputChange}
                className="bg-gray-200 border rounded-sm px-2 py-1 border-blue-950 w-full"
                >
                <option value="">-- Select Customer --</option>
                {customers.map((customer, index) => (
                    <option key={index} value={customer.id}>
                    {customer.name}
                    </option>
                ))}
                </select>

            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Order date
              </label>
              <input
                className="bg-gray-200 border rounded-sm px-2 py-1 border-blue-950"
                name="orderDate"
                type="date"
                value={orderData.orderDate?.split("T")[0] || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Shipping address
              </label>
              <div className="flex">
                <input
                  name="shipAddress"
                  className="bg-gray-200 border rounded-sm px-2 py-1 border-blue-950"
                  value={orderData.shipAddress}
                  onChange={handleInputChange}
                />
                <button className="text-white secondary ml-2 px-1">
                  <FaCheck className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Employee</label>
              <select
                name="employeeId"
                value={orderData.employeeId}
                onChange={handleInputChange}
                className="bg-gray-200 border rounded-sm px-2 py-1 border-blue-950 w-full"
            >
                <option value="">-- Select Employee --</option>
                {employees.map((employee, index) => (
                <option key={index} value={employee.id}>
                    {employee.name}
                </option>
                ))}
            </select>
            </div>
          </div>
        </div>
        {/* Order Lines */}
        <OrderLines
          lines={orderData.orderDetails}
          setLines={(newOrderDetails) =>
            setOrderData((prev) => ({ ...prev, orderDetails: newOrderDetails }))
          }
        />

        {/* Validated Address */}
        <div className="mt-6 border rounded-md p-4 text-black bg-gray-300">
          <h3 className="font-medium mb-4">Validated address</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                readOnly
                className="bg-gray-200 border rounded-sm px-2 py-1 border-blue-950"
                name="validatedAddress.city"
                value={orderData.shipCity}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Postal code
              </label>
              <input
                readOnly
                className="bg-gray-200 border rounded-sm px-2 py-1 border-blue-950"
                name="validatedAddress.postalCode"
                value={orderData.shipPostalCode}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                readOnly
                className="bg-gray-200 border rounded-sm px-.5 py-1 border-blue-950"
                name="validatedAddress.country"
                value={orderData.shipCountry}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Geocoded coordinates
              </label>
              <input
                readOnly
                className="bg-gray-200 border rounded-sm px-.5 py-1 border-blue-950"
                name="validatedAddress.coordinates"
                value=""
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Map */}

          {/*}
          <AddressMap
            coordinates={`${orderData.latitude},${orderData.longitude}`}
            updateCoordinates={updateCoordinates}
            address={{
                street: orderData.shipAddress,
                city: orderData.shipCity,
                postalCode: orderData.shipPostalCode,
                country: orderData.shipCountry,
              }}
          />*/}
        </div>
      </div>
    </div>
  );
}

export default App;
