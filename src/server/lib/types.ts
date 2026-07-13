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