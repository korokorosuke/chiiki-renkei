export { toFac, toUser } from "../../helper/types.ts"
export { initWebDr, toAppointment } from "../../helper/webtypes.ts"
import type { Appointment } from "../domain/appointment.ts"
import type { Referral } from "../domain/referral.ts"
import type { ReferralTo } from "../domain/referralto.ts"

export function toReferral(app: Appointment): Referral {
    return {
        id: app.id,
        patient: app.patient,
        date: app.date,
        facility: app.facility,
        department: app.department,
        dr: app.dr,
        replies: [],
    };
}

export function toReferralTo(app: Appointment): ReferralTo{
    return {
        id: app.id,
        patient: app.patient,
        date: app.date,
        facility: app.facility,
        facilityDr: app.facilityDr,
        facilityDept: app.facilityDept,
        department: app.department,
        dr: app.dr,
        personInCharge: app.personInCharge,
        memo: app.memo,
        updatedBy: app.updatedBy,
        updatedAt: app.updatedAt
    };
}

export class FatalError extends Error {
    public title: string;
    public details: string|Error|unknown;
    public base?: string;
    public userId?: string;
    public patientId?: string;
    constructor(message: string, details: string|Error|unknown, base?: string, userId?: string, patientId?: string) {
        super(message);
        this.name = "FatalError";
        this.title = message;
        this.details = details;
        this.base = base;
        this.userId = userId;
        this.patientId = patientId;
    }
}