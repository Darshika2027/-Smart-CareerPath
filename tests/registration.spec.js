import { test, expect } from "@playwright/test";

const testUser = {
  id: "11111111-1111-4111-8111-111111111111",
  aud: "authenticated",
  role: "authenticated",
  email: "student@example.com",
  email_confirmed_at: null,
  phone: "",
  app_metadata: {
    provider: "email",
    providers: ["email"],
  },
  user_metadata: {
    display_name: "Test Student",
  },
  identities: [
    {
      identity_id: "22222222-2222-4222-8222-222222222222",
      id: "student@example.com",
      user_id: "11111111-1111-4111-8111-111111111111",
      identity_data: {
        email: "student@example.com",
      },
      provider: "email",
      created_at: "2026-11-21T00:00:00.000Z",
      updated_at: "2026-11-21T00:00:00.000Z",
    },
  ],
  created_at: "2026-11-21T00:00:00.000Z",
  updated_at: "2026-11-21T00:00:00.000Z",
};

async function mockSignup(page, response, status = 200) {
  await page.route("**/auth/v1/signup**", async (route) => {
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });
}

async function fillValidForm(page) {
  await page.getByLabel("Full Name").fill("Test Student");
  await page.getByLabel("Email Address").fill("student@example.com");
  await page.getByLabel("Password", { exact: true }).fill("CareerPath123");
  await page.getByRole("textbox", { name: "Confirm Password" }).fill("CareerPath123");
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("01 - Registration page loads successfully", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: /Create your account/i })
  ).toBeVisible();

  await expect(page.getByLabel("Full Name")).toBeVisible();
  await expect(page.getByLabel("Email Address")).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Confirm Password" })).toBeVisible();

  await expect(
    page.getByRole("button", { name: /Create Student Account/i })
  ).toBeVisible();
});

test("02 - Required fields validation works", async ({ page }) => {
  await page.getByRole("button", {
    name: /Create Student Account/i,
  }).click();

  const fullName = page.getByLabel("Full Name");

  await expect.poll(() =>
    fullName.evaluate((element) => element.validity.valueMissing)
  ).toBe(true);
});

test("03 - Password requirements validation works", async ({ page }) => {
  await page.getByLabel("Full Name").fill("Test Student");
  await page.getByLabel("Email Address").fill("student@example.com");
  await page.getByLabel("Password", { exact: true }).fill("short");
  await page.getByRole("textbox", { name: "Confirm Password" }).fill("short");

  await page.getByRole("button", {
    name: /Create Student Account/i,
  }).click();

  await expect(
    page.getByText("Please meet all password requirements.")
  ).toBeVisible();
});

test("04 - Password mismatch validation works", async ({ page }) => {
  await page.getByLabel("Full Name").fill("Test Student");
  await page.getByLabel("Email Address").fill("student@example.com");
  await page.getByLabel("Password", { exact: true }).fill("CareerPath123");
  await page.getByRole("textbox", { name: "Confirm Password" }).fill("Different123");

  await expect(page.getByText("Passwords do not match.")).toBeVisible();

  await page.getByRole("button", {
    name: /Create Student Account/i,
  }).click();

  await expect(
    page.getByText("Your passwords do not match.")
  ).toBeVisible();
});

test("05 - Successful registration response is handled", async ({ page }) => {
  let receivedRequest;

  await page.route("**/auth/v1/signup**", async (route) => {
    receivedRequest = route.request().postDataJSON();

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ user: testUser, session: null }),
    });
  });

  await fillValidForm(page);

  await page.getByRole("button", {
    name: /Create Student Account/i,
  }).click();

  await expect(
    page.getByText(/Registration received! Please check your email/i)
  ).toBeVisible();

  expect(receivedRequest.email).toBe("student@example.com");
  expect(receivedRequest.password).toBe("CareerPath123");
  expect(receivedRequest.data.display_name).toBe("Test Student");

  await expect(page.getByLabel("Full Name")).toHaveValue("");
});

test("06 - Duplicate email response is handled", async ({ page }) => {
  const duplicateUser = {
    ...testUser,
    identities: [],
  };

  await mockSignup(page, { user: duplicateUser, session: null });

  await fillValidForm(page);

  await page.getByRole("button", {
    name: /Create Student Account/i,
  }).click();

  await expect(
    page.getByText(/account with this email may already exist/i)
  ).toBeVisible();
});

test("07 - Supabase server error is displayed", async ({ page }) => {
  await mockSignup(
    page,
    {
      code: "signup_disabled",
      message: "Signup is temporarily unavailable.",
    },
    400
  );

  await fillValidForm(page);

  await page.getByRole("button", {
    name: /Create Student Account/i,
  }).click();

  await expect(
    page.getByText("Signup is temporarily unavailable.")
  ).toBeVisible();
});
