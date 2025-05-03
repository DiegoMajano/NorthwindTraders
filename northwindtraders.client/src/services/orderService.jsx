export const createOrder = async (orderData) => {
    try {
      const response = await fetch('http://localhost:5273/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) {
        throw new Error('Error al crear la orden');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  
  export const getAllOrders = async () => {
    try {
      const response = await fetch('http://localhost:5273/api/orders');
      if (!response.ok) {
        throw new Error('Error al obtener las órdenes');
      }
      const orders = await response.json();
      orders.forEach((order) => {
        order.orderDate = order.orderDate?.split("T")[0]
        order.orderDetails.forEach((detail, index) => {
            detail.id=index+1;
        }
    )}); 
      return orders;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  
  export const getOrderById = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5273/api/orders/${orderId}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Error al obtener la orden');
      }
      const order = await response.json();
        order.orderDetails.forEach((detail, index) => {
            detail.lineId=index+1;
            detail.status=1;
        });
      return order;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  
  export const updateOrder = async (orderId, orderData) => {
    try {
      const response = await fetch(`http://localhost:5273/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar la orden', response.statusText);
      }
  
      const updatedOrder = await response.json();
      return updatedOrder;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  export const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5273/api/orders/${orderId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar la orden');
      }
  
      return true;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  
  export const downloadOrderPdf = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5273/api/orders/order/${orderId}/pdf`, {
        method: 'GET',
      });
  
      console.log(response);
      
      if (!response.ok) {
        throw new Error('Error al generar el PDF de la orden');
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Order_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
  
    } catch (error) {
      console.error('Error al descargar el PDF:', error);
      throw error;
    }
  };