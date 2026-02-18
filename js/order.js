// Order Management Module for CoffeeNet System
class OrderManager {
    constructor() {
        this.currentOrder = this.getDraftOrder();
        this.orderSteps = [
            'انتخاب خدمت',
            'تنظیم گزینه‌ها',
            'آپلود فایل و توضیحات',
            'تایید و پرداخت'
        ];
    }

    // Get draft order from localStorage
    getDraftOrder() {
        const draft = storage.get('draft_order');
        return draft || {
            id: this.generateOrderId(),
            customer_id: null,
            items: [],
            total_amount: 0,
            status: 'draft', // draft, pending, confirmed, preparing, ready, delivered, cancelled
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            notes: '',
            attachments: []
        };
    }

    // Save draft order to localStorage
    saveDraftOrder() {
        storage.set('draft_order', this.currentOrder);
    }

    // Clear draft order
    clearDraftOrder() {
        storage.remove('draft_order');
        this.currentOrder = this.getDraftOrder();
    }

    // Generate unique order ID
    generateOrderId() {
        const timestamp = Date.now().toString();
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `ORD-${timestamp}-${randomNum}`;
    }

    // Add item to order
    addItem(serviceId, options = []) {
        const service = storage.getAllServices().find(s => s.id === serviceId);
        if (!service) return false;

        // Calculate price with options
        let itemPrice = service.price;
        if (options && options.length > 0) {
            options.forEach(opt => {
                if (opt.optionId && opt.valueIndex !== undefined) {
                    const serviceOption = service.options.find(o => o.id === opt.optionId);
                    if (serviceOption && serviceOption.prices[opt.valueIndex] !== undefined) {
                        itemPrice += serviceOption.prices[opt.valueIndex];
                    }
                }
            });
        }

        const newItem = {
            id: this.generateId(),
            service_id: serviceId,
            service_title: service.title,
            quantity: 1,
            unit_price: service.price,
            total_price: itemPrice,
            options: options,
            created_at: new Date().toISOString()
        };

        this.currentOrder.items.push(newItem);
        this.updateOrderTotal();
        this.saveDraftOrder();
        return true;
    }

    // Remove item from order
    removeItem(itemId) {
        this.currentOrder.items = this.currentOrder.items.filter(item => item.id !== itemId);
        this.updateOrderTotal();
        this.saveDraftOrder();
    }

    // Update item quantity
    updateQuantity(itemId, quantity) {
        const item = this.currentOrder.items.find(i => i.id === itemId);
        if (item && quantity > 0) {
            item.quantity = quantity;
            item.total_price = item.unit_price * quantity;
            this.updateOrderTotal();
            this.saveDraftOrder();
        }
    }

    // Update order total
    updateOrderTotal() {
        this.currentOrder.total_amount = this.currentOrder.items.reduce((total, item) => {
            return total + item.total_price;
        }, 0);
        this.currentOrder.updated_at = new Date().toISOString();
    }

    // Update order notes
    updateNotes(notes) {
        this.currentOrder.notes = notes;
        this.currentOrder.updated_at = new Date().toISOString();
        this.saveDraftOrder();
    }

    // Add attachment to order
    addAttachment(file) {
        const attachment = {
            id: this.generateId(),
            filename: file.name,
            size: file.size,
            type: file.type,
            uploaded_at: new Date().toISOString()
        };
        this.currentOrder.attachments.push(attachment);
        this.saveDraftOrder();
    }

    // Remove attachment from order
    removeAttachment(attachmentId) {
        this.currentOrder.attachments = this.currentOrder.attachments.filter(att => att.id !== attachmentId);
        this.saveDraftOrder();
    }

    // Submit order
    submitOrder(customerInfo = null) {
        if (this.currentOrder.items.length === 0) {
            return { success: false, message: 'سبد خرید شما خالی است' };
        }

        // Set customer info if provided
        if (customerInfo) {
            this.currentOrder.customer_id = customerInfo.id;
            this.currentOrder.customer_info = customerInfo;
        }

        // Finalize order
        this.currentOrder.status = 'pending';
        this.currentOrder.submitted_at = new Date().toISOString();
        this.currentOrder.updated_at = new Date().toISOString();

        // Save to orders list
        const success = storage.addOrder(this.currentOrder);

        if (success) {
            // Clear draft
            this.clearDraftOrder();
            return { success: true, order: this.currentOrder };
        } else {
            return { success: false, message: 'خطا در ثبت سفارش' };
        }
    }

    // Get order status badge HTML
    getOrderStatusBadge(status) {
        const statusConfig = {
            draft: { text: 'پیش‌نویس', class: 'bg-gray-100 text-gray-800' },
            pending: { text: 'در انتظار بررسی', class: 'bg-yellow-100 text-yellow-800' },
            confirmed: { text: 'تایید شده', class: 'bg-blue-100 text-blue-800' },
            preparing: { text: 'در حال آماده‌سازی', class: 'bg-indigo-100 text-indigo-800' },
            ready: { text: 'آماده تحویل', class: 'bg-green-100 text-green-800' },
            delivered: { text: 'تحویل داده شده', class: 'bg-purple-100 text-purple-800' },
            cancelled: { text: 'لغو شده', class: 'bg-red-100 text-red-800' }
        };

        const config = statusConfig[status] || { text: status, class: 'bg-gray-100 text-gray-800' };
        return `<span class="px-3 py-1 rounded-full text-sm font-medium ${config.class}">${config.text}</span>`;
    }

    // Get all orders for a customer
    getCustomerOrders(customerId) {
        const allOrders = storage.getAllOrders();
        return allOrders.filter(order => order.customer_id == customerId);
    }

    // Get order timeline for display
    getOrderTimeline(order) {
        const timeline = [
            { status: 'draft', label: 'ایجاد سفارش', date: order.created_at },
            { status: 'pending', label: 'ثبت سفارش', date: order.submitted_at || order.created_at }
        ];

        // Add other statuses based on order history if available
        if (order.confirmed_at) timeline.push({ status: 'confirmed', label: 'تایید سفارش', date: order.confirmed_at });
        if (order.preparing_at) timeline.push({ status: 'preparing', label: 'شروع آماده‌سازی', date: order.preparing_at });
        if (order.ready_at) timeline.push({ status: 'ready', label: 'آماده تحویل', date: order.ready_at });
        if (order.delivered_at) timeline.push({ status: 'delivered', label: 'تحویل داده شده', date: order.delivered_at });

        return timeline;
    }

    // Generate printable invoice
    generateInvoice(orderId) {
        const order = storage.getAllOrders().find(o => o.id === orderId);
        if (!order) return null;

        const invoiceHtml = `
            <!DOCTYPE html>
            <html lang="fa" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>فاکتور سفارش - ${order.id}</title>
                <style>
                    body {
                        font-family: 'Vazirmatn', sans-serif;
                        padding: 20px;
                        direction: rtl;
                    }
                    .invoice-header {
                        text-align: center;
                        border-bottom: 2px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .invoice-title {
                        font-size: 24px;
                        color: #333;
                        margin-bottom: 10px;
                    }
                    .invoice-details {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                    }
                    .order-items {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    .order-items th, .order-items td {
                        border: 1px solid #ddd;
                        padding: 10px;
                        text-align: right;
                    }
                    .order-items th {
                        background-color: #f2f2f2;
                    }
                    .total-section {
                        text-align: left;
                        margin-top: 20px;
                        padding-top: 20px;
                        border-top: 2px solid #333;
                    }
                    .signature-section {
                        margin-top: 50px;
                        text-align: left;
                    }
                </style>
            </head>
            <body>
                <div class="invoice-header">
                    <h1 class="invoice-title">فاکتور سفارش</h1>
                    <p>کافی‌نت - سامانه حرفه‌ای کافی‌شری</p>
                </div>
                
                <div class="invoice-details">
                    <div>
                        <p><strong>شماره سفارش:</strong> ${order.id}</p>
                        <p><strong>تاریخ:</strong> ${uiHelper.formatDate(order.created_at)}</p>
                    </div>
                    <div>
                        <p><strong>مشتری:</strong> ${order.customer_info?.name || 'ناشناس'}</p>
                        <p><strong>تلفن:</strong> ${order.customer_info?.phone || 'نا مشخص'}</p>
                    </div>
                </div>
                
                <table class="order-items">
                    <thead>
                        <tr>
                            <th>خدمت</th>
                            <th>تعداد</th>
                            <th>قیمت واحد</th>
                            <th>قیمت کل</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.service_title}</td>
                                <td>${item.quantity}</td>
                                <td>${uiHelper.formatCurrency(item.unit_price)}</td>
                                <td>${uiHelper.formatCurrency(item.total_price)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="total-section">
                    <p><strong>مجموع:</strong> ${uiHelper.formatCurrency(order.total_amount)}</p>
                    <p><strong>وضعیت:</strong> ${this.getOrderStatusBadge(order.status).replace('<span', '<span style="display: inline-block;"')}</p>
                </div>
                
                <div class="signature-section">
                    <p>مهر و امضا:</p>
                </div>
            </body>
            </html>
        `;

        return invoiceHtml;
    }

    // Print invoice
    printInvoice(orderId) {
        const invoiceContent = this.generateInvoice(orderId);
        if (!invoiceContent) {
            toast.error('فاکتور یافت نشد');
            return;
        }

        const printWindow = window.open('', '_blank');
        printWindow.document.write(invoiceContent);
        printWindow.document.close();
        printWindow.print();
    }

    // Generate random ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
}

// Create global instance
const orderManager = new OrderManager();