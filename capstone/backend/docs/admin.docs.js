/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: >
 *     Admin-prefixed aliases for kitchen and menu management. These mount the
 *     same handlers as `/api/kitchens` and `/api/menu` under `/api/admin`.
 *     Authentication and kitchen-ownership checks still apply.
 */

/**
 * @swagger
 * /api/admin/kitchens:
 *   post:
 *     summary: Create a new kitchen (admin alias)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, street, pincode]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               cuisine:
 *                 type: string
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               pincode:
 *                 type: string
 *               deliveryTime:
 *                 type: number
 *               deliveryCharge:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Kitchen created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 kitchen:
 *                   $ref: '#/components/schemas/Kitchen'
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Token not found or authentication failed
 */

/**
 * @swagger
 * /api/admin/kitchens/my:
 *   get:
 *     summary: Get all kitchens owned by the authenticated user (admin alias)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of the user's kitchens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 kitchens:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Kitchen'
 *       401:
 *         description: Token not found or authentication failed
 */

/**
 * @swagger
 * /api/admin/kitchens/{kitchenId}/orders:
 *   get:
 *     summary: Get all orders for a kitchen you own (admin alias)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: kitchenId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of orders for the kitchen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       403:
 *         description: You don't own this kitchen
 *       404:
 *         description: Kitchen not found
 */

/**
 * @swagger
 * /api/admin/menu/{kitchenId}:
 *   post:
 *     summary: Add a menu item to a kitchen you own (admin alias)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: kitchenId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, price, category, foodType]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *                 enum: [veg, non-veg, egg, vegan]
 *               foodType:
 *                 type: string
 *                 enum: [starter, main-course, dessert, beverage, snack, thali]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Menu item added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 menuItem:
 *                   $ref: '#/components/schemas/MenuItem'
 *       400:
 *         description: Validation error
 *       403:
 *         description: You don't own this kitchen
 *       404:
 *         description: Kitchen not found
 */

/**
 * @swagger
 * /api/admin/menu/{menuId}:
 *   put:
 *     summary: Update a menu item (admin alias)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *                 enum: [veg, non-veg, egg, vegan]
 *               foodType:
 *                 type: string
 *                 enum: [starter, main-course, dessert, beverage, snack, thali]
 *               isAvailable:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 menuItem:
 *                   $ref: '#/components/schemas/MenuItem'
 *       400:
 *         description: No fields provided to update
 *       403:
 *         description: You don't own this kitchen
 *       404:
 *         description: Menu item or kitchen not found
 *   delete:
 *     summary: Delete a menu item (admin alias)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: You don't own this kitchen
 *       404:
 *         description: Menu item or kitchen not found
 */
