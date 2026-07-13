import { varchar, text, uuid, integer, smallint, date, timestamp, time,
  boolean, index, primaryKey, pgTable } from "drizzle-orm/pg-core"

export const address = pgTable("address", {
  postalCode: varchar({ length: 8 }).primaryKey().notNull(),
  name: varchar({ length: 100 }).notNull(),
  plus: varchar({ length: 100 }).notNull(),
});

export const activity = pgTable("activity", {
  base: text().notNull(),
  id: uuid().notNull(),
  date: date().notNull(),
  toDate: date().notNull(),
  participants: varchar({ length: 100 }).notNull(),
  facilityParticipants: varchar({ length: 100 }).notNull(),
  details: text().notNull(),
  facilityId: varchar({ length: 20 }).notNull(),
  updatedBy: varchar({ length: 50 }).notNull(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_activity_facility").on(table.base, table.facilityId),
  index("idx_activity_date").on(table.base, table.date),
]);

export const activityPurpose = pgTable("activity_purpose", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  activityId: uuid().notNull(),
  purpose: varchar({ length: 10 }).notNull(),
}, (table) => [
  index("idx_activity_purpose").on(table.activityId),
]);

export const answer = pgTable("answer", {
  base: text().notNull(),
  id: uuid().notNull(),
  questionnaireId: uuid().notNull(),
  appointmentId: uuid().notNull(),
  appointmentDate: date().notNull(),
  inputDate: timestamp().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_answer_appointment").on(table.base, table.appointmentId),
]);

export const answerItem = pgTable("answer_item", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  answerId: uuid().notNull(),
  itemId: varchar({ length: 3 }).notNull(),
}, (table) => [
  index("idx_answer_item").on(table.answerId),
]);

export const answerPassword = pgTable("answer_password", {
  appointmentId: uuid().primaryKey().notNull(),
  password: varchar({ length: 10 }).notNull(),
  failCount: smallint().notNull(),
});

export const appointment = pgTable("appointment", {
  base: text().notNull(),
  id: uuid().notNull(),
  patientId: varchar({ length: 10 }).notNull(),
  date: date().notNull(),
  time: time().notNull(),
  facilityId: varchar({ length: 20 }).notNull(),
  facilityDr: varchar({ length: 50 }).notNull(),
  facilityDept: varchar({ length: 30 }).notNull(),
  departmentId: varchar({ length: 10 }).notNull(),
  drId: varchar({ length: 10 }).notNull(),
  appDisplay: varchar({ length: 50 }).notNull(),
  means: varchar({ length: 10 }).notNull(),
  personInChargeId: varchar({ length: 10 }).notNull(),
  memo: text().notNull(),
  updatedBy: varchar({ length: 50 }).notNull(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_appointment_patient").on(table.base, table.patientId),
  index("idx_appointment_facility").on(table.base, table.facilityId),
  index("idx_appointment_date").on(table.base, table.date),
]);

export const department = pgTable("department", {
  base: text().notNull(),
  id: varchar({ length: 10 }).notNull(),
  name: varchar({ length: 50 }).notNull(),
  exam: boolean().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
]);

export const dr = pgTable("dr", {
  base: text().notNull(),
  id: varchar({ length: 10 }).notNull(),
  name: varchar({ length: 50 }).notNull(),
  department: varchar({ length: 10 }).notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_dr_dept").on(table.base, table.department),
]);

export const due = pgTable("due", {
  base: text().notNull(),
  id: smallint().notNull(),
  name: varchar({ length: 50 }).notNull(),
  days: smallint().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
]);

export const facility = pgTable("facility", {
  base: text().notNull(),
  id: varchar({ length: 20 }).notNull(),
  attribute: varchar({ length: 10 }).notNull(),
  nameCorp: varchar({ length: 50 }).notNull(),
  name: varchar({ length: 100 }).notNull(),
  kana: varchar({ length: 100 }).notNull(),
  tel: varchar({ length: 13 }).notNull(),
  fax: varchar({ length: 13 }).notNull(),
  email: varchar({ length: 100 }).notNull(),
  postalCode: varchar({ length: 8 }).notNull(),
  addressName: text().notNull(),
  addressPlus: text().notNull(),
  memo: text().notNull(),
  closedDate: date().notNull(),
  createdBy: varchar({ length: 10 }).notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull(),
  updatedBy: varchar({ length: 50 }).notNull(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
]);

export const facilityContact = pgTable("facility_contact", {
  id: integer().primaryKey(),
  base: text().notNull(),
  facilityId: varchar({ length: 20 }).notNull(),
  tel: varchar({ length: 13 }).notNull(),
  fax: varchar({ length: 13 }).notNull(),
  email: varchar({ length: 100 }).notNull(),
  name: varchar({ length: 20 }).notNull(),
}, (table) => [
  index("idx_facility_contact_facility").on(table.base, table.facilityId),
]);

export const inquiry = pgTable("inquiry", {
  base: text().notNull(),
  id: uuid().notNull(),
  patientInfo: varchar({ length: 100 }).notNull(),
  facilityId: varchar({ length: 20 }).notNull(),
  facilityStaff: varchar({ length: 10 }).notNull(),
  personInChargeId: varchar({ length: 10 }).notNull(),
  tel: varchar({ length: 50 }).notNull(),
  datetime: timestamp().notNull(),
  dueId: smallint().notNull(),
  details: text().notNull(),
  done: boolean().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_inquiry_patient").on(table.base, table.patientInfo),
  index("idx_inquiry_facility").on(table.base, table.facilityId),
  index("idx_inquiry_date").on(table.base, table.datetime),
]);

export const response = pgTable("response", {
  base: text().notNull(),
  inquiryId: uuid().notNull(),
  responderId: varchar({ length: 10 }).notNull(),
  datetime: timestamp().notNull(),
  details: text().notNull(),
}, (table) => [
  index("idx_response_inquiry").on(table.inquiryId),
]);

export const master = pgTable("master", {
  base: text().notNull(),
  kind: varchar({ length: 10 }).notNull(),
  id: varchar({ length: 10 }).notNull(),
  value: varchar({ length: 20 }).notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.kind, table.id] }),
]);

export const notice = pgTable("notice", {
  base: text().notNull(),
  id: varchar({ length: 10 }).notNull(),
  type: varchar().notNull(),
  message: text().notNull(),
  fromDate: date().notNull(),
  toDate: date().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_notice_date").on(table.base, table.fromDate),
]);

export const patient = pgTable("patient", {
  base: text().notNull(),
  id: varchar({ length: 10 }).notNull(),
  lastName: varchar({ length: 50 }).notNull(),
  firstName: varchar({ length: 50 }).notNull(),
  lastKana: varchar({ length: 50 }).notNull(),
  firstKana: varchar({ length: 50 }).notNull(),
  sex: smallint().notNull(),
  birthday: date().notNull(),
  tel: varchar({ length: 13 }).notNull(),
  tel2: varchar({ length: 13 }).notNull(),
  postalCode: varchar({ length: 8 }).notNull(),
  addressName: text().notNull(),
  addressPlus: text().notNull(),
  memo: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
]);

export const questionCondition = pgTable("question_condition", {
  questionnaireId: uuid().notNull(),
  questionId: uuid().primaryKey().notNull(),
  q: uuid().notNull(),
  a: varchar({ length: 10 }).notNull(),
}, (table) => [
  index("idx_question_condition_qid").on(table.questionnaireId),
]);

export const questionChoice = pgTable("question_choice", {
  questionnaireId: uuid().notNull(),
  questionId: uuid().notNull(),
  id: varchar({ length: 30 }).notNull(),
  text: varchar({ length: 100 }).notNull(),
  sort: integer().notNull(),
}, (table) => [
  primaryKey({ columns: [table.questionId, table.id] }),
  index("idx_question_choice_qid").on(table.questionnaireId),
]);

export const question = pgTable("question", {
  questionnaireId: uuid().notNull(),
  id: uuid().notNull(),
  type: varchar().notNull(),
  require: boolean().notNull(),
  title: varchar({ length: 200 }).notNull(),
  sort: integer().notNull(),
}, (table) => [
  primaryKey({ columns: [table.questionnaireId, table.sort] }),
  index("idx_question_qid").on(table.questionnaireId, table.id),
  index("idx_question_sort").on(table.questionnaireId, table.sort),
]);

export const questionnaireDept = pgTable("questionnaire_dept", {
  questionnaireId: uuid().notNull(),
  deptId: varchar({ length: 10 }).notNull(),
}, (table) => [
  primaryKey({ columns: [table.questionnaireId, table.deptId] }),
]);

export const questionnaire = pgTable("questionnaire", {
  base: text().notNull(),
  id: uuid().notNull(),
  title: varchar({ length: 100 }).notNull(),
  description: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
]);

export const referralTo = pgTable("referral_to", {
  base: text().notNull(),
  id: uuid().notNull(),
  patientId: varchar({ length: 10 }).notNull(),
  date: date().notNull(),
  facilityId: varchar({ length: 20 }).notNull(),
  facilityDr: varchar({ length: 50 }).notNull(),
  facilityDept: varchar({ length: 30 }).notNull(),
  departmentId: varchar({ length: 10 }).notNull(),
  drId: varchar({ length: 10 }).notNull(),
  personInChargeId: varchar({ length: 10 }).notNull(),
  memo: text().notNull(),
  updatedBy: varchar({ length: 50 }).notNull(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_referralto_patient").on(table.base, table.patientId),
  index("idx_referralto_facility").on(table.base, table.facilityId),
  index("idx_referralto_date").on(table.base, table.date),
]);

export const reply = pgTable("reply", {
  base: text().notNull(),
  id: uuid().notNull(),
  refId: uuid().notNull(),
  date: date().notNull(),
  departmentId: varchar({ length: 10 }).notNull(),
  drId: varchar({ length: 10 }).notNull(),
  classification: varchar({ length: 10 }).notNull(),
  personInChargeId: varchar({ length: 10 }).notNull(),
  memo: text().notNull(),
  updatedBy: varchar({ length: 50 }).notNull(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_reply_ref").on(table.refId, table.date),
]);

export const staff = pgTable("staff", {
  base: text().notNull(),
  id: uuid().notNull(),
  name: varchar({ length: 100 }).notNull(),
  kana: varchar({ length: 100 }).notNull(),
  department: varchar({ length: 30 }).notNull(),
  dr: boolean().notNull(),
  post: varchar({ length: 100 }).notNull(),
  facilityId: varchar({ length: 20 }).notNull(),
  sort: smallint().notNull(),
  hidden: boolean().notNull(),
  updatedBy: varchar({ length: 50 }).notNull(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_staff_faclility").on(table.base, table.facilityId),
]);

export const user = pgTable("user", {
  base: text().notNull(),
  id: varchar({ length: 50 }).notNull(),
  name: varchar({ length: 100 }).notNull(),
  departmentId: varchar({ length: 10 }).notNull(),
  authFacility: smallint().notNull(),
  authReferral: smallint().notNull(),
  authActivity: smallint().notNull(),
  authStatistics: smallint().notNull(),
  authMaster: smallint().notNull(),
  authWeb: smallint().notNull(),
  password: varchar({ length: 100 }).notNull(),
  facilityId: varchar({ length: 20 }).notNull(),
  locked: boolean().notNull(),
  failCount: smallint().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_user_faclility").on(table.base, table.facilityId),
]);

export const webConsultation = pgTable("web_consultation", {
  appointmentId: uuid().notNull(),
  first: varchar({ length: 20 }).notNull(),
  second: varchar({ length: 20 }).notNull(),
  etc: text().notNull(),
});

export const webPatient = pgTable("web_patient", {
  appointmentId: uuid().notNull().primaryKey(),
  id: varchar({ length: 10 }).notNull(),
  lastName: varchar({ length: 50 }).notNull(),
  firstName: varchar({ length: 50 }).notNull(),
  lastKana: varchar({ length: 50 }).notNull(),
  firstKana: varchar({ length: 50 }).notNull(),
  sex: smallint().notNull(),
  birthday: date().notNull(),
  tel: varchar({ length: 13 }).notNull(),
  tel2: varchar({ length: 13 }).notNull(),
  memo: text().notNull(),
  postalCode: varchar({ length: 8 }).notNull(),
  addressName: text().notNull(),
  addressPlus: text().notNull(),
});

export const webAppointment = pgTable("web_appointment", {
  base: text().notNull(),
  id: uuid().notNull(),
  date: date().notNull(),
  time: time().notNull(),
  facilityId: varchar({ length: 20 }).notNull(),
  departmentId: varchar({ length: 10 }).notNull(),
  drId: varchar({ length: 10 }).notNull(),
  mainComplaint: text().notNull(),
  cancel: boolean().notNull(),
  force: boolean().notNull(),
  createdBy: varchar({ length: 10 }).notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull(),
  updatedBy: varchar({ length: 50 }).notNull(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_web_appointment_facility").on(table.base, table.facilityId),
  index("idx_web_appointment_date").on(table.base, table.date),
]);

export const webDepartment = pgTable("web_department", {
  base: text().notNull(),
  id: varchar({ length: 10 }).notNull(),
  name: varchar({ length: 100 }).notNull(),
  description: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
]);

export const webDr = pgTable("web_dr", {
  base: text().notNull(),
  id: varchar({ length: 10 }).notNull(),
  name: varchar({ length: 50 }).notNull(),
  displayName: varchar({ length: 30 }).notNull(),
  department: varchar({ length: 10 }).notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
]);

export const webReserv = pgTable("web_master_reserv", {
  base: text().notNull(),
  departmentId: varchar({ length: 10 }).notNull(),
  drId: varchar({ length: 10 }).notNull(),
  week: smallint().notNull(),
  time: time().notNull(),
  max: smallint().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.departmentId, table.drId, table.week, table.time] }),
]);

export const webMaster = pgTable("web_master", {
  base: text().notNull(),
  departmentId: varchar({ length: 10 }).notNull(),
  drId: varchar({ length: 10 }).notNull(),
  week: integer().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.departmentId, table.drId, table.week] }),
]);

export const webNotice = pgTable("web_notice", {
  base: text().notNull(),
  id: varchar({ length: 10 }).notNull(),
  type: varchar().notNull(),
  message: text().notNull(),
  fromDate: date().notNull(),
  toDate: date().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_web_notice_date").on(table.base, table.fromDate),
]);

export const webReservation = pgTable("web_reservation", {
  base: text().notNull(),
  departmentId: varchar({ length: 10 }).notNull(),
  drId: varchar({ length: 10 }).notNull(),
  date: date().notNull(),
  time: time().notNull(),
  max: smallint().notNull(),
  cnt: smallint().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.departmentId, table.drId, table.date, table.time] }),
]);