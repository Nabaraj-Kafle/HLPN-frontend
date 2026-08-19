import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
      ArrowLeft, Package, Clock, Check, Truck, X, MapPin, Phone,
      Mail, DollarSign, ShoppingBag, Calendar
} from "lucide-react";
import { storefrontApi, type Order } from "@/lib/store-api";

export function OrderDetailPage() {
      const { id } = useParams();
      const [order, setOrder] = useState<Order | null>(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
            const loadOrder = async () => {
                  if (!id) {
                        setError("Order ID not found");
                        setLoading(false);
                        return;
                  }

                  try {
                        setLoading(true);
                        setError(null);
                        const orderId = Number(id);
                        const orderData = await storefrontApi.getOrderById(orderId);
                        setOrder(orderData);
                  } catch (err) {
                        const errorMsg = err instanceof Error ? err.message : "Failed to load order";
                        setError(errorMsg);
                        console.error("Error loading order:", err);
                  } finally {
                        setLoading(false);
                  }
            };

            void loadOrder();
      }, [id]);

      const getStatusIcon = (status: string) => {
            switch (status) {
                  case "pending":
                        return <Clock className="w-6 h-6 text-yellow-500" />;
                  case "processing":
                        return <Clock className="w-6 h-6 text-blue-500" />;
                  case "shipped":
                        return <Truck className="w-6 h-6 text-purple-500" />;
                  case "delivered":
                        return <Check className="w-6 h-6 text-green-500" />;
                  case "cancelled":
                        return <X className="w-6 h-6 text-red-500" />;
                  default:
                        return <Package className="w-6 h-6 text-gray-500" />;
            }
      };

      const getStatusColor = (status: string) => {
            switch (status) {
                  case "pending":
                        return "bg-yellow-50 border-yellow-200 text-yellow-700";
                  case "processing":
                        return "bg-blue-50 border-blue-200 text-blue-700";
                  case "shipped":
                        return "bg-purple-50 border-purple-200 text-purple-700";
                  case "delivered":
                        return "bg-green-50 border-green-200 text-green-700";
                  case "cancelled":
                        return "bg-red-50 border-red-200 text-red-700";
                  default:
                        return "bg-gray-50 border-gray-200 text-gray-700";
            }
      };

      if (loading) {
            return (
                  <div className="min-h-screen bg-white flex items-center justify-center">
                        <div className="text-center">
                              <div className="w-12 h-12 border-4 border-[#E5E7EB] border-t-[#16A34A] rounded-full animate-spin mx-auto mb-4" />
                              <p className="text-gray-600">Loading order details...</p>
                        </div>
                  </div>
            );
      }

      if (error || !order) {
            return (
                  <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                        <Package className="w-16 h-16 text-gray-200 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
                        <p className="text-gray-500 mb-6">{error || "This order doesn't exist."}</p>
                        <Link to="/orders" className="text-[#16A34A] font-bold">
                              Back to Orders
                        </Link>
                  </div>
            );
      }

      return (
            <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
                  <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <Link to="/orders" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#16A34A] mb-8 transition-colors">
                              <ArrowLeft className="w-4 h-4" />
                              Back to Orders
                        </Link>

                        {/* Order Header */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mb-6">
                              <div className="flex items-start justify-between mb-6">
                                    <div>
                                          <h1 className="text-3xl font-black text-gray-900 mb-1">{order.orderNumber}</h1>
                                          <p className="text-gray-500">
                                                Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                      weekday: "long",
                                                      year: "numeric",
                                                      month: "long",
                                                      day: "numeric",
                                                      hour: "2-digit",
                                                      minute: "2-digit",
                                                })}
                                          </p>
                                    </div>
                                    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border-2 ${getStatusColor(order.status)}`}>
                                          {getStatusIcon(order.status)}
                                          <span className="font-bold capitalize">{order.status}</span>
                                    </div>
                              </div>

                              {/* Timeline */}
                              <div className="flex items-center gap-2 text-sm">
                                    <div className="flex items-center gap-2">
                                          <div className="w-3 h-3 rounded-full bg-[#16A34A]" />
                                          <span className="text-gray-600">Ordered</span>
                                    </div>
                                    <div className={`flex-1 h-1 ${order.status !== "pending" ? "bg-[#16A34A]" : "bg-gray-200"}`} />
                                    <div className="flex items-center gap-2">
                                          <div className={`w-3 h-3 rounded-full ${order.status !== "pending" ? "bg-[#16A34A]" : "bg-gray-200"}`} />
                                          <span className={order.status !== "pending" ? "text-gray-900 font-semibold" : "text-gray-500"}>Processing</span>
                                    </div>
                                    <div className={`flex-1 h-1 ${["shipped", "delivered"].includes(order.status) ? "bg-[#16A34A]" : "bg-gray-200"}`} />
                                    <div className="flex items-center gap-2">
                                          <div className={`w-3 h-3 rounded-full ${["shipped", "delivered"].includes(order.status) ? "bg-[#16A34A]" : "bg-gray-200"}`} />
                                          <span className={["shipped", "delivered"].includes(order.status) ? "text-gray-900 font-semibold" : "text-gray-500"}>Shipped</span>
                                    </div>
                                    <div className={`flex-1 h-1 ${order.status === "delivered" ? "bg-[#16A34A]" : "bg-gray-200"}`} />
                                    <div className="flex items-center gap-2">
                                          <div className={`w-3 h-3 rounded-full ${order.status === "delivered" ? "bg-[#16A34A]" : "bg-gray-200"}`} />
                                          <span className={order.status === "delivered" ? "text-gray-900 font-semibold" : "text-gray-500"}>Delivered</span>
                                    </div>
                              </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              {/* Main Content */}
                              <div className="lg:col-span-2 space-y-6">
                                    {/* Order Items */}
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
                                          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                                <ShoppingBag className="w-5 h-5 text-[#16A34A]" />
                                                Order Items ({order.items.length})
                                          </h2>

                                          <div className="space-y-4">
                                                {order.items.map((item) => (
                                                      <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                                            <img
                                                                  src={item.productImage}
                                                                  alt={item.productName}
                                                                  className="w-20 h-20 rounded-lg object-cover border border-gray-100"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                  <h3 className="font-bold text-gray-900 mb-1">{item.productName}</h3>
                                                                  {item.variantName && (
                                                                        <div className="mb-2">
                                                                              <span className="inline-block bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-xs font-semibold px-2 py-0.5 rounded-md">
                                                                                    Option: {item.variantName}
                                                                              </span>
                                                                        </div>
                                                                  )}
                                                                  <p className="text-sm text-gray-500 mb-2">
                                                                        Quantity: <span className="font-semibold text-gray-900">{item.quantity}</span>
                                                                  </p>
                                                                  <p className="text-sm text-gray-500">
                                                                        Price: <span className="font-semibold text-gray-900">Rs. {item.price.toFixed(2)}</span>
                                                                  </p>
                                                            </div>
                                                            <div className="text-right">
                                                                  <p className="text-sm text-gray-500">Subtotal</p>
                                                                  <p className="text-lg font-bold text-[#16A34A]">Rs. {item.totalPrice.toFixed(2)}</p>
                                                            </div>
                                                      </div>
                                                ))}
                                          </div>
                                    </div>
                              </div>

                              {/* Sidebar */}
                              <div className="space-y-6">
                                    {/* Shipping Address */}
                                    {order.shippingAddress && (
                                          <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                      <MapPin className="w-5 h-5 text-[#16A34A]" />
                                                      Shipping Address
                                                </h3>
                                                <div className="space-y-2 text-sm">
                                                      <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
                                                      <p className="text-gray-600">{order.shippingAddress.address}</p>
                                                      {order.shippingAddress.city && (
                                                            <p className="text-gray-600">{order.shippingAddress.city}</p>
                                                      )}
                                                      {order.shippingAddress.zipCode && (
                                                            <p className="text-gray-600">{order.shippingAddress.zipCode}</p>
                                                      )}
                                                      <div className="pt-3 border-t border-gray-100 space-y-2">
                                                            <p className="flex items-center gap-2 text-gray-600">
                                                                  <Phone className="w-4 h-4" />
                                                                  {order.shippingAddress.phone}
                                                            </p>
                                                            <p className="flex items-center gap-2 text-gray-600">
                                                                  <Mail className="w-4 h-4" />
                                                                  {order.shippingAddress.email}
                                                            </p>
                                                      </div>
                                                </div>
                                          </div>
                                    )}

                                    {/* Order Summary */}
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <DollarSign className="w-5 h-5 text-[#16A34A]" />
                                                Order Summary
                                          </h3>
                                          <div className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                      <span className="text-gray-600">Subtotal</span>
                                                      <span className="font-semibold text-gray-900">Rs. {order.subtotal.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                      <span className="text-gray-600">Shipping</span>
                                                      <span className={`font-semibold ${order.shipping === 0 ? "text-[#16A34A]" : "text-gray-900"}`}>
                                                            {order.shipping === 0 ? "FREE" : `Rs. ${order.shipping.toFixed(2)}`}
                                                      </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                      <span className="text-gray-600">Tax</span>
                                                      <span className="font-semibold text-gray-900">Rs. {order.tax.toFixed(2)}</span>
                                                </div>
                                                <div className="border-t border-gray-100 pt-3 flex justify-between">
                                                      <span className="font-bold text-gray-900">Total</span>
                                                      <span className="text-xl font-black text-[#16A34A]">Rs. {order.total.toFixed(2)}</span>
                                                </div>
                                          </div>
                                    </div>

                                    {/* Estimated Delivery */}
                                    {order.estimatedDelivery && (
                                          <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-6">
                                                <h3 className="text-lg font-bold text-[#166534] mb-3 flex items-center gap-2">
                                                      <Calendar className="w-5 h-5" />
                                                      Estimated Delivery
                                                </h3>
                                                <p className="text-[#166534] font-semibold">
                                                      {new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
                                                            weekday: "long",
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                      })}
                                                </p>
                                          </div>
                                    )}
                              </div>
                        </div>
                  </div>
            </div>
      );
}
