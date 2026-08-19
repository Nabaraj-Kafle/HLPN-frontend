import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Package, Clock, Check, Truck, X } from "lucide-react";
import { storefrontApi, type Order } from "@/lib/store-api";

export function OrdersPage() {
      const [orders, setOrders] = useState<Order[]>([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
            const loadOrders = async () => {
                  try {
                        setLoading(true);
                        setError(null);
                        const ordersData = await storefrontApi.getOrders();
                        setOrders(ordersData);
                  } catch (err) {
                        const errorMsg = err instanceof Error ? err.message : "Failed to load orders";
                        setError(errorMsg);
                        console.error("Error loading orders:", err);
                  } finally {
                        setLoading(false);
                  }
            };

            void loadOrders();
      }, []);

      const getStatusIcon = (status: string) => {
            switch (status) {
                  case "pending":
                        return <Clock className="w-5 h-5 text-yellow-500" />;
                  case "processing":
                        return <Clock className="w-5 h-5 text-blue-500" />;
                  case "shipped":
                        return <Truck className="w-5 h-5 text-purple-500" />;
                  case "delivered":
                        return <Check className="w-5 h-5 text-green-500" />;
                  case "cancelled":
                        return <X className="w-5 h-5 text-red-500" />;
                  default:
                        return <Package className="w-5 h-5 text-gray-500" />;
            }
      };

      const getStatusColor = (status: string) => {
            switch (status) {
                  case "pending":
                        return "bg-yellow-50 text-yellow-700 border-yellow-200";
                  case "processing":
                        return "bg-blue-50 text-blue-700 border-blue-200";
                  case "shipped":
                        return "bg-purple-50 text-purple-700 border-purple-200";
                  case "delivered":
                        return "bg-green-50 text-green-700 border-green-200";
                  case "cancelled":
                        return "bg-red-50 text-red-700 border-red-200";
                  default:
                        return "bg-gray-50 text-gray-700 border-gray-200";
            }
      };

      if (loading) {
            return (
                  <div className="min-h-screen bg-white flex items-center justify-center">
                        <div className="text-center">
                              <div className="w-12 h-12 border-4 border-[#E5E7EB] border-t-[#16A34A] rounded-full animate-spin mx-auto mb-4" />
                              <p className="text-gray-600">Loading your orders...</p>
                        </div>
                  </div>
            );
      }

      return (
            <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
                  <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <Link to="/profile" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#16A34A] mb-8 transition-colors">
                              <ArrowLeft className="w-4 h-4" />
                              Back to Profile
                        </Link>

                        <div className="flex items-center gap-3 mb-8">
                              <div className="w-10 h-10 bg-[#F0FDF4] rounded-xl flex items-center justify-center">
                                    <Package className="w-5 h-5 text-[#16A34A]" />
                              </div>
                              <h1 className="text-3xl font-black text-gray-900">Your Orders</h1>
                        </div>

                        {error && (
                              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                    <p className="font-semibold">Error loading orders</p>
                                    <p className="text-sm">{error}</p>
                              </div>
                        )}

                        {orders.length === 0 ? (
                              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                                    <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
                                    <p className="text-gray-500 mb-6">You haven't placed any orders yet. Start shopping to see them here!</p>
                                    <Link
                                          to="/shop"
                                          className="inline-block bg-[#16A34A] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#15803D] transition-all"
                                    >
                                          Go to Shop
                                    </Link>
                              </div>
                        ) : (
                              <div className="space-y-4">
                                    {orders.map((order) => (
                                          <Link
                                                key={order.id}
                                                to={`/orders/${order.id}`}
                                                className="block bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all hover:border-[#16A34A]/20"
                                          >
                                                <div className="flex items-start justify-between mb-4">
                                                      <div>
                                                            <h3 className="text-lg font-bold text-gray-900">{order.orderNumber}</h3>
                                                            <p className="text-sm text-gray-500">
                                                                  Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                                        year: "numeric",
                                                                        month: "long",
                                                                        day: "numeric",
                                                                  })}
                                                            </p>
                                                      </div>
                                                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(order.status)} font-semibold text-sm`}>
                                                            {getStatusIcon(order.status)}
                                                            <span className="capitalize">{order.status}</span>
                                                      </div>
                                                </div>

                                                <div className="border-t border-gray-100 pt-4">
                                                      <div className="grid grid-cols-3 gap-4 mb-4">
                                                            <div>
                                                                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Items</p>
                                                                  <p className="text-lg font-bold text-gray-900">{order.items.length}</p>
                                                            </div>
                                                            <div>
                                                                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Total</p>
                                                                  <p className="text-lg font-bold text-[#16A34A]">Rs. {order.total.toFixed(2)}</p>
                                                            </div>
                                                            <div>
                                                                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Delivery</p>
                                                                  <p className="text-lg font-bold text-gray-900">
                                                                        {order.estimatedDelivery
                                                                              ? new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
                                                                                    month: "short",
                                                                                    day: "numeric",
                                                                              })
                                                                              : "N/A"}
                                                                  </p>
                                                            </div>
                                                      </div>

                                                      {/* Items Preview */}
                                                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                                            {order.items.slice(0, 3).map((item) => (
                                                                  <div key={item.id} className="shrink-0">
                                                                        <img
                                                                              src={item.productImage}
                                                                              alt={item.productName}
                                                                              className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                                                                              title={item.productName}
                                                                        />
                                                                  </div>
                                                            ))}
                                                            {order.items.length > 3 && (
                                                                  <div className="shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                                                                        <span className="text-xs font-bold text-gray-600">+{order.items.length - 3}</span>
                                                                  </div>
                                                            )}
                                                      </div>
                                                </div>
                                          </Link>
                                    ))}
                              </div>
                        )}
                  </div>
            </div>
      );
}
