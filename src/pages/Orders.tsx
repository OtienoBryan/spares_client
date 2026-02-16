import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import Navigation from '@/components/Navigation';
import { 
  Package, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  RefreshCw,
  Calendar,
  MapPin,
  CreditCard,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';
import { LoadingWave } from '@/components/ui/lottie-loader';
import { apiService, OrderResponse } from '@/services/api';

const Orders = () => {
  const { user, isAuthenticated } = useUser();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userOrders = await apiService.getMyOrders(user!.id);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'preparing':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderStats = () => {
    const total = orders.length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const pending = orders.filter(o => ['pending', 'confirmed', 'preparing', 'shipped'].includes(o.status)).length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

    return { total, delivered, pending, cancelled, totalSpent };
  };

  const stats = getOrderStats();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-wine mb-4">Please log in</h1>
            <p className="text-muted-foreground">You need to be logged in to view your orders.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <LoadingWave />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-wine mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your drink orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold text-wine">{stats.total}</p>
                </div>
                <Package className="h-8 w-8 text-wine/60" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600/60" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600/60" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold text-wine">${stats.totalSpent.toFixed(2)}</p>
                </div>
                <CreditCard className="h-8 w-8 text-wine/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search orders by number or product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={fetchOrders}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No orders found' : 'No orders yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start shopping to see your orders here'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button className="bg-wine hover:bg-wine-light text-white">
                  Start Shopping
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">Order #{order.orderNumber}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        </Badge>
                        <Badge variant="outline" className={getPaymentStatusColor(order.paymentStatus)}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Placed on {formatDate(order.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{order.shippingAddress}</span>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="h-4 w-4" />
                          <span className="text-sm font-medium">Items ({order.items.length})</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {order.items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                              <span className="text-sm font-medium">{item.product.name}</span>
                              <span className="text-xs text-muted-foreground">x{item.quantity}</span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="bg-muted/50 rounded-lg px-3 py-2">
                              <span className="text-sm text-muted-foreground">
                                +{order.items.length - 3} more
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="flex flex-col lg:items-end gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-wine">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Order #{order.orderNumber}
                              </DialogTitle>
                            </DialogHeader>
                            
                            {selectedOrder && (
                              <div className="space-y-6">
                                {/* Order Status */}
                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <Badge className={getStatusColor(selectedOrder.status)}>
                                      <div className="flex items-center gap-1">
                                        {getStatusIcon(selectedOrder.status)}
                                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                      </div>
                                    </Badge>
                                    <Badge variant="outline" className={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                                      {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                                    </Badge>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-wine">${selectedOrder.total.toFixed(2)}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Placed on {formatDate(selectedOrder.createdAt)}
                                    </p>
                                  </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                  <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                                  <div className="space-y-3">
                                    {selectedOrder.items.map((item) => (
                                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                        <img
                                          src={item.product.image}
                                          alt={item.product.name}
                                          className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                          <h4 className="font-medium">{item.product.name}</h4>
                                          <p className="text-sm text-muted-foreground">
                                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-semibold">${item.total.toFixed(2)}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Order Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                      <p className="text-sm">{selectedOrder.shippingAddress}</p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>${selectedOrder.subtotal.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Tax:</span>
                                        <span>${selectedOrder.tax.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Shipping:</span>
                                        <span>${selectedOrder.shipping.toFixed(2)}</span>
                                      </div>
                                      <Separator />
                                      <div className="flex justify-between font-semibold">
                                        <span>Total:</span>
                                        <span>${selectedOrder.total.toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4 border-t">
                                  <Button variant="outline" className="flex-1">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Contact Support
                                  </Button>
                                  <Button variant="outline" className="flex-1">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Receipt
                                  </Button>
                                  {selectedOrder.status === 'delivered' && (
                                    <Button className="flex-1 bg-wine hover:bg-wine-light text-white">
                                      <Star className="h-4 w-4 mr-2" />
                                      Rate Order
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {order.status === 'delivered' && (
                          <Button variant="outline" size="sm">
                            <Star className="h-4 w-4 mr-2" />
                            Rate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
