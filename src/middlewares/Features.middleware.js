import mongoose from "mongoose";
import { AppError, CatchAsyncErrors } from "../services/ErrorHandler.service.js";




/**
 * Filter Middleware
 *
 * This middleware is used to filter the query based on the provided arguments.
 *
 * @param {string} forWho - The type of filtering to be done. If it is "user", it filters the query based on the currently logged in user.
 * @param {{fieldName:string,paramName:string}} - An object containing two properties: fieldName and paramName. The fieldName is the name of the field in the document that needs to be filtered, and the paramName is the name of the parameter in the request that contains the value of the field to be filtered.
 * @returns {import('express').RequestHandler} - An express middleware function
 * @throws {AppError} - 400 Bad Request with the respective error message
 */
const filterMiddleware = (forWho,{ fieldName, paramName }={}) =>
  CatchAsyncErrors(async (req, res, next) => {
    if(forWho=="user"){
      const user = req.user;
      if(!user) throw new AppError("You are not logged in",401);
      req.dbQuery = req.dbQuery.where({ "_id": user.id });
      next();
    }
    else{
      if(fieldName && paramName){
        console.log(req.params[paramName],fieldName);

        req.dbQuery = req.dbQuery.where({ [fieldName]: req.params[paramName] });
        next();
      }
      else{
        throw new AppError("Please provide a field name and a param name",400);
      }
    }
});



/**
 * Select Middleware
 *
 * This middleware is used to select only the specified fields of the document from the database.
 * It looks for a query parameter named "select" and if it is present, it sets the select option of the
 * Mongoose query based on the value of the parameter.
 *
 * @example
 * Suppose we have a collection of documents with the following fields:
 * {
 *   _id: ObjectId,
 *   name: String,
 *   age: Number
 * }
 *
 * To select only the name and age fields, we can add the following query parameter to the request:
 * ?select=name,age
 *
 * The middleware will then select only the name and age fields from the database.
 */
const selectMiddleware = () => {
  return (req, res, next) => {
     if(req.query.select){
      req.dbQuery = req.dbQuery.select(req.query.select);
    }
    next();
  };
};


/**
 * Middleware to handle pagination of database query results.
 *
 * @param {number} limit - The default limit of documents per page if not specified in the query.
 * @returns {Function} - An Express middleware function that calculates pagination details.
 *
 * This middleware calculates pagination details based on the `page` and `limit` parameters
 * from the request query. It adjusts the query to skip and limit results and attaches
 * pagination metadata to the response object, including current page, next page, previous page,
 * total number of documents, and total number of pages.
 *
 * The `req.dbQuery` is expected to be a Mongoose query object with model and filter applied.
 * It uses the model to count total documents matching the filter.
 *
 * Pagination details are stored in `res.pagination` and passed to the next middleware.
 */
const paginationMiddleware = (limit) => {
  return (req, res, next) => {
      const page = req.query.page;
      const limitValueFromQuery = req.query.limit || limit;
      const pageValue = page * 1 || 1;
      const skipValue = ((pageValue - 1) * (limitValueFromQuery));

      const model = req.dbQuery.model; // Get the model from the query

      // Use the filters applied to req.dbQuery for the count query
      const filter = req.dbQuery.getFilter ? req.dbQuery.getFilter() : {}; // Ensure you have a getFilter method

      const countQuery = model.countDocuments(filter); // Create a new query for counting

      req.dbQuery.skip(skipValue).limit(limitValueFromQuery);

      countQuery.then((totalDocuments) => {
          const numberOfPages = Math.ceil(totalDocuments / limitValueFromQuery); // Calculate number of pages
          const currentPage = pageValue;
          const nextPage = currentPage < numberOfPages ? currentPage + 1 : null;
          const prevPage = currentPage > 1 ? currentPage - 1 : null;

          res.pagination = {
              currentPage,
              nextPage,
              prevPage,
              numberOfRows: totalDocuments,
              numberOfPages
          };

          next();
      }).catch((err) => {
          next(err);
      });
  };
};


/**
 * Search Middleware
 *
 * This middleware is used to search for a specific string in the Title and Description fields of the documents.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 *
 * If the query parameter "search" is present, the middleware will create a regex from the value of the parameter
 * and search for the regex in the Title and Description fields of the documents. The search is case insensitive.
 *
 * The middleware will add the search query to the req.dbQuery object.
 *
 * @example
 * Suppose we have a collection of documents with the following fields:
 * {
 *   _id: ObjectId,
 *   Title: String,
 *   Description: String
 * }
 *
 * To search for documents with the string "hello" in the Title or Description fields, we can add the following query parameter to the request:
 * ?search=hello
 *
 * The middleware will then search for the regex /hello/i in the Title and Description fields of the documents.
 */
const searchMiddleware = (req, res, next) => {
  const search = req.query.search;
  if (search) {
    const regex = new RegExp(search, "i");

    req.dbQuery = req.dbQuery.where({
      $or: [
        { Title: { $regex: regex } },
        { Description: { $regex: regex } },
      ],
    });
  }
  next();
};



export {filterMiddleware,selectMiddleware,paginationMiddleware,searchMiddleware};