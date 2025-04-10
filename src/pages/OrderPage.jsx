import React, { useEffect, useState } from 'react';
import { getOrderById } from '../services/order.api';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Loader,
  Truck,
  PackageCheck,
  Ban,
  CheckCircle
} from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'text-yellow-500' },
  processing: { label: 'Processing', icon: Loader, color: 'text-blue-500' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-indigo-500' },
  delivered: { label: 'Delivered', icon: PackageCheck, color: 'text-green-600' },
  cancelled: { label: 'Cancelled', icon: Ban, color: 'text-red-500' }
};

const OrderPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusKey, setStatusKey] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
        setStatusKey(data.status + "-" + new Date(data.updatedAt).getTime());
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

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (!order) return <div className="text-center p-6">Order not found</div>;

  const { status } = order;
  const { icon: StatusIcon, color, label } = statusConfig[status];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Order <span className="text-gray-500">#{order?._id}</span></h1>

      {/* Status Display with Icon and Animation */}
      <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={statusKey}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-4"
          >
            <StatusIcon size={32} className={`${color} transition-all`} />
            <span className="text-lg font-medium">{label}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Status History */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-xl font-semibold mb-3">Status History</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {order?.statusHistory?.map((entry, idx) => {
            const Icon = statusConfig[entry.status]?.icon || CheckCircle;
            const color = statusConfig[entry.status]?.color || 'text-gray-500';
            return (
              <li key={idx} className="flex items-center gap-3">
                <Icon size={20} className={color} />
                <span className="capitalize">{entry.status}</span>
                <span className="ml-auto text-gray-500">{new Date(entry.changedAt).toLocaleString()}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default OrderPage;
