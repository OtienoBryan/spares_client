import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';


import { 
  Package, 
  Search, 
  Eye, 
  RefreshCw,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  ShoppingCart
} from 'lucide-react';
import { LoadingWave } from '@/components/ui/lottie-loader';
import { apiService, OrderResponse } from '@/services/api';
import { formatPrice } from '@/data/products';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

const Orders = () => {
  const { user, isAuthenticated } = useUser();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  const filterOrders = useCallback(() => {
    if (!orders || orders.length === 0) {
      setFilteredOrders([]);
      return;
    }

    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate >= start;
      });
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate <= end;
      });
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, startDate, endDate]);

  useEffect(() => {
    filterOrders();
    setCurrentPage(1);
  }, [filterOrders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userOrders = await apiService.getMyOrders(Number(user!.id));
      setOrders(userOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil((filteredOrders?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = (filteredOrders || []).slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'preparing':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'confirmed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-3 w-3" />;
      case 'shipped':
        return <Package className="h-3 w-3" />;
      case 'preparing':
      case 'confirmed':
        return <Clock className="h-3 w-3" />;
      case 'cancelled':
        return <XCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getOrderStats = () => {
    const total = orders.length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const pending = orders.filter(o => ['pending', 'confirmed', 'preparing', 'shipped'].includes(o.status)).length;
    const totalSpent = orders.reduce((sum, order) => sum + (typeof order.total === 'number' ? order.total : parseFloat(order.total) || 0), 0);
    return { total, delivered, pending, totalSpent };
  };

  const stats = getOrderStats();

  if (!isAuthenticated || !user) {
    return (
      <>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-xl font-bold text-primary mb-2">Please log in</h1>
            <p className="text-sm text-muted-foreground">You need to be logged in to view your orders.</p>
          </div>
        </div>
        </>
  );
  }

  if (loading) {
    return (
      <>
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <LoadingWave />
          </div>
        </div>
        </>
  );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Simple Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-primary mb-1">My Orders</h1>
          <p className="text-xs text-muted-foreground">{stats.total} {stats.total === 1 ? 'order' : 'orders'} total</p>
        </div>

        {/* Simple Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 text-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 h-9 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full sm:w-36 h-9 text-sm"
            placeholder="Start date"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full sm:w-36 h-9 text-sm"
            min={startDate}
            placeholder="End date"
          />
          {(startDate || endDate) && (
            <Button variant="outline" size="sm" onClick={() => { setStartDate(''); setEndDate(''); }} className="h-9 text-xs">
              Clear
            </Button>
          )}
        </div>

        {/* Orders List - Simplified */}
        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <LoadingWave />
            </CardContent>
          </Card>
        ) : filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-base font-semibold mb-1">
                {orders.length === 0 
                  ? 'No orders yet'
                  : searchTerm || statusFilter !== 'all' || startDate || endDate
                    ? 'No orders found'
                    : 'No orders yet'
                }
              </h3>
              <p className="text-xs text-muted-foreground">
                {orders.length === 0
                  ? 'Start shopping to see your orders here'
                  : searchTerm || statusFilter !== 'all' || startDate || endDate
                    ? 'Try adjusting your filters'
                    : 'Start shopping to see your orders here'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-sm transition-shadow border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: Order Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-primary">#{order.orderNumber}</span>
                          <Badge className={`${getStatusColor(order.status)} text-xs px-2 py-0.5 border`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                            </div>
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                          </div>
                        </div>

                        {/* Product Preview */}
                        <div className="flex items-center gap-2 mt-2">
                          {order.items.slice(0, 2).map((item) => (
                            <div key={item.id} className="flex items-center gap-1.5 bg-muted/30 rounded px-2 py-1">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-5 h-5 object-cover rounded"
                              />
                              <span className="text-xs truncate max-w-[120px]">{item.product.name}</span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <span className="text-xs text-muted-foreground">+{order.items.length - 2} more</span>
                          )}
                        </div>
                      </div>

                      {/* Right: Price & Action */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <p className="text-base font-bold text-primary">{formatPrice(typeof order.total === 'number' ? order.total : parseFloat(order.total) || 0)}</p>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                              className="h-8 text-xs"
                            >
                              View
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-base">Order #{order.orderNumber}</DialogTitle>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                                {/* Status */}
                                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                  <Badge className={getStatusColor(order.status)}>
                                    <div className="flex items-center gap-1">
                                      {getStatusIcon(order.status)}
                                      <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                                    </div>
                                  </Badge>
                                  <p className="text-base font-bold text-primary">
                                    {formatPrice(typeof order.total === 'number' ? order.total : parseFloat(order.total) || 0)}
                                  </p>
                                </div>

                                {/* Items */}
                                <div>
                                  <h3 className="text-sm font-semibold mb-2">Items</h3>
                                  <div className="space-y-2">
                                    {order.items.map((item) => (
                                      <div key={item.id} className="flex items-center gap-3 p-2 border rounded">
                                        <img
                                          src={item.product.image}
                                          alt={item.product.name}
                                          className="w-10 h-10 object-cover rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium truncate">{item.product.name}</p>
                                          <p className="text-xs text-muted-foreground">
                                            {item.quantity} � {formatPrice(typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0)}
                                          </p>
                                        </div>
                                        <p className="text-sm font-semibold">
                                          {formatPrice(typeof item.total === 'number' ? item.total : parseFloat(item.total) || 0)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Summary */}
                                <div className="space-y-2 text-sm border-t pt-3">
                                  <div className="flex justify-between text-xs">
                                    <span>Subtotal:</span>
                                    <span>{formatPrice(typeof order.subtotal === 'number' ? order.subtotal : parseFloat(order.subtotal) || 0)}</span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span>Tax:</span>
                                    <span>{formatPrice(typeof order.tax === 'number' ? order.tax : parseFloat(order.tax) || 0)}</span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span>Shipping:</span>
                                    <span>{formatPrice(typeof order.shipping === 'number' ? order.shipping : parseFloat(order.shipping) || 0)}</span>
                                  </div>
                                  <Separator />
                                  <div className="flex justify-between font-semibold">
                                    <span>Total:</span>
                                    <span>{formatPrice(typeof order.total === 'number' ? order.total : parseFloat(order.total) || 0)}</span>
                                  </div>
                                </div>

                                {/* Address */}
                                <div className="pt-2 border-t">
                                  <div className="flex items-start gap-2 text-xs">
                                    <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground" />
                                    <div>
                                      <p className="font-medium mb-1">Shipping Address</p>
                                      <p className="text-muted-foreground">{order.shippingAddress}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Reorder Button */}
                                <div className="pt-3 border-t">
                                  <Button
                                    onClick={() => {
                                      // Add all items from the order to cart
                                      let itemsAdded = 0;
                                      order.items.forEach((item) => {
                                        // Add each item with its original quantity
                                        for (let i = 0; i < item.quantity; i++) {
                                          // Check if item has SKU information stored
                                          const skuCode = (item as any).skuCode || (item.product as any).skus?.[0]?.code || null;
                                          addToCart(item.product, skuCode);
                                          itemsAdded++;
                                        }
                                      });
                                      
                                      toast({
                                        title: "Items added to cart",
                                        description: `${itemsAdded} ${itemsAdded === 1 ? 'item' : 'items'} from order #${order.orderNumber} added to your cart.`,
                                      });
                                      
                                      // Navigate to cart page after a short delay
                                      setTimeout(() => {
                                        navigate('/cart');
                                      }, 500);
                                    }}
                                    className="w-full bg-primary hover:bg-primary-light text-white"
                                    size="sm"
                                  >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Reorder Items
                                  </Button>
                                </div>
                              </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                
                <div className="text-center mt-3 text-xs text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      </>
  );
};

export default Orders;
