export const AUTH_COOKIE_NAME = "relocation-auth";
export const AUTH_COOKIE_VALUE = "ok";

export function isAuthedCookieValid(value: string | undefined): boolean {
  return value === AUTH_COOKIE_VALUE;
}

export function getDashboardPassword(): string {
  return process.env.DASHBOARD_PASSWORD ?? "3991";
}
