import { useState, useEffect, useMemo } from 'react';
import { WorkOrder } from '@/context/AppContext';

interface UseShipmentFormProps {
  products: any[];
  workOrders: WorkOrder[];
  onSubmit: (shipment: { productID: string; workOrderID: number; quantity: number; destination: string }) => void;
}

export const useShipmentForm = ({ products, workOrders, onSubmit }: UseShipmentFormProps) => {
  const completedOrders = useMemo(() => {
    return workOrders.filter(order => order.status === 'Completed');
  }, [workOrders]);

  const [formData, setFormData] = useState({
    workOrderID: '',
    productID: '',
    destination: ''
  });

  const [destQuantity, setDestQuantity] = useState<number | ''>(1);

  const selectedProductStock = useMemo(() => {
    if (!formData.productID) return 0;
    const found = products.find(p => p.productID === formData.productID);
    return found ? found.stockQty : 0;
  }, [formData.productID, products]);

  useEffect(() => {
    if (completedOrders.length > 0 && !formData.workOrderID) {
      const firstOrder = completedOrders[0];
      setFormData(prev => ({
        ...prev,
        workOrderID: String(firstOrder.orderID),
        productID: firstOrder.productID
      }));
      setDestQuantity(Math.max(1, firstOrder.totalGoodQty));
    }
  }, [completedOrders, formData.workOrderID]);

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orderId = e.target.value;
    const matchedOrder = completedOrders.find(o => String(o.orderID) === orderId);
    
    if (matchedOrder) {
      setFormData(prev => ({
        ...prev,
        workOrderID: orderId,
        productID: matchedOrder.productID
      }));
      setDestQuantity(Math.max(1, matchedOrder.totalGoodQty));
    } else {
      setFormData(prev => ({
        ...prev,
        workOrderID: '',
        productID: ''
      }));
      setDestQuantity(1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setDestQuantity('');
    } else {
      setDestQuantity(Number(val));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderIdNum = Number(formData.workOrderID);
    const qtyNum = destQuantity === '' ? 0 : Number(destQuantity);

    if (!formData.workOrderID || !formData.productID) {
      alert('출하 연계할 완료 지시를 선택해주세요.');
      return;
    }
    if (qtyNum <= 0) {
      alert('출하 수량은 1개 이상이어야 합니다.');
      return;
    }

    const matchedOrder = completedOrders.find(o => o.orderID === orderIdNum);
    if (matchedOrder && qtyNum > matchedOrder.totalGoodQty) {
      alert(`출하 수량이 생산 수량을 초과합니다. (생산 수량: ${matchedOrder.totalGoodQty} EA)`);
      return;
    }

    if (qtyNum > selectedProductStock) {
      alert(`창고 재고가 부족합니다. (현재 재고: ${selectedProductStock} EA)`);
      return;
    }

    if (!formData.destination.trim()) {
      alert('출하 목적지(고객사명)를 입력해주세요.');
      return;
    }

    onSubmit({
      productID: formData.productID,
      workOrderID: orderIdNum,
      quantity: qtyNum,
      destination: formData.destination.trim()
    });

    setFormData(prev => ({
      ...prev,
      destination: ''
    }));
  };

  return {
    completedOrders,
    formData,
    destQuantity,
    selectedProductStock,
    handleQuantityChange,
    handleOrderChange,
    handleInputChange,
    handleSubmit
  };
};
