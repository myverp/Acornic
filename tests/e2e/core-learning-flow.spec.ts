import { expect, test, type APIRequestContext } from "@playwright/test";

const mailpitUrl = process.env.MAILPIT_URL ?? "http://127.0.0.1:56324";

type MailpitRecipient = { Address?: string };
type MailpitMessage = {
  ID: string;
  To?: MailpitRecipient[];
};

function findConfirmationUrl(message: Record<string, unknown>): string | null {
  const body = [message.HTML, message.Text]
    .filter((value): value is string => typeof value === "string")
    .join("\n")
    .replaceAll("&amp;", "&");
  const match = body.match(/https?:\/\/[^"'\s<>]+\/auth\/v1\/verify[^"'\s<>]*/);

  return match?.[0] ?? null;
}

async function waitForConfirmationUrl(
  request: APIRequestContext,
  email: string,
): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const messagesResponse = await request.get(`${mailpitUrl}/api/v1/messages`);
    expect(messagesResponse.ok()).toBeTruthy();

    const messages = (await messagesResponse.json()) as {
      messages?: MailpitMessage[];
    };
    const emailMessage = messages.messages?.find((message) =>
      message.To?.some(
        (recipient) => recipient.Address?.toLowerCase() === email.toLowerCase(),
      ),
    );

    if (emailMessage) {
      const messageResponse = await request.get(
        `${mailpitUrl}/api/v1/message/${emailMessage.ID}`,
      );
      expect(messageResponse.ok()).toBeTruthy();

      const confirmationUrl = findConfirmationUrl(
        (await messageResponse.json()) as Record<string, unknown>,
      );
      if (confirmationUrl) {
        return confirmationUrl;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`No confirmation email arrived for ${email}.`);
}

test("public landing page renders and dashboard redirects anonymous visitors", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Grow the words you want to remember." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Create account" })).toBeVisible();

  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard$/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});

test("a confirmed user can create a card and record a review", async ({
  page,
  request,
}) => {
  const email = `smoke-${Date.now()}@example.test`;
  const password = "SmokeTestPassword1";

  await page.goto("/sign-up");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText("Check your email to confirm your account.")).toBeVisible();

  await page.goto(await waitForConfirmationUrl(request, email));
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard$/);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByRole("link", { name: "Decks", exact: true }).click();
  await page.getByLabel("Deck title").fill("Smoke test deck");
  await page.getByLabel("Language you know").fill("en");
  await page.getByLabel("Language to learn").fill("uk");
  await page.getByRole("button", { name: "Create deck" }).click();
  await expect(page).toHaveURL(/\/dashboard\/decks\/[^/?]+(?:\?[^#]*)?$/);

  await page.getByLabel("Word or phrase").fill("hello");
  await page.getByLabel("Translation").fill("привіт");
  await page.getByRole("button", { name: "Add card" }).click();
  await expect(page.getByText("привіт", { exact: true })).toBeVisible();

  await page.getByRole("link", { name: "Review", exact: true }).click();
  await page.getByRole("button", { name: "Reveal answer" }).click();
  await page.getByRole("button", { name: "Good" }).click();
  await expect(page.getByText("Review recorded.")).toBeVisible();
  await expect(page.getByText("Reviewed in 24 hours")).toBeVisible();
});
