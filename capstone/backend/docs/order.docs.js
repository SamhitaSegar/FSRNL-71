/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order placement, payment and management
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place a new order
 *     description: >
 *       Places an order for items from a single kitchen. Prices and totals are
 *       computed on the server from the menu. For `online`/`upi` payment
 *       methods a Razorpay order is created and returned for the client to pay.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [kitchenId, items, deliveryAddress]
 *             properties:
 *               kitchenId:
 *                 type: string
 *                 example: 652f1c9e8a1b2c3d4e5f6789
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [menuItem, quantity]
 *                   properties:
 *                     menuItem:
 *                       type: string
 *                       example: 652f1d128a1b2c3d4e5f6790
 *                     quantity:
 *                       type: number
 *                       minimum: 1
 *                       example: 2
 *               deliveryAddress:
 *                 type: object
 *                 required: [street, city, state, pincode, phone]
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: 12 MG Road
 *                   city:
 *                     type: string
 *                     example: Bengaluru
 *                   state:
 *                     type: string
 *                     example: Karnataka
 *                   pincode:
 *                     type: string
 *                     example: "560001"
 *                   phone:
 *                     type: string
 *                     example: "9876543210"
 *               paymentMethod:
 *                 type: string
 *                 enum: [cod, online, upi]
 *                 default: cod
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: order placed successfuly
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *                 razorpayOrder:
 *                   type: object
 *                   nullable: true
 *                   description: Present only for online/upi payments
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: order_NabcXyz123
 *                     amount:
 *                       type: number
 *                       example: 57800
 *                     currency:
 *                       type: string
 *                       example: INR
 *       400:
 *         description: Validation error, closed kitchen, or unavailable item
 *       401:
 *         description: Token not found or authentication failed
 *       404:
 *         description: Kitchen or menu item not found
 */

/**
 * @swagger
 * /api/orders/verify-payment:
 *   post:
 *     summary: Verify a Razorpay payment
 *     description: >
 *       Verifies the Razorpay payment signature for an order. On success the
 *       order's payment status becomes `paid` and order status becomes
 *       `confirmed`.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature]
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: 652f1e558a1b2c3d4e5f6791
 *               razorpay_order_id:
 *                 type: string
 *                 example: order_NabcXyz123
 *               razorpay_payment_id:
 *                 type: string
 *                 example: pay_NdefUvw456
 *               razorpay_signature:
 *                 type: string
 *                 example: 9f8e7d6c5b4a...
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: payment verified successfuly
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Missing fields or invalid payment signature
 *       401:
 *         description: Token not found or authentication failed
 *       403:
 *         description: This is not your order
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/orders/my:
 *   get:
 *     summary: Get the authenticated user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of the user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *                   example: 5
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Token not found or authentication failed
 */

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Get a single order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     responses:
 *       200:
 *         description: The order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Token not found or authentication failed
 *       403:
 *         description: This is not your order
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/orders/{orderId}/cancel:
 *   patch:
 *     summary: Cancel an order
 *     description: >
 *       Cancels an order that has not yet reached `out_for_delivery`. If the
 *       order was already paid, its payment status is set to `refunded`.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cancelReason:
 *                 type: string
 *                 example: Ordered by mistake
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: order cancelled successfuly
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Order already cancelled or can no longer be cancelled
 *       401:
 *         description: Token not found or authentication failed
 *       403:
 *         description: This is not your order
 *       404:
 *         description: Order not found
 */
