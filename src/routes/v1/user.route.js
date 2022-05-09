const express = require('express');
const {auth,checkAdminRole} = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');



const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users
 */
router
  .route('/')
  .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
  router.get('/getUsers',[auth('manageUsers'), validate(userValidation.getUsers)], userController.getUsers)

// router.route('/:userId').delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.getUser);
router.get('/:userId', validate(userValidation.getUser), userController.getUser);

// /**
//  * @swagger
//  * /users/{userId}:
//  *   put:
//  *     security:
//  *      - bearerAuth: []
//  *     summary: Follow other User
//  *     tags: [Users]
//  *     parameters:
//  *      - in: path
//  *        name: userId
//  *        schema:
//  *          type: string
//  *        required: true
//  *        description: User Id
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - bio
//  *             properties:
//  *               bio:
//  *                 type: string
//  *               profilePic:
//  *                 type: string
//  *             example:
//  *               bio: I am cool
//  *     responses:
//  *       "201":
//  *         description: OK
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 collection:
//  *                   $ref: '#/components/schemas/User'
//  *                 tokens:
//  *                   $ref: '#/components/schemas/AuthTokens'
//  *       "401":
//  *         $ref: '#/components/responses/Unauthorized'
//  */
router.put('/:userId', [auth('manageUsers'), validate(userValidation.updateUser)], userController.updateUser);

router.post('/addCategoryTest',
[auth('manageUsers'), validate(userValidation.addCategoryVS)],
 userController.addUserCategory);
/**
 * @swagger
 * /users/followUser:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Follow other User
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otherUserId
 *             properties:
 *               otherUserId:
 *                 type: string
 *             example:
 *               otherUserId: 6131f514fbc1ece64fc4d4e4
 *     responses:
 *       "201":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 collection:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
// router.post('/followUser', [auth('manageUsers'), validate(userValidation.followUser)], userController.followUser);
/**
 * @swagger
 * /users/unfollowUser:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Follow other User
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otherUserId
 *             properties:
 *               otherUserId:
 *                 type: string
 *             example:
 *               otherUserId: 6131f514fbc1ece64fc4d4e4
 *     responses:
 *       "201":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 collection:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
// router.post('/unfollowUser', [auth('manageUsers'), validate(userValidation.unfollowUser)], userController.unfollowUser);
/**
 * @swagger
 * /users/getUserFollowers?page={page}&perPage={perPage}&userId={userId}&:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get User Followers
 *     tags: [Users]
 *     parameters:
 *      - in: path
 *        name: page
 *        schema:
 *          type: string
 *        required: true
 *        description: Page Number
 *      - in: path
 *        name: perPage
 *        schema:
 *          type: string
 *        required: true
 *        description: Number of Followers Per Page
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: User Id
 *     responses:
 *       "201":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 collection:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
// router.get('/getUserFollowers',[auth('manageUsers'), validate(userValidation.getUserFollowers)],userController.getUserFollowers);
/**
 * @swagger
 * /users/getUserFollowing?page={page}&perPage={perPage}&userId={userId}&:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get User Followers
 *     tags: [Users]
 *     parameters:
 *      - in: path
 *        name: page
 *        schema:
 *          type: string
 *        required: true
 *        description: Page Number
 *      - in: path
 *        name: perPage
 *        schema:
 *          type: string
 *        required: true
 *        description: Number of Followers Per Page
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: User Id
 *     responses:
 *       "201":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 collection:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
// router.get(
//   '/getUserFollowing',
//   [auth('manageUsers'), validate(userValidation.getUserFollowing)],
//   userController.getUserFollowing
// );



module.exports = router;
