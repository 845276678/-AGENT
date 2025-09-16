export function required(v: string, msg = '必填'){ return v && v.trim().length > 0 ? null : msg; }
export function minLength(v: string, n: number, msg?: string){ return v && v.trim().length >= n ? null : (msg || `至少 ${n} 个字符`); }
export function isPositiveNumber(v: string, msg = '请输入正数'){ const num = Number(v); return Number.isFinite(num) && num > 0 ? null : msg; }