import { Request, Response } from "express";
import { HttpError } from "../core/httpError.js";
import { AcademicPeriodService } from "../services/academicperiod.service.js";

export class AcademicPeriodController {
    static async getActive(_req: Request, res: Response) {
        try {
            const period = await AcademicPeriodService.getActive();
            return res.status(200).json(period);
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    }

    static async findAll(_req: Request, res: Response) {
        try {
            const periods = await AcademicPeriodService.findAll();
            return res.status(200).json(periods);
        } catch (err: HttpError | any) {
            return res.status(err.status || 500).json({ error: err.message });
        }
    }
}
