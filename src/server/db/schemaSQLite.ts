import { text, integer, index, primaryKey, snakeCase } from "drizzle-orm/sqlite-core"

export const address = snakeCase.table("address", {
  postalCode: text().primaryKey().notNull(),
  name: text().notNull(),
  plus: text().notNull(),
});

export const activity = snakeCase.table("activity", {
  base: text().notNull(),
  id: text().notNull(),
  date: text().notNull(),
  toDate: text().notNull(),
  participants: text().notNull(),
  facilityParticipants: text().notNull(),
  details: text().notNull(),
  facilityId: text().notNull(),
  updatedBy: text().notNull(),
  updatedAt: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_activity_facility").on(table.base, table.facilityId),
  index("idx_activity_date").on(table.base, table.date),
]);

export const activityPurpose = snakeCase.table("activity_purpose", {
  id: integer().primaryKey().notNull(),
  activityId: text().notNull(),
  purpose: text().notNull(),
}, (table) => [
  index("idx_activity_purpose").on(table.activityId),
]);

export const answer = snakeCase.table("answer", {
  base: text().notNull(),
  id: text().notNull(),
  questionnaireId: text().notNull(),
  appointmentId: text().notNull(),
  appointmentDate: text().notNull(),
  inputDate: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_answer_appointment").on(table.base, table.appointmentId),
]);

export const answerItem = snakeCase.table("answer_item", {
  id: integer().primaryKey().notNull(),
  answerId: text().notNull(),
  itemId: text().notNull(),
}, (table) => [
  index("idx_answer_item").on(table.answerId),
]);

export const answerPassword = snakeCase.table("answer_password", {
  appointmentId: text().primaryKey().notNull(),
  password: text().notNull(),
  failCount: integer().notNull(),
});

export const appointment = snakeCase.table("appointment", {
  base: text().notNull(),
  id: text().notNull(),
  patientId: text().notNull(),
  date: text().notNull(),
  time: text().notNull(),
  facilityId: text().notNull(),
  facilityDr: text().notNull(),
  facilityDept: text().notNull(),
  departmentId: text().notNull(),
  drId: text().notNull(),
  appDisplay: text().notNull(),
  means: text().notNull(),
  personInChargeId: text().notNull(),
  memo: text().notNull(),
  updatedBy: text().notNull(),
  updatedAt: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_appointment_patient").on(table.base, table.patientId),
  index("idx_appointment_facility").on(table.base, table.facilityId),
  index("idx_appointment_date").on(table.base, table.date),
]);

export const classification = snakeCase.table("classification", {
  base: text().notNull(),
  id: text().notNull(),
  name: text().notNull(),
  done: integer().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
]);

export const department = snakeCase.table("department", {
  base: text().notNull(),
  id: text().notNull(),
  name: text().notNull(),
  exam: integer().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
]);

export const dr = snakeCase.table("dr", {
  base: text().notNull(),
  id: text().notNull(),
  name: text().notNull(),
  department: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_dr_dept").on(table.base, table.department),
]);

export const due = snakeCase.table("due", {
  base: text().notNull(),
  id: integer().notNull(),
  name: text().notNull(),
  days: integer().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
]);

export const facility = snakeCase.table("facility", {
  base: text().notNull(),
  id: text().notNull(),
  attribute: text().notNull(),
  nameCorp: text().notNull(),
  name: text().notNull(),
  kana: text().notNull(),
  tel: text().notNull(),
  fax: text().notNull(),
  email: text().notNull(),
  postalCode: text().notNull(),
  addressName: text().notNull(),
  addressPlus: text().notNull(),
  memo: text().notNull(),
  closedDate: text().notNull(),
  faxSendNo: text().notNull(),
  notSend: integer().notNull(),
  createdBy: text().notNull(),
  createdAt: text().notNull(),
  updatedBy: text().notNull(),
  updatedAt: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
]);

export const facilityContact = snakeCase.table("facility_contact", {
  id: integer().primaryKey(),
  base: text().notNull(),
  facilityId: text().notNull(),
  tel: text().notNull(),
  fax: text().notNull(),
  email: text().notNull(),
  name: text().notNull(),
}, (table) => [
  index("idx_facility_contact_facility").on(table.base, table.facilityId),
]);

export const inquiry = snakeCase.table("inquiry", {
  base: text().notNull(),
  id: text().notNull(),
  patientInfo: text().notNull(),
  facilityId: text().notNull(),
  facilityStaff: text().notNull(),
  personInChargeId: text().notNull(),
  tel: text().notNull(),
  datetime: text().notNull(),
  dueId: integer().notNull(),
  details: text().notNull(),
  done: integer().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_inquiry_patient").on(table.patientInfo),
  index("idx_inquiry_facility").on(table.base, table.facilityId),
  index("idx_inquiry_date").on(table.base, table.datetime),
]);

export const response = snakeCase.table("response", {
  base: text().notNull(),
  inquiryId: text().notNull(),
  responderId: text().notNull(),
  datetime: text().notNull(),
  details: text().notNull(),
}, (table) => [
  index("idx_response_inquiry").on(table.inquiryId),
]);

export const master = snakeCase.table("master", {
  base: text().notNull(),
  kind: text().notNull(),
  id: integer().notNull(),
  value: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.kind, table.id] }),
]);

export const notice = snakeCase.table("notice", {
  base: text().notNull(),
  id: text().notNull(),
  type: text().notNull(),
  message: text().notNull(),
  fromDate: text().notNull(),
  toDate: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_notice_date").on(table.base, table.fromDate),
]);

export const patient = snakeCase.table("patient", {
  base: text().notNull(),
  id: text().notNull(),
  lastName: text().notNull(),
  firstName: text().notNull(),
  lastKana: text().notNull(),
  firstKana: text().notNull(),
  sex: integer().notNull(),
  birthday: text().notNull(),
  tel: text().notNull(),
  tel2: text().notNull(),
  postalCode: text().notNull(),
  addressName: text().notNull(),
  addressPlus: text().notNull(),
  memo: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
]);

export const questionCondition = snakeCase.table("question_condition", {
  questionnaireId: text().notNull(),
  questionId: text().notNull(),
  q: text().notNull(),
  a: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.questionnaireId, table.questionId] }),
]);

export const questionChoice = snakeCase.table("question_choice", {
  questionnaireId: text().notNull(),
  questionId: text().notNull(),
  id: text().notNull(),
  text: text().notNull(),
  order: integer().notNull(),
}, (table) => [
  primaryKey({ columns: [table.questionnaireId, table.questionId, table.id] }),
]);

export const question = snakeCase.table("question", {
  questionnaireId: text().notNull(),
  id: text().notNull(),
  type: text().notNull(),
  require: integer().notNull(),
  title: text().notNull(),
  order: integer().notNull(),
}, (table) => [
  primaryKey({ columns: [table.questionnaireId, table.id] }),
  index("idx_question_order").on(table.questionnaireId, table.order),
]);

export const questionnaireDept = snakeCase.table("questionnaire_dept", {
  questionnaireId: text().notNull(),
  deptId: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.questionnaireId, table.deptId] }),
]);

export const questionnaire = snakeCase.table("questionnaire", {
  base: text().notNull(),
  id: text().notNull(),
  title: text().notNull(),
  description: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
]);

export const referralTo = snakeCase.table("referral_to", {
  base: text().notNull(),
  id: text().notNull(),
  patientId: text().notNull(),
  date: text().notNull(),
  facilityId: text().notNull(),
  facilityDr: text().notNull(),
  facilityDept: text().notNull(),
  departmentId: text().notNull(),
  drId: text().notNull(),
  personInChargeId: text().notNull(),
  memo: text().notNull(),
  updatedBy: text().notNull(),
  updatedAt: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_referralto_patient").on(table.base, table.patientId),
  index("idx_referralto_facility").on(table.base, table.facilityId),
  index("idx_referralto_date").on(table.base, table.date),
]);

export const reply = snakeCase.table("reply", {
  base: text().notNull(),
  id: text().notNull(),
  refId: text().notNull(),
  date: text().notNull(),
  departmentId: text().notNull(),
  drId: text().notNull(),
  classificationId: text().notNull(),
  personInChargeId: text().notNull(),
  memo: text().notNull(),
  updatedBy: text().notNull(),
  updatedAt: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_reply_ref").on(table.refId, table.date),
]);

export const staff = snakeCase.table("staff", {
  base: text().notNull(),
  id: text().notNull(),
  name: text().notNull(),
  kana: text().notNull(),
  department: text().notNull(),
  dr: integer().notNull(),
  post: text().notNull(),
  facilityId: text().notNull(),
  order: integer().notNull(),
  hidden: integer().notNull(),
  updatedBy: text().notNull(),
  updatedAt: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_staff_faclility").on(table.base, table.facilityId),
]);

export const user = snakeCase.table("user", {
  base: text().notNull(),
  id: text().notNull(),
  name: text().notNull(),
  departmentId: text().notNull(),
  authFacility: integer().notNull(),
  authReferral: integer().notNull(),
  authActivity: integer().notNull(),
  authStatistics: integer().notNull(),
  authMaster: integer().notNull(),
  authWeb: integer().notNull(),
  password: text().notNull(),
  facilityId: text().notNull(),
  locked: integer().notNull(),
  failCount: integer().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_user_faclility").on(table.base, table.facilityId),
]);

export const webConsultation = snakeCase.table("web_consultation", {
  appointmentId: text().notNull(),
  first: text().notNull(),
  second: text().notNull(),
  etc: text().notNull(),
});

export const webPatient = snakeCase.table("web_patient", {
  appointmentId: text().primaryKey().notNull(),
  id: text().notNull(),
  lastName: text().notNull(),
  firstName: text().notNull(),
  lastKana: text().notNull(),
  firstKana: text().notNull(),
  sex: integer().notNull(),
  birthday: text().notNull(),
  tel: text().notNull(),
  tel2: text().notNull(),
  memo: text().notNull(),
  postalCode: text().notNull(),
  addressName: text().notNull(),
  addressPlus: text().notNull(),
});

export const webAppointment = snakeCase.table("web_appointment", {
  base: text().notNull(),
  id: text().notNull(),
  date: text().notNull(),
  time: text().notNull(),
  facilityId: text().notNull(),
  departmentId: text().notNull(),
  drId: text().notNull(),
  facPatientId: text().notNull(),
  mainComplaint: text().notNull(),
  cancel: integer().notNull(),
  force: integer().notNull(),
  createdBy: text().notNull(),
  createdAt: text().notNull(),
  updatedBy: text().notNull(),
  updatedAt: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_web_appointment_facility").on(table.base, table.facilityId),
  index("idx_web_appointment_date").on(table.base, table.date),
]);

export const webDepartment = snakeCase.table("web_department", {
  base: text().notNull(),
  id: text().notNull(),
  name: text().notNull(),
  description: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
]);

export const webDr = snakeCase.table("web_dr", {
  base: text().notNull(),
  id: text().notNull(),
  name: text().notNull(),
  displayName: text().notNull(),
  department: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
]);

export const webReserv = snakeCase.table("web_master_reserv", {
  base: text().notNull(),
  departmentId: text().notNull(),
  drId: text().notNull(),
  week: integer().notNull(),
  time: text().notNull(),
  max: integer().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.departmentId, table.drId, table.week, table.time] }),
]);

export const webMaster = snakeCase.table("web_master", {
  base: text().notNull(),
  departmentId: text().notNull(),
  drId: text().notNull(),
  week: integer().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.departmentId, table.drId, table.week] }),
]);

export const webNotice = snakeCase.table("web_notice", {
  base: text().notNull(),
  id: text().notNull(),
  type: text().notNull(),
  message: text().notNull(),
  fromDate: text().notNull(),
  toDate: text().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.id] }),
  index("idx_web_notice_date").on(table.base, table.fromDate),
]);

export const webReservation = snakeCase.table("web_reservation", {
  base: text().notNull(),
  departmentId: text().notNull(),
  drId: text().notNull(),
  date: text().notNull(),
  time: text().notNull(),
  max: integer().notNull(),
  cnt: integer().notNull(),
}, (table) => [
  primaryKey({ columns: [table.base, table.departmentId, table.drId, table.date, table.time] }),
]);

export const log = snakeCase.table("log", {
  base: text().notNull(),
  datetime: text().notNull(),
  level: text().notNull(),
  title: text().notNull(),
  details: text().notNull(),
}, (table) => [
  index("idx_log_datetime").on(table.base, table.datetime),
]);