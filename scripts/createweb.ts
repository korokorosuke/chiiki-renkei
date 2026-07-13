/// <reference lib="deno.unstable" />
import { KV_PATH } from "./setting.ts"
import type { WebDepartment } from "../src/server/domain/webDepartment.ts"
import type { WebDr } from "../src/server/domain/webDr.ts"
import type { WebMaster } from "../src/server/domain/webMaster.ts"

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


const BASE = "demo";

async function main(){
    //const kv = await Deno.openKv();
    const kv = await Deno.openKv(KV_PATH);
    console.log("department create ...");
    department.forEach(async (d)=>{
        await kv.set([BASE, "webdept", d.id], d);
    });
    console.log("department end");
    console.log("dr create ...");
    dr.forEach(async (d)=>{
        await kv.atomic()
            .set([BASE, "webdr", d.id], d)
            .set([BASE, "webdr_dept", d.department, d.id], d)
            .commit();
    });
    console.log("dr end");
    console.log("master create ...");
    master.forEach(async (d)=>{
        await kv.set([BASE, "webmaster", d.dept, d.dr, d.week], d);
    });
    console.log("master end");
    kv.close();
}

await main();