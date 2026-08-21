import * as schema from "./schemaSQLite.ts"
import { defineRelations } from "drizzle-orm"

export const relations = defineRelations(schema, (r) => ({
  activity: {
    activityPurposes: r.many.activityPurpose(),
    facility: r.one.facility({
      from: [r.activity.base, r.activity.facilityId],
      to: [r.facility.base, r.facility.id],
    }),
    user: r.one.user({
      from: [r.activity.base, r.activity.updatedBy],
      to: [r.user.base, r.user.id],
    }),
  },
  activityPurpose: {
    activity: r.one.activity({
     	from: r.activityPurpose.activityId,
     	to: r.activity.id,
    }),
  },
  answer: {
    answerItems: r.many.answerItem(),
    questionnaire: r.one.questionnaire({
      from: r.answer.questionnaireId,
      to: r.questionnaire.id,
    }),
    appointment: r.one.appointment({
      from: r.answer.appointmentId,
      to: r.appointment.id,
    })
  },
  answerItem: {
    answer: r.one.answer({
      from: r.answerItem.answerId,
      to: r.answer.id,
    })
  },
  appointment: {
    patient: r.one.patient({
      from: [r.appointment.base, r.appointment.patientId],
      to: [r.patient.base, r.patient.id],
    }),
    facility: r.one.facility({
      from: [r.appointment.base, r.appointment.facilityId],
      to: [r.facility.base, r.facility.id],
    }),
    department: r.one.department({
      from: [r.appointment.base, r.appointment.departmentId],
      to: [r.department.base, r.department.id],
    }),
    dr: r.one.dr({
      from: [r.appointment.base, r.appointment.drId],
      to: [r.dr.base, r.dr.id],
    }),
    appointmentPersonInCharge: r.one.user({
      from: [r.appointment.base, r.appointment.personInChargeId],
      to: [r.user.base, r.user.id],
    }),
    appointmentUpdatedBy: r.one.user({
      from: [r.appointment.base, r.appointment.updatedBy],
      to: [r.user.base, r.user.id],
    }),
    reply: r.many.reply(),
  },
  classification: {
    reply: r.one.reply({
      from: [r.classification.base, r.classification.id],
      to: [r.reply.base, r.reply.classificationId],
    }),
  },
  department: {
    appointment: r.one.appointment({
      from: [r.department.base, r.department.id],
      to: [r.appointment.base, r.appointment.departmentId],
    }),
    referralTo: r.one.referralTo({
      from: [r.department.base, r.department.id],
      to: [r.referralTo.base, r.referralTo.departmentId],
    }),
    reply: r.one.reply({
      from: [r.department.base, r.department.id],
      to: [r.reply.base, r.reply.departmentId],
    }),
    user: r.one.user({
      from: [r.department.base, r.department.id],
      to: [r.user.base, r.user.id],
    }),
  },
  dr: {
    appointment: r.one.appointment({
      from: [r.dr.base, r.dr.id],
      to: [r.appointment.base, r.appointment.drId],
    }),
    referralTo: r.one.referralTo({
      from: [r.dr.base, r.dr.id],
      to: [r.referralTo.base, r.referralTo.drId],
    }),
    reply: r.one.reply({
      from: [r.dr.base, r.dr.id],
      to: [r.reply.base, r.reply.drId],
    }),
  },
  due: {
    inquiry: r.one.inquiry({
      from: [r.due.base, r.due.id],
      to: [r.inquiry.base, r.inquiry.dueId],
    }),
  },
  facility: {
    facilityContacts: r.many.facilityContact(),
    activity: r.one.activity({
      from: [r.facility.base, r.facility.id],
      to: [r.activity.base, r.activity.facilityId],
    }),
    appointment: r.one.appointment({
      from: [r.facility.base, r.facility.id],
      to: [r.appointment.base, r.appointment.facilityId],
    }),
    inquiry: r.one.inquiry({
      from: [r.facility.base, r.facility.id],
      to: [r.inquiry.base, r.inquiry.facilityId],
    }),
    facilityCreatedBy: r.one.user({
      from: [r.facility.base, r.facility.createdBy],
      to: [r.user.base, r.user.id],
    }),
    facilityUpdatedBy: r.one.user({
      from: [r.facility.base, r.facility.updatedBy],
      to: [r.user.base, r.user.id],
    }),
  },
  facilityContact: {
    facility: r.one.facility({
      from: [r.facilityContact.base, r.facilityContact.facilityId],
      to: [r.facility.base, r.facility.id],
    }),
  },
  inquiry: {
    responses: r.many.response(),
    patient: r.one.patient({
      from: [r.inquiry.base, r.inquiry.patientInfo],
      to: [r.patient.base, r.patient.id],
    }),
    facility: r.one.facility({
      from: [r.inquiry.base, r.inquiry.facilityId],
      to: [r.facility.base, r.facility.id],
    }),
    user: r.one.user({
      from: [r.inquiry.base, r.inquiry.personInChargeId],
      to: [r.user.base, r.user.id],
    }),
    due: r.one.due({
      from: [r.inquiry.base, r.inquiry.dueId],
      to: [r.due.base, r.due.id],
    })
  },
  response: {
    inquiry: r.one.inquiry({
      from: r.response.inquiryId,
      to: r.inquiry.id,
    }),
    responder: r.one.user({
      from: [r.response.base, r.response.responderId],
      to: [r.user.base, r.user.id],
    }),
  },
  patient: {
    appointment: r.one.appointment({
      from: [r.patient.base, r.patient.id],
      to: [r.appointment.base, r.appointment.patientId],
    }),
    inquiry: r.one.inquiry({
      from: [r.patient.base, r.patient.id],
      to: [r.inquiry.base, r.inquiry.patientInfo],
    }),
  },
  questionCondition: {
    question: r.one.question({
      from: [r.questionCondition.questionnaireId, r.questionCondition.questionId],
      to: [r.question.questionnaireId, r.question.id],
    }),
  },
  questionChoice: {
    question: r.one.question({
      from: [r.questionChoice.questionnaireId, r.questionChoice.questionId],
      to: [r.question.questionnaireId, r.question.id],
    }),
  },
  question:{
    questionnaire: r.one.questionnaire({
      from: r.question.questionnaireId,
      to: r.questionnaire.id,
    }),
    questionCondition: r.one.questionCondition({
      from: [r.question.questionnaireId, r.question.id],
      to: [r.questionCondition.questionnaireId, r.questionCondition.questionId],
    }),
    questionChoices: r.many.questionChoice(),
  },
  questionnaireDept: {
    questionnaire: r.one.questionnaire({
      from: r.questionnaireDept.questionnaireId,
      to: r.questionnaire.id,
    }),
  },
  questionnaire: {
    questionnaireDepts: r.many.questionnaireDept(),
    questions: r.many.question(),
  },
  referralTo: {
    patient: r.one.patient({
      from: [r.referralTo.base, r.referralTo.patientId],
      to: [r.patient.base, r.patient.id],
    }),
    facility: r.one.facility({
      from: [r.referralTo.base, r.referralTo.facilityId],
      to: [r.facility.base, r.facility.id],
    }),
    department: r.one.department({
      from: [r.referralTo.base, r.referralTo.departmentId],
      to: [r.department.base, r.department.id],
    }),
    dr: r.one.dr({
      from: [r.referralTo.base, r.referralTo.drId],
      to: [r.dr.base, r.dr.id],
    }),
    referralToPersonInCharge: r.one.user({
      from: [r.referralTo.base, r.referralTo.personInChargeId],
      to: [r.user.base, r.user.id],
    }),
    referralToUpdatedBy: r.one.user({
      from: [r.referralTo.base, r.referralTo.updatedBy],
      to: [r.user.base, r.user.id],
    }),
  },
  reply: {
    appointment: r.one.appointment({
      from: [r.reply.base, r.reply.refId],
      to: [r.appointment.base, r.appointment.id],
    }),
    classification: r.one.classification({
      from: [r.reply.base, r.reply.classificationId],
      to: [r.classification.base, r.classification.id],
    }),
    department: r.one.department({
      from: [r.reply.base, r.reply.departmentId],
      to: [r.department.base, r.department.id],
    }),
    dr: r.one.dr({
      from: [r.reply.base, r.reply.drId],
      to: [r.dr.base, r.dr.id],
    }),
    replyPersonInCharge: r.one.user({
      from: [r.reply.base, r.reply.personInChargeId],
      to: [r.user.base, r.user.id],
    }),
    replyUpdatedBy: r.one.user({
      from: [r.reply.base, r.reply.updatedBy],
      to: [r.user.base, r.user.id],
    }),
  },
  staff: {
    facility: r.one.facility({
      from: [r.staff.base, r.staff.facilityId],
      to: [r.facility.base, r.facility.id],
    }),
    user: r.one.user({
      from: [r.staff.base, r.staff.updatedBy],
      to: [r.user.base, r.user.id],
    }),
  },
  user: {
    department: r.one.department({
      from: [r.user.base, r.user.departmentId],
      to: [r.department.base, r.department.id],
    }),
    activity: r.one.activity({
      from: [r.user.base, r.user.id],
      to: [r.activity.base, r.activity.updatedBy],
    }),
    appointmentPersonInCharge: r.one.appointment({
      from: [r.user.base, r.user.id],
      to: [r.appointment.base, r.appointment.personInChargeId],
    }),
    appointmentUpdatedBy: r.one.appointment({
      from: [r.user.base, r.user.id],
      to: [r.appointment.base, r.appointment.updatedBy],
    }),
    facilityCreatedBy: r.one.facility({
      from: [r.user.base, r.user.id],
      to: [r.facility.base, r.facility.createdBy],
    }),
    facilityUpdatedBy: r.one.facility({
      from: [r.user.base, r.user.id],
      to: [r.facility.base, r.facility.updatedBy],
    }),
    inquiry: r.one.inquiry({
      from: [r.user.base, r.user.id],
      to: [r.inquiry.base, r.inquiry.personInChargeId],
    }),
    responder: r.one.response({
      from: [r.user.base, r.user.id],
      to: [r.response.base, r.response.responderId],
    }),
    referralToPersonInCharge: r.one.referralTo({
      from: [r.user.base, r.user.id],
      to: [r.referralTo.base, r.referralTo.personInChargeId],
    }),
    referralToUpdatedBy: r.one.referralTo({
      from: [r.user.base, r.user.id],
      to: [r.referralTo.base, r.referralTo.updatedBy],
    }),
    replyPersonInCharge: r.one.reply({
      from: [r.user.base, r.user.id],
      to: [r.reply.base, r.reply.personInChargeId],
    }),
    replyUpdatedBy: r.one.reply({
      from: [r.user.base, r.user.id],
      to: [r.reply.base, r.reply.updatedBy],
    }),
    staff: r.one.staff({
      from: [r.user.base, r.user.id],
      to: [r.staff.base, r.staff.updatedBy],
    }),
    webAppointmentCreatedBy: r.one.webAppointment({
      from: [r.user.base, r.user.id],
      to: [r.webAppointment.base, r.webAppointment.createdBy],
    }),
    webAppointmentUpdatedBy: r.one.webAppointment({
      from: [r.user.base, r.user.id],
      to: [r.webAppointment.base, r.webAppointment.updatedBy],
    }),
  },
  webConsultation: {
    webAppointment: r.one.webAppointment({
      from: r.webConsultation.appointmentId,
      to: r.webAppointment.id,
    })
  },
  webPatient: {
    webAppointment: r.one.webAppointment({
      from: r.webPatient.appointmentId,
      to: r.webAppointment.id,
    }),
  },
  webAppointment: {
    webPatient: r.one.webPatient({
      from: r.webAppointment.id,
      to: r.webPatient.appointmentId,
    }),
    facility: r.one.facility({
      from: [r.webAppointment.base, r.webAppointment.facilityId],
      to: [r.facility.base, r.facility.id],
    }),
    webDepartment: r.one.webDepartment({
      from: [r.webAppointment.base, r.webAppointment.departmentId],
      to: [r.webDepartment.base, r.webDepartment.id],
    }),
    webDr: r.one.webDr({
      from: [r.webAppointment.base, r.webAppointment.drId],
      to: [r.webDr.base, r.webDr.id],
    }),
    webConsultation: r.one.webConsultation({
      from: r.webAppointment.id,
      to: r.webConsultation.appointmentId,
    }),
    webAppointmentCreatedBy: r.one.user({
      from: [r.webAppointment.base, r.webAppointment.createdBy],
      to: [r.user.base, r.user.id],
    }),
    webAppointmentUpdatedBy: r.one.user({
      from: [r.webAppointment.base, r.webAppointment.updatedBy],
      to: [r.user.base, r.user.id],
    }),
  },
  webDepartment: {
    webAppointment: r.one.webAppointment({
      from: [r.webDepartment.base, r.webDepartment.id],
      to: [r.webAppointment.base, r.webAppointment.departmentId],
    }),
    webReservation: r.one.webReservation({
      from: [r.webDepartment.base, r.webDepartment.id],
      to: [r.webReservation.base, r.webReservation.departmentId],
    }),
  },
  webDr: {
    webAppointment: r.one.webAppointment({
      from: [r.webDr.base, r.webDr.id],
      to: [r.webAppointment.base, r.webAppointment.drId],
    }),
    webReservation: r.one.webReservation({
      from: [r.webDr.base, r.webDr.id],
      to: [r.webReservation.base, r.webReservation.drId],
    }),
  },
  webReserv: {
    webMaster: r.one.webMaster({
      from: [r.webReserv.base, r.webReserv.departmentId, r.webReserv.drId, r.webReserv.week],
      to: [r.webMaster.base, r.webMaster.departmentId, r.webMaster.drId, r.webMaster.week],
    }),
  },
  webMaster: {
    webReservs: r.many.webReserv(),
  },
  webReservation: {
    webDepartment: r.one.webDepartment({
      from: [r.webReservation.base, r.webReservation.departmentId],
      to: [r.webDepartment.base, r.webDepartment.id],
    }),
    webDr: r.one.webDr({
      from: [r.webReservation.base, r.webReservation.drId],
      to: [r.webDr.base, r.webDr.id],
    }),
  },
}));