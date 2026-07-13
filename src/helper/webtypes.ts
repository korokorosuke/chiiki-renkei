import { initialize as initWebDr } from "../server/domain/webDr.ts"
import { initialize as initWebDept } from "../server/domain/webDepartment.ts"
import { initialize as initWebReservation } from "../server/domain/webReservation.ts"
import { type WebAppointment, initialize as initWebAppointment } from "../server/domain/webAppointment.ts"
import { initialize as initWebNotice } from "../server/domain/webNotice.ts"
import { initializeReserv, initialize as initWebMaster } from "../server/domain/webMaster.ts"
import type { Appointment } from "../server/domain/appointment.ts"
import type { AuthUser } from "../server/domain/user.ts"

export {
    initializeReserv as initReserv,
    initWebAppointment,
    initWebDept,
    initWebDr,
    initWebMaster,
    initWebNotice,
    initWebReservation
}

export function toAppointment(app: WebAppointment): Appointment{
    return {
        id: app.id,
        patient: app.patient,
        date: app.date,
        time: app.time,
        facility: app.facility,
        facilityDr: app.updatedBy.name,
        facilityDept: "",
        department: { id: app.department.id, name: app.department.name },
        dr: { id: app.dr.id, name: app.dr.name, department: app.dr.department },
        appDisplay: app.dr.displayName,
        personInCharge: { id: "webapp", name: "Web予約", department: "9999" },
        means: "WEB",
        memo: "",
        updatedBy: app.updatedBy,
        updatedAt: app.updatedAt
    };
}

export function isUser(auth: AuthUser): boolean{
    return auth.authWeb === 1;
}

export function isMaster(auth: AuthUser): boolean{
    return auth.authWeb >= 2;
}