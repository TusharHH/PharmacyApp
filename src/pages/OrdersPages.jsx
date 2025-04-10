import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById } from '../services/order.api';

import {
  Clock,
  Settings,
  Truck,
  PackageCheck,
  Ban,
} from 'lucide-react';

const statusSteps = [
  { value: 'pending', label: 'Pending', icon: Clock },
  { value: 'processing', label: 'Processing', icon: Settings },
  { value: 'shipped', label: 'Shipped', icon: Truck },
  { value: 'delivered', label: 'Delivered', icon: PackageCheck },
  { value: 'cancelled', label: 'Cancelled', icon: Ban },
];

const OrderPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();

    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!order) return <div className="text-center mt-10">Order not found</div>;

  const currentStatusIndex = statusSteps.findIndex(s => s.value === order.status);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Order #{order._id}</h1>

      {/* Progress Line */}
      <div className="relative mb-10">
        <div className="absolute top-6 left-0 w-full h-1 bg-gray-300 z-0 rounded-md" />
        <div
          className="absolute top-6 left-0 h-1 bg-green-500 z-10 rounded-md transition-all duration-700 ease-in-out"
          style={{
            width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        <div className="flex justify-between relative z-20">
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentStatusIndex;
            const isCancelled = order.status === 'cancelled';

            return (
              <div key={step.value} className="flex flex-col items-center w-full">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500
                    ${isCancelled && step.value === 'cancelled'
                      ? 'bg-red-500 text-white border-red-500'
                      : isActive
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white text-gray-400 border-gray-300'}
                  `}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    isCancelled && step.value === 'cancelled'
                      ? 'text-red-600'
                      : isActive
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status History */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Status History</h2>
        <ul className="list-disc pl-6 text-gray-700">
          {order.statusHistory.map((s, idx) => (
            <li key={idx}>
              <strong>{s.status}</strong> — {new Date(s.changedAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderPage;
