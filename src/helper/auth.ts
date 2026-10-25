import { redirect } from "@tanstack/solid-router"
import type { Base } from "../server/domain/base.ts"

export function authenticate(base: Base, pred: boolean): boolean {
  if(pred){
    return true;
  }
  throw redirect({
    to: "/login/{-$base}", params: { base: base.id }
  });
}