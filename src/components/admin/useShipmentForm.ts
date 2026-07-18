import { useState, useEffect, useMemo } from 'react';
import { WorkOrder } from '@/context/AppContext';

interface UseShipmentFormProps {
  products: any[];
  workOrders: WorkOrder[];
  onSubmit: (shipment: { productID: string; workOrderID: number; quantity: number; destination: string }) => void;
}

export const useShipmentForm = ({ products, workOrders, onSubmit }: UseShipmentFormProps) => {
  // 완료된 작업 지시 필터링
  const completedOrders = useMemo(() => {
    return workOrders.filter(order => order.status === 'Completed');
  }, [workOrders]);

  const [formData, setFormData] = useState({
    workOrderID: '',
    productID: '',
    quantity: 0, 
    destination: ''
  });

  const [destQuantity, setDestQuantity] = useState<number | ''>(1);

  // 완료 지시 목록 로드 시 첫 번째 지시로 자동 초기값 설정
  useEffect(() => {
    if (completedOrders.length > 0 && !formData.workOrderID) {
      const firstOrder = completedOrders[0];
      const matchedProduct = products.find(p => p.productID === firstOrder.productID);
      const stock = matchedProduct ? matchedProduct.stockQty : 0;

      setFormData(prev => ({
        ...prev,
        workOrderID: String(firstOrder.orderID),
        productID: firstOrder.productID,
        quantity: stock
      }));
      setDestQuantity(Math.max(1, firstOrder.totalGoodQty)); // 초기 출하량은 생산 수량으로 설정
    }
  }, [completedOrders, formData.workOrderID, products]);

  // 작업 지시 변경 핸들러
  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orderId = e.target.value;
    const matchedOrder = completedOrders.find(o => String(o.orderID) === orderId);
    
    if (matchedOrder) {
      const matchedProduct = products.find(p => p.productID === matchedOrder.productID);
      const stock = matchedProduct ? matchedProduct.stockQty : 0;

      setFormData(prev => ({
        ...prev,
        workOrderID: orderId,
        productID: matchedOrder.productID,
        quantity: stock
      }));
      setDestQuantity(Math.max(1, matchedOrder.totalGoodQty)); // 출하량 기본값을 지시의 생산 수량으로 업데이트
    } else {
      setFormData(prev => ({
        ...prev,
        workOrderID: '',
        productID: '',
        quantity: 0
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

    if (qtyNum > formData.quantity) {
      alert(`창고 재고가 부족합니다. (현재 재고: ${formData.quantity} EA)`);
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
    handleQuantityChange,
    handleOrderChange,
    handleInputChange,
    handleSubmit
  };
};
