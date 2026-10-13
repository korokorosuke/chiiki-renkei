import type { Accessor } from "solid-js"
import { useQuery } from "@tanstack/solid-query"
import { getDepartments, getAllDepartments } from "../../server/func/department.ts"
import { getWebDepartments } from "../../server/func/webDepartment.ts"
import { getWebDrs, getAllWebDrs } from "../../server/func/webDr.ts"

export function getDeptsQuery(){
  return useQuery(() => ({
    queryKey: ["departments", "exam"],
    queryFn: ()=>getDepartments(),
  }));
}

export function getAllDeptsQuery(){
  return useQuery(() => ({
    queryKey: ["departments"],
    queryFn: ()=>getAllDepartments(),
  }));
}

export function getWebDeptsQuery(){
  return useQuery(() => ({
    queryKey: ["web-depts"],
    queryFn: ()=>getWebDepartments(),
  }));
}

export function getWebDrsQuery(dept: Accessor<string>){
  return useQuery(() => ({
    queryKey: ["web-drs", dept()],
    queryFn: ()=>getWebDrs({data: {dept: dept()}}),
  }));
}

export function getWebAllDrsQuery(){
  return useQuery(() => ({
    queryKey: ["web-drs"],
    queryFn: ()=>getAllWebDrs(),
  }));
}