/**
 * @swagger
 * tags:
 *   name: Kitchens
 *   description: Kitchen creation and management
 */

/**
 * @swagger
 * /api/kitchens:
 *   post:
 *     summary: Create a new kitchen
 *     description: Creates a kitchen owned by the authenticated user. Accepts an optional image upload.
 *     tags: [Kitchens]
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
 *                 example: Spice Villa
 *               description:
 *                 type: string
 *                 example: Authentic North Indian cuisine
 *               cuisine:
 *                 type: string
 *                 description: Comma-separated list or a single cuisine
 *                 example: North Indian, Mughlai
 *               street:
 *                 type: string
 *                 example: 12 MG Road
 *               city:
 *                 type: string
 *                 example: Bengaluru
 *               state:
 *                 type: string
 *                 example: Karnataka
 *               pincode:
 *                 type: string
 *                 example: "560001"
 *               deliveryTime:
 *                 type: number
 *                 example: 30
 *               deliveryCharge:
 *                 type: number
 *                 example: 40
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
 *                   example: kitche created successfuly
 *                 kitchen:
 *                   $ref: '#/components/schemas/Kitchen'
 *       400:
 *         description: Missing required fields (name, street, pincode)
 *       401:
 *         description: Token not found or authentication failed
 */

/**
 * @swagger
 * /api/kitchens/my:
 *   get:
 *     summary: Get all kitchens owned by the authenticated user
 *     tags: [Kitchens]
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
 * /api/kitchens/{kitchenId}/orders:
 *   get:
 *     summary: Get all orders for a kitchen you own
 *     tags: [Kitchens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: kitchenId
 *         required: true
 *         schema:
 *           type: string
 *         description: The kitchen ID
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
 *                   example: 3
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Token not found or authentication failed
 *       403:
 *         description: You don't own this kitchen
 *       404:
 *         description: Kitchen not found
 */
