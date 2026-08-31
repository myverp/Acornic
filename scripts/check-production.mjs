const appUrl = new URL(process.env.ACORNIC_URL ?? "https://acornic.vercel.app");

async function request(pathname, options = {}) {
  return fetch(new URL(pathname, appUrl), {
    redirect: "manual",
    ...options,
  });
}

const home = await request("/");
if (!home.ok) {
  throw new Error(`Homepage returned ${home.status}.`);
}

const homeBody = await home.text();
if (!homeBody.includes("Acornic")) {
  throw new Error("Homepage response does not contain the Acornic application marker.");
}

const dashboard = await request("/dashboard");
if (![301, 302, 303, 307, 308].includes(dashboard.status)) {
  throw new Error(`Anonymous dashboard request returned ${dashboard.status}.`);
}

const redirectLocation = dashboard.headers.get("location");
const loginUrl = redirectLocation ? new URL(redirectLocation, appUrl) : null;
if (
  loginUrl?.pathname !== "/login" ||
  loginUrl.searchParams.get("next") !== "/dashboard"
) {
  throw new Error("Anonymous dashboard request did not redirect to login.");
}

console.log(`Production smoke passed for ${appUrl.origin}.`);
