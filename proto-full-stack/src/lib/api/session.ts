import type { UserRole } from '../../shared/auth/access'
import { api } from './client'
export type AuthSession = {role:UserRole;username:string;actorId?:string;name?:string}
export async function login(username:string,password:string):Promise<AuthSession>{return api('auth/session',{method:'POST',body:JSON.stringify({username,password})})}
export async function logout():Promise<void>{await api('auth/session',{method:'DELETE'})}
