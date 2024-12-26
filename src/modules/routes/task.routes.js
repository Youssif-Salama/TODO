import { Router } from "express";
import {
  attachAddQuery,
  attachDeleteQuery,
  attachGetQuery,
  attachUpdateQuery,
} from "../../middlewares/Attach.Query.js";
import TaskModel from "../models/task.model.js";
import {
  filterMiddleware,
  paginationMiddleware,
  searchMiddleware,
  selectMiddleware,
} from "../../middlewares/Features.middleware.js";
import { authenticationMiddleware } from "../../middlewares/auth.middleware.js";
import { execute } from "../../middlewares/Execution.js";
import { filterTaskUponStatus } from "../middlewares/task.middlewares.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { addTaskValidationSchema, updateTaskValidationSchema } from "../validations/task.validations.js";

const taskRouter = Router({ mergeParams: true });

// create task
taskRouter.post(
  "/",
  authenticationMiddleware,
  validate(addTaskValidationSchema),
  attachAddQuery(TaskModel),
  execute(
    {
      status: 201,
      result: {
        message: "success",
      },
    },
    {
      status: 400,
      result: {
        message: "failed",
      },
    }
  )
);

// delete task
taskRouter.delete(
  "/:id",
  authenticationMiddleware,
  attachDeleteQuery(TaskModel),
  filterMiddleware("task", { fieldName: "_id", paramName: "id" }),
  execute(
    {
      status: 200,
      result: {
        message: "success",
      },
    },
    {
      status: 400,
      result: {
        message: "failed",
      },
    }
  )
);

// update task
taskRouter.put(
  "/:id",
  authenticationMiddleware,
  validate(updateTaskValidationSchema),
  attachUpdateQuery(TaskModel),
  filterMiddleware("task", { fieldName: "_id", paramName: "id" }),
  execute(
    {
      status: 200,
      result: {
        message: "success",
      },
    },
    {
      status: 400,
      result: {
        message: "failed",
      },
    }
  )
);

// get one task
taskRouter.get(
  "/:id",
  authenticationMiddleware,
  attachGetQuery(TaskModel),
  selectMiddleware(),
  filterMiddleware("task", { fieldName: "_id", paramName: "id" }),
  execute(
    {
      status: 200,
      result: {
        message: "success",
      },
    },
    {
      status: 400,
      result: {
        message: "failed",
      },
    }
  )
);

// get my tasks merged by user
taskRouter.get(
  "/",
  authenticationMiddleware,
  attachGetQuery(TaskModel),
  selectMiddleware(),
  filterMiddleware("task", { fieldName: "Creator", paramName: "id" }),
  filterTaskUponStatus,
  searchMiddleware,
  paginationMiddleware(10),
  execute(
    {
      status: 200,
      result: {
        message: "success",
      },
    },
    {
      status: 400,
      result: {
        message: "failed",
      },
    }
  )
);

// delete my tasks merged by user
taskRouter.delete(
  "/",
  authenticationMiddleware,
  attachDeleteQuery(TaskModel),
  filterMiddleware("task", { fieldName: "Creator", paramName: "id" }),
  execute(
    {
      status: 200,
      result: {
        message: "success",
      },
    },
    {
      status: 400,
      result: {
        message: "failed",
      },
    }
  )
);

export default taskRouter;
