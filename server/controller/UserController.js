import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import db from '../models';
import UserHelper from '../ControllerHelper /UserHelper';
import DocumentHelper from '../ControllerHelper /DocumentHelper';
import Helpers from '../Helper/utility';

dotenv.config();

const secretKey = process.env.SECRET;

const UserController = {
/**
   * Login a user
   *
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  login(req, res) {
    const query = {
      where: { email: req.body.email }
    };
    db.Users.findOne(query)
      .then((user) => {
        if (user && user.ValidatePassword(req.body.password)) {
          const token = jwt.sign({ userId: user.id,
            roleId: user.roleId,
            username: user.userName,
            email: user.email },
          secretKey, { expiresIn: '1 day' });
          return res.status(200).send({
            message: 'Login succesful',
            token,
            userId: user.id,
            roleId: user.roleId,
            username: user.userName,
            email: user.email,
            expiresIn: '1 day',
          });
        }
        return res.status(401)
            .send({ message: 'Please enter a valid email and password to login!'
            });
      });
  },
  /**
   * Logout a user
   * Route: POST: /users/logout
   *
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */

  logout(req, res) {
    res.setHeader.Authorization = '';
    res.status(200)
      .send({ message: 'You have Successfully logged out!' });
  },

 /**
    * Get all users
    * Route: GET: /users
    *
    * @param {Object} req request object
    * @param {Object} res response object
    * @returns {void} no returns
    */
  listAllUsers(req, res) {
    db.Users
      .findAndCountAll(req.dmsFilter)
      .then((users) => {
        if (users) {
          const condition = {
            count: users.count,
            limit: req.dmsFilter.limit,
            offset: req.dmsFilter.offset
          };
          delete users.count;
          const pagination = Helpers.pagination(condition);
          res.status(200)
            .send({
              message: 'You have successfully retrived all users',
              users,
              pagination
            });
        }
      });
  },

  /**
    * Get user by id
    * Route: get: /users/:id
    *
    * @param {Object} req request object
    * @param {Object} res response object
    * @returns {response} response object
    */
  FindUserById(req, res) {
    return res.status(200)
      .send({
        message: 'You have successfully retrived this user',
        user: UserHelper.getUserProfile(req.getUser)
      });
  },

  /** update
   * updates a user
   *
   * @param {Object} req object
   * @param {Object} res object
   * @returns {response} - returns object
   */
  UpdateUser(req, res) {
    const errorArray = [];
    req.userInstance.update(req.body)
      .then(updatedUser =>
        res.status(200)
          .send({
            message: 'Your profile has been updated',
            updatedUser
          }))
      .catch((err) => {
        if (err.errors) {
          err.errors.forEach((error) => {
            errorArray.push({ path: error.path, message: error.message });
          });
        }
        return res.status(400)
          .send({
            errorArray
          });
      });
  },

  /**
   * deletes a user
   * Route: DELETE: /users/:id
   *
   * @param {Object} req object
   * @param {Object} res object
   * @returns {response} - returns object
   */
  DeleteUser(req, res) {
    req.userInstance.destroy()
      .then(() => {
        res.status(200)
          .send({
            message: 'This account has been successfully deleted'
          });
      })
      .catch(err => res.status(500).send(err.errors));
  },

  /**
    * Search users
    * Route: GET: /users/search?query={}
    *
    * @param {Object} req request object
    * @param {Object} res response object
    * @returns {void|Response} response object or void
    */
  searchUser(req, res) {
    const request = req.dmsFilter;
    let condition = {};
    let pagination;
    request.attributes = UserHelper.getUserAttribute();
    db.Users.findAndCountAll(request)
      .then((users) => {
        condition = {
          count: users.count,
          limit: request.limit,
          offset: request.offset
        };
        delete users.count;
        pagination = Helpers.pagination(condition);
        res.status(200)
          .send({
            message: 'Your search was successful',
            users,
            pagination
          });
      });
  },

  /**
    * Get all document by a user
    * Route: GET: /users/:id/documents
    *
    * @param {Object} req request object
    * @param {Object} res response object
    * @returns {void} no returns
    */
  findUserDocuments(req, res) {
    const userDocuments = {};
    db.Users.findById(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404)
            .send({
              message: 'This user does not exist'
            });
        }
        userDocuments.user = UserHelper.getUserProfile(user);
        req.dmsFilter.where.authorId = req.params.id;
        req.dmsFilter.attributes = DocumentHelper.getDocumentAttribute();
        db.Documents.findAndCountAll(req.dmsFilter)
          .then((documents) => {
            const condition = {
              count: documents.count,
              limit: req.dmsFilter.limit,
              offset: req.dmsFilter.offset
            };
            delete documents.count;
            const pagination = Helpers.pagination(condition);
            return res.status(200)
              .send({
                message: 'This user\'s documents was successfully retrieved',
                userDocuments,
                documents,
                pagination
              });
          });
      });
  },

  /**
   * Create a user
   * Route: POST: /users/
   *
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  createUser(req, res) {
    db.Users
      .create(req.userInput)
      .then((user) => {
        const token = jwt.sign({ userId: user.id,
          roleId: user.roleId,
          username: user.userName,
          email: user.email },
          secretKey, { expiresIn: '1 day' });
        user = UserHelper.userProfile(user);
        return res.status(201)
          .send({
            message: 'Your account has been created successfully',
            token,
            user
          });
      })
      .catch(error =>
        res.status(400)
          .send({
            errorArray: Helpers.errorArray(error)
          }));
  },
};

export default UserController;
