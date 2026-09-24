/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: Menu item management
 */

/**
 * @swagger
 * /api/menu/{kitchenId}:
 *   post:
 *     summary: Add a menu item to a kitchen you own
 *     description: Creates a menu item under the given kitchen. Accepts an optional image upload.
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: kitchenId
 *         required: true
 *         schema:
 *           type: string
 *         description: The kitchen ID the item belongs to
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
 *                 example: Paneer Butter Masala
 *               description:
 *                 type: string
 *                 example: Cottage cheese in a rich tomato gravy
 *               price:
 *                 type: number
 *                 example: 249
 *               category:
 *                 type: string
 *                 enum: [veg, non-veg, egg, vegan]
 *                 example: veg
 *               foodType:
 *                 type: string
 *                 enum: [starter, main-course, dessert, beverage, snack, thali]
 *                 example: main-course
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
 *                   example: menu item added successfuly
 *                 menuItem:
 *                   $ref: '#/components/schemas/MenuItem'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Token not found or authentication failed
 *       403:
 *         description: You don't own this kitchen
 *       404:
 *         description: Kitchen not found
 */

/**
 * @swagger
 * /api/menu/{menuId}:
 *   put:
 *     summary: Update a menu item
 *     description: >
 *       Updates fields on a menu item. Ownership of the parent kitchen is
 *       verified. Accepts an optional replacement image.
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: string
 *         description: The menu item ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Paneer Tikka Masala
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 example: 279
 *               category:
 *                 type: string
 *                 enum: [veg, non-veg, egg, vegan]
 *               foodType:
 *                 type: string
 *                 enum: [starter, main-course, dessert, beverage, snack, thali]
 *               isAvailable:
 *                 type: boolean
 *                 example: true
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
 *                   example: menu item updated successfuly
 *                 menuItem:
 *                   $ref: '#/components/schemas/MenuItem'
 *       400:
 *         description: No fields provided to update
 *       401:
 *         description: Token not found or authentication failed
 *       403:
 *         description: You don't own this kitchen
 *       404:
 *         description: Menu item or kitchen not found
 *   delete:
 *     summary: Delete a menu item
 *     description: Deletes a menu item and its image. Ownership of the parent kitchen is verified.
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: string
 *         description: The menu item ID
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
 *                   example: menu item deleted successfuly
 *       401:
 *         description: Token not found or authentication failed
 *       403:
 *         description: You don't own this kitchen
 *       404:
 *         description: Menu item or kitchen not found
 */
