/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & user profile
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: secret123
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messsage:
 *                   type: string
 *                   example: user created successfuly
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["please provide a valid email"]
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in an existing user
 *     description: >
 *       Authenticates a user and returns a JWT. The token is also set as an
 *       httpOnly cookie named `token`. Rate limited to 5 attempts per 15 minutes.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login Successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation error
 *       403:
 *         description: Invalid password
 *       404:
 *         description: User does not exist
 *       429:
 *         description: Too many login attempts
 */

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: user fetched successfuly
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token not found or authentication failed
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/auth/update:
 *   put:
 *     summary: Update the authenticated user's profile
 *     description: >
 *       Updates one or more of username, email, or password. At least one
 *       field must be provided.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe_new
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.new@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: newsecret123
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: profle updated successfuly
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: No fields provided to update
 *       401:
 *         description: Token not found or authentication failed
 *       404:
 *         description: User not found
 */
