import { AppError, CatchAsyncErrors } from "../services/ErrorHandler.service.js";


/**
 * {200,"ok"},{500,"error"}
 * @param {*} success
 * @param {*} fail
 * @returns error || response of success
 */
export const execute = (success, fail) => {
    return CatchAsyncErrors(async (req, res) => {

        const response = await req.dbQuery;

        const status = fail?.status || 500
        if (!response) throw new AppError(status, fail?.result);

        else {

            success.result.data = response;
            success.result.meta = res.pagination;

            if(res.contracts && res.contracts?.length > 0) {
                success.result.contracts = res.contracts;
            }

            const status = success?.status || 200
            res.status(status).json(success?.result);
        }
    })
}