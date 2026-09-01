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

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
});

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

test("a confirmed user can import starter cards and record a review", async ({
  page,
  request,
}) => {
  const email = `smoke-${Date.now()}@example.test`;
  const password = "SmokeTestPassword1";

  await page.goto("/sign-up");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(
    page.getByText(
      "Check your email to continue. If you already have an account, log in.",
    ),
  ).toBeVisible();

  await page.goto(await waitForConfirmationUrl(request, email));
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard$/);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/onboarding$/);
  await expect(
    page.getByRole("heading", { name: "Choose your languages" }),
  ).toBeVisible();
  const knownLanguages = page.getByRole("group", {
    name: "Languages you know",
  });
  const learningLanguages = page.getByRole("group", {
    name: "Languages you want to learn",
  });
  const english = knownLanguages.getByRole("checkbox", { name: "English en" });
  const german = learningLanguages.getByRole("checkbox", { name: "German de" });

  await english.check();
  await expect(english).toBeChecked();
  await german.check();
  await expect(german).toBeChecked();
  await page.getByRole("button", { name: "Continue to Acornic" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByRole("link", { name: "Decks", exact: true }).click();
  await page.getByLabel("Deck title").fill("Smoke test deck");
  await page.getByLabel("Language you know").selectOption("en");
  await page.getByLabel("Language to learn").selectOption("de");
  await page.getByRole("button", { name: "Create deck" }).click();
  await expect(page).toHaveURL(/\/dashboard\/decks\/[^/?]+(?:\?[^#]*)?$/);

  await page.getByRole("button", { name: "Add 100 starter cards" }).click();
  await expect(page.getByText("Added 100 starter cards.")).toBeVisible();
  await page.getByRole("button", { name: "Add 100 starter cards" }).click();
  await expect(
    page.getByText("All 100 starter cards are already in this deck."),
  ).toBeVisible();

  await page.getByLabel("Word or phrase").fill("practice");
  await page.getByLabel("Translation").fill("Übung");
  await page.getByRole("button", { name: "Add card" }).click();
  await expect(page.getByText("Übung", { exact: true })).toBeVisible();

  await page.getByRole("link", { name: "Cards", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard\/cards$/);
  await expect(page.getByText("hello", { exact: true })).toBeVisible();
  await expect(page.getByText("Hallo", { exact: true })).toBeVisible();
  await expect(page.getByText("Übung", { exact: true })).toBeVisible();

  await page.getByRole("link", { name: "Review", exact: true }).click();
  await page.getByRole("button", { name: "Reveal answer" }).click();
  await page.getByRole("button", { name: "Good" }).click();
  await expect(page.getByText("Review recorded.")).toBeVisible();
  await expect(page.getByText("Reviewed in 24 hours")).toBeVisible();
});
