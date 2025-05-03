"use client";

import { useEffect, useState , useRef} from "react";
import OrderLines from "./components/OrderLines";
import AddressMap from "./components/AddressMap";
import { FaCheck, FaAngleRight, FaAngleLeft  } from "react-icons/fa6";
import { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder, downloadOrderPdf } from "./services/orderService";
import { fetchEmployees, fetchCustomers } from "./services/apiService";
import Swal from "sweetalert2";
import { GoogleMap, useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';


const googleLibraries = ['places']; 
function App() {
  const [orderId, setOrderId] = useState(11087); //10248 es el primer id de orden
  const [isChange, setIsChange] = useState(0);
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
  const [validIds, setValidIds] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const searchBoxRef = useRef(null);

const handleLoad = ref => {
  searchBoxRef.current = ref;
};

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: googleLibraries,
  });


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
    const today = new Date();
    const formattedDate = today.toISOString(); 
    
    setOrderData({
      customerId: "",
      employeeId: 0,
      orderDate: formattedDate,
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
          unitPrice:0,
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
      const removedProductIds = originalData.orderDetails
        .filter(
          (original) =>
            !orderData.orderDetails.some(
              (current) => current.productId === original.productId
            )
        )
        .map((removed) => removed.productId);

        const newProductIds = orderData.orderDetails
        .filter(
          (original) =>
            !originalData.orderDetails.some(
              (current) => current.productId === original.productId
            )
        )
        .map((newed) => newed.productId);

        newProductIds.forEach((productId) => {
            const orderDetail = orderData.orderDetails.find(
              (detail) => detail.productId === productId
            );
            newItems.push({
                productId: orderDetail.productId,
                unitPrice: orderDetail.unitPrice,
                quantity: orderDetail.quantity,
                discount: 0,
            });
        });
        removedProductIds.forEach((productId) => {
        deletedItems.push({
          orderID: orderData.orderId,
          productID: productId,
        });
      });

        orderData.orderDetails.forEach((orderDetail) => {
        const originalLine = originalData.orderDetails.find(
          (l) => l.lineId === orderDetail.lineId
        );
  
        if (orderDetail.status === 0) {
          deletedItems.push({
            orderID: orderData.orderId,
            productID: orderDetail.productId,
          });
        } else if (!originalLine) {
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
          updatedItems.push({
            orderID: orderData.orderId,
            productID: orderDetail.productId,
            unitPrice: orderDetail.unitPrice,
            quantity: orderDetail.quantity,
            discount: 0,
          });
        }
      });

      
      
      let orderDataToSend = {
          orderId: orderData.orderId,
          customerId: orderData.customerId,
          employeeId: Number(orderData.employeeId),
        orderDate: orderData.orderDate,
        shipAddress: orderData.shipAddress,
        shipCity: orderData.shipCity,
        shipPostalCode: orderData.shipPostalCode,
        shipCountry: orderData.shipCountry,
        updatedItems,
        newItems,
        deletedItems,
    }

    if (orderData.orderId === undefined){
        let orderDetails = []
        orderData.orderDetails.forEach((orderDetail) => {
            orderDetails.push({
                productId: orderDetail.productId,
                unitPrice: orderDetail.unitPrice,
                quantity: orderDetail.quantity,
                discount: 0,
              });
            });

        orderDataToSend = {...orderDataToSend, orderDetails}    
      }

      if (!orderData.orderId) {
        const response = await createOrder(orderDataToSend);
        setOrderId(response.orderId);
        setValidIds((prev) => [...prev, response.orderId]);
        setIsChange(prev => prev + 1)
        await Swal.fire("Creado", "La orden se creó correctamente", "success");
    } else {
        const response = await updateOrder(orderDataToSend.orderId, orderDataToSend);
        setOrderId(response.orderId);
        setIsChange(prev => prev + 1)
        await Swal.fire("Actualizado", "La orden se actualizó correctamente", "success");
    }
    } catch (error) {
        console.error("Failed to save order:", error);
        await Swal.fire("Error", "Hubo un error al guardar la orden", "error");
    }
  };
  

  const handleDeleteOrder = async () => {
    const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará la orden actual",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });
    
      if (result.isConfirmed) {
        await deleteOrder(orderId);        
        await Swal.fire("Eliminado", "La orden fue eliminada", "success");
        setIsChange(prev => prev + 1)
      }
  };

  const handleGenerateOrder = async (orderId) => {
    try {
      await downloadOrderPdf(orderId); 
      
      await Swal.fire("Generado", "El documento de la orden fue generado", "success");
    } catch (error) {
        console.error("Error al generar el PDF:", error);
      await Swal.fire("Error", "Hubo un problema al generar el PDF", "error");
    }
  };
  

  const updateCoordinates = ({ lat, lng }) => {
    console.log("updateCoordinates", lat, lng);
    
    setOrderData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };
  
  

  const handleNextOrder = () => {
    const currentIndex = validIds.indexOf(orderId);
    if (currentIndex >= 0 && currentIndex < validIds.length - 1) {
        setOrderId(validIds[currentIndex + 1]);
        setIsChange(prev => prev + 1)
    } else {
        Swal.fire("Atención", "No hay más órdenes disponibles", "info");
    }
}

const handlePreviousOrder = async () => {
    const currentIndex = validIds.indexOf(orderId);
    if (currentIndex > 0) {
        setOrderId(validIds[currentIndex - 1]);
        setIsChange(prev => prev + 1)
    } else {
        Swal.fire("Atención", "No hay órdenes anteriores disponibles", "info");
    }
}

const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      const address = place.formatted_address;
      const components = place.address_components;
  
      const getComponent = (types) =>
        components.find((c) => types.some((t) => c.types.includes(t)))?.long_name || '';
  
      const city = getComponent(['locality', 'administrative_area_level_2']);
      const postalCode = getComponent(['postal_code']);
      const country = getComponent(['country']);
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
  
      setOrderData((prev) => ({
        ...prev,
        shipAddress: address,
        shipCity: city,
        shipPostalCode: postalCode,
        shipCountry: country,
        latitude: lat,
        longitude: lng,
      }));
  
      updateCoordinates({ lat, lng });
    }
  };

useEffect(() => {
    const fetchOrder = async () => {
      try {
        if(isChange <= 0){
        
            const [orders, employeesData, customersData, data] = await Promise.all([
                getAllOrders(),
                fetchEmployees(),
                fetchCustomers(),
                getOrderById(orderId) 
            ]);
            const ids = orders.map((order) => order.orderId);
            setValidIds(ids)
            setEmployees(employeesData)
            setCustomers(customersData)   
            setOriginalData(data);
            setOrderData(data);
            setOrderId(ids[0]);
        } else{
            const data = await getOrderById(orderId)            
            setOriginalData(data);
            setOrderData(data);
        }

        setIsLoading(false);
        
      } catch (error) {
        console.error("Error al cargar la orden", error);
      }
    };

    fetchOrder();        

  }, [isChange, orderId]);
  return (
    !isLoading && (
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
            <button className="secondary" onClick={handlePreviousOrder}>
                <FaAngleLeft />
            </button>
            <button className="secondary" onClick={handleNextOrder}>
                <FaAngleRight />
            </button>
            <button className="primary" onClick={()=>handleGenerateOrder(orderId)}>
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
                readOnly
                type="date"
                value={orderData.orderDate?.split("T")[0]}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Shipping address</label>

                <div>
                    {isLoaded && (
                    <StandaloneSearchBox
                        onLoad={handleLoad}
                        onPlacesChanged={onPlacesChanged}
                    >
                        <input
                        type="text"
                        placeholder="Search a place"
                        className="bg-gray-200 border rounded-sm px-2 py-1 border-blue-950 w-full"
                        />
                    </StandaloneSearchBox>
                    )}
                </div>

            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Employee</label>
              <select
              type="number"
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
                value={`${orderData.latitude ? orderData.latitude : 41.8781}, ${orderData.longitude ? orderData.longitude : -87.6298}`} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Map */}

          {
          <AddressMap
            coordinates={`${orderData.latitude},${orderData.longitude}`}
            updateCoordinates={updateCoordinates}
            address={{
                street: orderData.shipAddress,
                city: orderData.shipCity,
                postalCode: orderData.shipPostalCode,
                country: orderData.shipCountry,
              }}
          />}
        </div>
      </div>
    </div>
  ));
}

export default App;
