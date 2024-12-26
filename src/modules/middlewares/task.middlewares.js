
/*************  ✨ Codeium Command ⭐  *************/
/**
 * Filter middleware that filters the query based on the status query parameter.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @description
 * If the query parameter "status" is present, the middleware will filter the query based on the value of the parameter.
 * If the value is "live", the middleware will filter the query to only include tasks that are due after the current date.
 * If the value is not "live", the middleware will filter the query to only include tasks that are due on or before the current date.
 * The middleware will add the filter query to the req.dbQuery object.
 */
/******  67c3fcb9-bdc7-4ad8-a05a-eea7da45c196  *******/
export const filterTaskUponStatus = (req, res, next) => {
  const { status } = req.query;
  if (status) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (status === "live") {
      req.dbQuery = req.dbQuery.where("DueDate").gte(today);
    } else {
      req.dbQuery = req.dbQuery.where("DueDate").lt(today);
    }
  }
  req.dbQuery = req.dbQuery.where({ isCompleted: false });
  req.dbQuery = req.dbQuery.sort({ DueDate: 1 });
  next();
};
