import { initialize as initActivity } from "../server/domain/activity.ts"
import { initialize as initAddress } from "../server/domain/address.ts"
import { initialize as initAppointment } from "../server/domain/appointment.ts"
import { initialize as initDept } from "../server/domain/department.ts"
import { type Dr, initialize as initDr } from "../server/domain/dr.ts"
import { initialize as initDue } from "../server/domain/due.ts"
import { initialize as initFacility, initializeContact, initializeFac, toFac } from "../server/domain/facility.ts"
import { initialize as initInquiry } from "../server/domain/inquiry.ts"
import { initialize as initPatient } from "../server/domain/patient.ts"
import { initialize as initReferral } from "../server/domain/referral.ts"
import { initialize as initReferralTo } from "../server/domain/referralto.ts"
import { initialize as initReply } from "../server/domain/reply.ts"
import { type Staff, initialize as initStaff } from "../server/domain/staff.ts"
import { toUser, initializeUser, initialize as initAuthUser } from "../server/domain/user.ts"
import { initialize as initNotice } from "../server/domain/notice.ts"
import { initialize as initQuestionnaire, initializeQuestion as initQuestion } from "../server/domain/questionnaire.ts"
import { initialize as initAnswer } from "../server/domain/answer.ts"

export {
    initActivity,
    initAddress,
    initAppointment,
    initializeContact as initContact,
    initFacility,
    initializeFac as initFac,
    initDept,
    initDr,
    initDue,
    initInquiry,
    initNotice,
    initPatient,
    initReferral,
    initReferralTo,
    initReply,
    initStaff,
    initAuthUser,
    initializeUser as initUser,
    initQuestionnaire,
    initQuestion,
    initAnswer,
    toFac,
    toUser
}

export function toDr(val: Staff): Dr{
    return {
        id: val.id,
        name: val.name,
        department: val.department
    };
}