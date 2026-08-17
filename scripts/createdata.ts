/// <reference lib="deno.unstable" />
import { Department } from "../src/server/domain/department.ts"
import { Dr } from "../src/server/domain/dr.ts"
import { Facility } from "../src/server/domain/facility.ts"
import { Staff } from "../src/server/domain/staff.ts"
import { AuthUser } from "../src/server/domain/user.ts"
import { Patient } from "../src/server/domain/patient.ts"
import { Due } from "../src/server/domain/due.ts"
import { DB_TYPE } from "../src/server/settings.ts"
import { ClassificationRepository } from "../src/server/infra/classificationRepository.ts"
import { ClassificationRepository as RdbClassificationRepository } from "../src/server/infra/rdb/classificationRepository.ts"
import { DepartmentRepository } from "../src/server/infra/departmentRepository.ts"
import { DepartmentRepository as RdbDepartmentRepository } from "../src/server/infra/rdb/departmentRepository.ts"
import { DrRepository } from "../src/server/infra/drRepository.ts"
import { DrRepository as RdbDrRepository } from "../src/server/infra/rdb/drRepository.ts"
import { FacilityRepository } from "../src/server/infra/facilityRepository.ts"
import { FacilityRepository as RdbFacilityRepository } from "../src/server/infra/rdb/facilityRepository.ts"
import { PatientRepository } from "../src/server/infra/patientRepository.ts"
import { PatientRepository as RdbPatientRepository } from "../src/server/infra/rdb/patientRepository.ts"
import { StaffRepository } from "../src/server/infra/staffRepository.ts"
import { StaffRepository as RdbStaffRepository } from "../src/server/infra/rdb/staffRepository.ts"
import { UserRepository } from "../src/server/infra/userRepository.ts"
import { UserRepository as RdbUserRepository } from "../src/server/infra/rdb/userRepository.ts"
import { DueRepository } from "../src/server/infra/dueRepository.ts"
import { DueRepository as RdbDueRepository } from "../src/server/infra/rdb/dueRepository.ts"
import { MasterRepository } from "../src/server/infra/masterRepository.ts"
import { MasterRepository as RdbMasterRepository } from "../src/server/infra/rdb/masterRepository.ts"

let BASE = "demo";

console.log("施設IDを入力してください(default:demo):");
const decoder = new TextDecoder();
for await (const chunk of Deno.stdin.readable) {
  BASE = decoder.decode(chunk);
  break
}


const department: Department[] = [
  {
    id: "01", name: "内科", exam: true
  },
  {
    id: "02", name: "外科", exam: true
  },
  {
    id: "03", name: "小児科", exam: true
  },
  {
    id: "04", name: "整形外科", exam: true
  },
  {
    id: "05", name: "耳鼻咽喉科", exam: true
  },
  {
    id: "06", name: "消化器内科", exam: true
  },
  {
    id: "07", name: "呼吸器内科", exam: true
  },
  {
    id: "20", name: "地域連携課", exam: false
  },
  {
    id: "21", name: "医療相談課", exam: false
  },
  {
    id: "30", name: "医事課", exam: false
  },
  {
    id: "9999", name: "外部施設", exam: false
  },
];

const dr: Dr[] = [
  {
    id: "0001", name: "山田　太郎", department: "01"
  },
  {
    id: "0002", name: "佐藤　次郎", department: "01"
  },
  {
    id: "0003", name: "鈴木　三郎", department: "06"
  },
  {
    id: "0004", name: "田中　史郎", department: "07"
  },
  {
    id: "0005", name: "山本　五郎", department: "04"
  },
  {
    id: "0006", name: "楠　正成", department: "05"
  },
  {
    id: "0007", name: "米田　七郎", department: "02"
  },
  {
    id: "0008", name: "桑原　八郎", department: "03"
  },
];

const user: AuthUser[] = [
  {
    id: "admin", name: "管理者　ユーザー",
    department: "20", base: BASE,
    authActivity: 2, authFacility: 2, authReferral: 2, authStatistics: 2,
    authMaster: 2, authWeb: 2,
    //Admin1!!!
    password: "TkegoFco96X3Zqg5GGfRt29KflG0eTu6mQuJu2RQGbc=",
    facilityId: "",
  },
  {
    id: "user", name: "一般　ユーザー",
    department: "30", base: BASE,
    authActivity: 0, authFacility: 1, authReferral: 2, authStatistics: 1,
    authMaster: 0, authWeb: 0,
    //User2???
    password: "vGqyfSoIP7R5sNBcaPMB5lcMUdQ8fznpPQp5+dgcMsY=",
    facilityId: "",
  },
  {
    id: "webuser", name: "Web　ユーザー",
    department: "9999", base: BASE,
    authActivity: 0, authFacility: 0, authReferral: 0, authStatistics: 0,
    authMaster: 0, authWeb: 1,
    //WebApp3###
    password: "xdBNl3nZ44i33qrb04j+Ej7VIU2aPV/+EX89vmZK4/A=",
    facilityId: "001",
  },
  {
    id: "webapp", name: "Web　予約",
    department: "9999", base: BASE,
    authActivity: 0, authFacility: 0, authReferral: 0, authStatistics: 0,
    authMaster: 0, authWeb: 0,
    password: "xdBNl3nZ44i33qrb04j+Ej7VIU2A9PV/+EX89vmZK4/A=",
    facilityId: "",
  },
];

const patient: Patient[] = [
  {
    id: "0001", lastName: "患者", firstName: "太郎",
    lastKana: "かんじゃ", firstKana: "たろう", sex: 0,
    birthday: "2000-01-12", tel: "086-422-0000",
    tel2: "",
    address: {postalCode: "100-0004", name: "東京都千代田区大手町",
      plus: "１－３－１０"}, memo: ""
  },
  {
    id: "0002", lastName: "患者", firstName: "次郎",
    lastKana: "かんじゃ", firstKana: "じろう", sex: 0,
    birthday: "2000-02-12", tel: "086-422-0001",
    tel2: "",
    address: {postalCode: "100-0004", name: "東京都千代田区大手町",
      plus: "１－３－１１"}, memo: ""
  },
  {
    id: "0003", lastName: "患者", firstName: "美津子",
    lastKana: "かんじゃ", firstKana: "みつこ", sex: 1,
    birthday: "2001-03-12", tel: "086-422-0002",
    tel2: "",
    address:{postalCode: "100-0004", name: "東京都千代田区大手町",
      plus: "１－３－１３"}, memo: ""
  },
  {
    id: "0004", lastName: "患者", firstName: "四子",
    lastKana: "かんじゃ", firstKana: "よんこ", sex: 1,
    birthday: "1990-04-12", tel: "086-422-0003",
    tel2: "",
    address: {postalCode: "100-0004", name: "東京都千代田区大手町",
      plus: "１－３－１３"}, memo: ""
  },
  {
    id: "0005", lastName: "患者", firstName: "五郎",
    lastKana: "かんじゃ", firstKana: "ごろう", sex: 0,
    birthday: "1960-05-02", tel: "086-422-0004",
    tel2: "",
    address: {postalCode: "100-0004", name: "東京都千代田区大手町",
      plus: "１－５－１３"}, memo: ""
  },
];

const facility: Facility[] = [
  {
    id: "001", name: "山田病院", nameCorp:"", kana: "やまだびょういん",
    tel: "086-123-4567", fax: "086-123-4568", email: "", attribute: "病院",
    address: {postalCode: "100-0004", name:"東京都千代田区大手町",
        plus:"１－１"}, memo: "", closedDate: "",
    createdAt: "2020-01-01",
    createdBy: {id:"00001", name: "管理者　ユーザー", department: "20"},
    updatedAt: "2020-01-01",
    updatedBy: {id:"00001", name: "管理者　ユーザー", department: "20"},
    contacts: [],
  },
  {
    id: "002", name: "山下クリニック", nameCorp:"", kana: "やましたくりにっく",
    tel: "086-123-4567", fax: "086-123-4568", email: "", attribute: "診療所",
    address: {postalCode: "100-0004", name:"東京都千代田区大手町",
        plus:"１－２"}, memo: "", closedDate: "",
    createdAt: "2020-01-01",
    createdBy: {id:"admin", name: "管理者　ユーザー", department: "20"},
    updatedAt: "2020-01-01",
    updatedBy: {id:"admin", name: "管理者　ユーザー", department: "20"},
    contacts: [],
  },
  {
    id: "003", name: "山本診療所", nameCorp:"", kana: "やまもとしんりょうじょ",
    tel: "086-123-4567", fax: "086-123-4568", email: "", attribute: "診療所",
    address: {postalCode: "100-0004", name:"東京都千代田区大手町",
        plus:"１－３"}, memo: "", closedDate: "",
    createdAt: "2020-01-01",
    createdBy: {id:"admin", name: "管理者　ユーザー", department: "20"},
    updatedAt: "2020-01-01",
    updatedBy: {id:"admin", name: "管理者　ユーザー", department: "20"},
    contacts: [],
  },
];

const staff: Staff[] = [
  {
    id: "1", name: "山田　太郎", kana: "ヤマダ　タロウ", department: "内科", dr: true,
    post: "院長", facilityId: "001", hidden: false, sort: 10,
    updatedAt: "2024-06-01T10:10:10", updatedBy: {id:"admin",name:"管理ユーザー",department:"20"}
  },
  {
    id: "2", name: "山田　花子", kana: "", department: "小児科", dr: true,
    post: "", facilityId: "001", hidden: false, sort: 20,
    updatedAt: "2024-06-01T10:10:10", updatedBy: {id:"admin",name:"管理ユーザー",department:"20"}
  },
  {
    id: "3", name: "山下　栗時", kana: "", department: "内科", dr: true,
    post: "院長", facilityId: "002", hidden: false, sort: 10,
    updatedAt: "2024-06-01T10:10:10", updatedBy: {id:"admin",name:"管理ユーザー",department:"20"}
  },
  {
    id: "4", name: "山本　春夫", kana: "", department: "内科", dr: true,
    post: "院長", facilityId: "003", hidden: false, sort: 10,
    updatedAt: "2024-06-01T10:10:10", updatedBy: {id:"admin",name:"管理ユーザー",department:"20"}
  },
];

const due: Due[] = [
  {id: 10, name: "当日", days: 0},
  {id: 20, name: "翌日", days: 1},
  {id: 30, name: "２日", days: 2},
  {id: 40, name: "３日", days: 3},
  {id: 50, name: "４日", days: 4},
  {id: 60, name: "５日", days: 5},
  {id: 70, name: "６日", days: 6},
  {id: 80, name: "７日", days: 7},
  {id: 90, name: "８日", days: 8},
  {id: 100, name: "９日", days: 9},
  {id: 110, name: "１０日", days: 10},
  {id: 120, name: "１１日", days: 11},
  {id: 130, name: "１２日", days: 12},
  {id: 140, name: "１３日", days: 13},
  {id: 150, name: "１４日", days: 14},
  {id: 160, name: "１ヶ月", days: 31},
  {id: 888, name: "緊急", days: -1},
  {id: 999, name: "なし", days: 9999},
];

const purpose = ["大腿骨", "脳卒中", "糖尿病", "その他"];

const kind = ["病院", "診療所", "特定機能病院", "地域医療支援病院", "歯科"];

const post = ["院長", "理事長", "副院長", "医師", "看護師", "ＭＳＷ", "事務"];

const means = ["FAX", "WEB", "TEL", "郵送", "来院", "当日"];

const classes = [
  {id: "1", name: "一報", done: false},
  {id: "2", name: "最終", done: true},
  {id: "3", name: "経過", done: false},
  {id: "4", name: "退院", done: false},
];

const facdept = [
  "内科", "消化器内科", "呼吸器内科", "糖尿病内科", "腎臓内科",
  "内分泌代謝科", "循環器内科", "脳神経内科",
  "小児科", "産婦人科", "外科", "整形外科", "形成外科", "呼吸器外科",
  "脳卒中科", "脳神経外科", "心臓血管外科", "眼科", "耳鼻咽喉科", "泌尿器科",
  "皮膚科", "歯科", "リハビリ科", "精神科", "心療内科"];


async function main(){
  let departmentRepository;
  let drRepository;
  let facilityRepository;
  let patientRepository;
  let staffRepository;
  let userRepository;
  let dueRepository;
  let masterRepository;
  let classRepository;

  const dbType = Deno.env.get(DB_TYPE);
  if(dbType === "postgresql"){
    departmentRepository = new RdbDepartmentRepository(BASE);
    drRepository = new RdbDrRepository(BASE);
    facilityRepository = new RdbFacilityRepository(BASE);
    patientRepository = new RdbPatientRepository(BASE);
    staffRepository = new RdbStaffRepository(BASE);
    userRepository = new RdbUserRepository(BASE);
    dueRepository = new RdbDueRepository(BASE);
    classRepository = new RdbClassificationRepository(BASE);
    masterRepository = new RdbMasterRepository(BASE);
  }else{
    departmentRepository = new DepartmentRepository(BASE);
    drRepository = new DrRepository(BASE);
    facilityRepository = new FacilityRepository(BASE);
    patientRepository = new PatientRepository(BASE);
    staffRepository = new StaffRepository(BASE);
    userRepository = new UserRepository(BASE);
    dueRepository = new DueRepository(BASE);
    classRepository = new ClassificationRepository(BASE);
    masterRepository = new MasterRepository(BASE);
  }

  console.log("classification create ...");
  for await (const d of classes){
    await classRepository.insert(d);
  }
  console.log("classification end");
  console.log("department create ...");
  for await (const d of department){
    await departmentRepository.insert(d);
  }
  console.log("department end");
  console.log("dr create ...");
  for await (const d of dr){
    await drRepository.insert(d);
  }
  console.log("dr end");
  console.log("facility create ...");
  for await (const d of facility){
    await facilityRepository.insert(d);
  }
  console.log("facility end");
  console.log("patient create ...");
  for await (const d of patient){
    await patientRepository.insert(d);
  }
  console.log("patient end");
  console.log("staff create ...");
  for await (const d of staff){
    await staffRepository.insert(d);
  }
  console.log("staff end");
  console.log("user create ...");
  for await (const d of user){
    await userRepository.insert(d);
  }
  console.log("user end");
  console.log("due create ...");
  for await (const d of due){
    await dueRepository.insert(d);
  }
  console.log("due end");
  console.log("purpose create ...");
  await masterRepository.update(masterRepository.KEY_PURPOSE, purpose);
  console.log("purpose end");
  console.log("kind create ...");
  await masterRepository.update(masterRepository.KEY_KIND, kind);
  console.log("kind end");
  console.log("post create ...");
  await masterRepository.update(masterRepository.KEY_POST, post);
  console.log("post end");
  console.log("means create ...");
  await masterRepository.update(masterRepository.KEY_MEANS, means);
  console.log("means end");
  console.log("facdept create ...");
  await masterRepository.update(masterRepository.KEY_FACDEPT, facdept);
  console.log("facdept end");
}

if (import.meta.main) {
  await main();
}