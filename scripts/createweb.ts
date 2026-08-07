/// <reference lib="deno.unstable" />
import { DB_TYPE } from "../src/server/settings.ts"
import type { WebDepartment } from "../src/server/domain/webDepartment.ts"
import type { WebDr } from "../src/server/domain/webDr.ts"
import type { WebMaster } from "../src/server/domain/webMaster.ts"
import { WebDepartmentRepository } from "../src/server/infra/webDepartmentRepository.ts"
import { WebDepartmentRepository as RdbWebDepartmentRepository } from "../src/server/infra/rdb/webDepartmentRepository.ts"
import { WebDrRepository } from "../src/server/infra/webDrRepository.ts"
import { WebDrRepository as RdbWebDrRepository } from "../src/server/infra/rdb/webDrRepository.ts"
import { WebMasterRepository } from "../src/server/infra/webMasterRepository.ts"
import { WebMasterRepository as RdbWebMasterRepository } from "../src/server/infra/rdb/webMasterRepository.ts"

const department: WebDepartment[] = [
  {
    id: "01", name: "内科", description: "一般内科"
  },
  {
    id: "06", name: "消化器内科", description: ""
  },
  {
    id: "07", name: "呼吸器内科", description: ""
  },
  {
    id: "04", name: "整形外科", description: ""
  },
];

const dr: WebDr[] = [
  {
    id: "0001", name: "山田　太郎", displayName: "山田　太郎", department: "01"
  },
  {
    id: "0002", name: "佐藤　次郎", displayName: "佐藤　次郎", department: "01"
  },
  {
    id: "0003", name: "鈴木　三郎", displayName: "鈴木　三郎", department: "06"
  },
  {
    id: "0004", name: "田中　史郎", displayName: "田中　史郎", department: "07"
  },
  {
    id: "0005", name: "山本　五郎", displayName: "山本　五郎", department: "04"
  },
];

const master: WebMaster[] = [
  {
    dept: "01", dr: "0001", week: 1, reservs: [
      { time: "09:00", max: 2 },
      { time: "09:30", max: 2 },
      { time: "10:00", max: 2 },
      { time: "10:30", max: 2 },
      { time: "11:00", max: 2 },
      { time: "11:30", max: 2 },
    ],
  },
  {
    dept: "01", dr: "0001", week: 2, reservs: [
      { time: "09:00", max: 2 },
      { time: "09:30", max: 2 },
      { time: "10:00", max: 2 },
      { time: "10:30", max: 2 },
      { time: "11:00", max: 2 },
      { time: "11:30", max: 2 },
    ],
  },
  {
    dept: "01", dr: "0001", week: 3, reservs: [
      { time: "09:00", max: 2 },
      { time: "09:30", max: 2 },
      { time: "10:00", max: 2 },
      { time: "10:30", max: 2 },
      { time: "11:00", max: 2 },
      { time: "11:30", max: 2 },
    ],
  },
  {
    dept: "01", dr: "0001", week: 4, reservs: [
      { time: "09:00", max: 2 },
      { time: "09:30", max: 2 },
      { time: "10:00", max: 2 },
      { time: "10:30", max: 2 },
      { time: "11:00", max: 2 },
      { time: "11:30", max: 2 },
    ],
  },
  {
    dept: "01", dr: "0001", week: 5, reservs: [
      { time: "09:00", max: 2 },
      { time: "09:30", max: 2 },
      { time: "10:00", max: 2 },
      { time: "10:30", max: 2 },
      { time: "11:00", max: 2 },
      { time: "11:30", max: 2 },
    ],
  },
  {
    dept: "01", dr: "0002", week: 1, reservs: [
      { time: "14:00", max: 2 },
      { time: "14:30", max: 2 },
      { time: "15:00", max: 2 },
      { time: "15:30", max: 2 },
      { time: "16:00", max: 2 },
      { time: "16:30", max: 2 },
    ],
  },
  {
    dept: "01", dr: "0002", week: 2, reservs: [
      { time: "14:00", max: 2 },
      { time: "14:30", max: 2 },
      { time: "15:00", max: 2 },
      { time: "15:30", max: 2 },
      { time: "16:00", max: 2 },
      { time: "16:30", max: 2 },
    ],
  },
  {
    dept: "01", dr: "0002", week: 3, reservs: [
      { time: "14:00", max: 2 },
      { time: "14:30", max: 2 },
      { time: "15:00", max: 2 },
      { time: "15:30", max: 2 },
      { time: "16:00", max: 2 },
      { time: "16:30", max: 2 },
    ],
  },
  {
    dept: "01", dr: "0002", week: 4, reservs: [
      { time: "14:00", max: 2 },
      { time: "14:30", max: 2 },
      { time: "15:00", max: 2 },
      { time: "15:30", max: 2 },
      { time: "16:00", max: 2 },
      { time: "16:30", max: 2 },
    ],
  },
  {
    dept: "01", dr: "0002", week: 5, reservs: [
      { time: "14:00", max: 2 },
      { time: "14:30", max: 2 },
      { time: "15:00", max: 2 },
      { time: "15:30", max: 2 },
      { time: "16:00", max: 2 },
      { time: "16:30", max: 2 },
    ],
  },
  {
    dept: "06", dr: "0003", week: 1, reservs: [
      { time: "09:00", max: 2 },
      { time: "09:30", max: 2 },
      { time: "10:00", max: 2 },
      { time: "10:30", max: 2 },
      { time: "11:00", max: 2 },
      { time: "11:30", max: 2 },
    ],
  },
  {
    dept: "07", dr: "0004", week: 3, reservs: [
      { time: "09:00", max: 2 },
      { time: "09:30", max: 2 },
      { time: "10:00", max: 2 },
      { time: "10:30", max: 2 },
      { time: "11:00", max: 2 },
      { time: "11:30", max: 2 },
    ],
  },
  {
    dept: "04", dr: "0005", week: 5, reservs: [
      { time: "09:00", max: 2 },
      { time: "09:30", max: 2 },
      { time: "10:00", max: 2 },
      { time: "10:30", max: 2 },
      { time: "11:00", max: 2 },
      { time: "11:30", max: 2 },
    ],
  },
]


let BASE = "demo";

console.log("施設IDを入力してください(default:demo):");
const decoder = new TextDecoder();
for await (const chunk of Deno.stdin.readable) {
  BASE = decoder.decode(chunk);
  break
}

async function main(){
  let departmentRepository;
  let drRepository;
  let masterRepository;

  const dbType = Deno.env.get(DB_TYPE);
  if(dbType === "postgresql"){
    departmentRepository = new RdbWebDepartmentRepository(BASE);
    drRepository = new RdbWebDrRepository(BASE);
    masterRepository = new RdbWebMasterRepository(BASE);
  }else{
    departmentRepository = new WebDepartmentRepository(BASE);
    drRepository = new WebDrRepository(BASE);
    masterRepository = new WebMasterRepository(BASE);
  }

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
  console.log("master create ...");
  for await (const d of master){
    await masterRepository.insert(d);
  }
  console.log("master end");
}

if (import.meta.main) {
  await main();
}