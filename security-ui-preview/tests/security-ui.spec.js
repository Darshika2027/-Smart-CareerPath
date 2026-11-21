import { test, expect } from '@playwright/test';

// TEST 1 - Dashboard loads successfully

test('Dashboard loads successfully', async ({ page }) => {

  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Security & Access' })
  ).toBeVisible();

  await expect(
    page.getByText('DEMO PREVIEW')
  ).toBeVisible();

});

// TEST 2 - Dashboard sections and cards

test('All security sections are displayed', async ({ page }) => {

  await page.goto('/');

  await expect(page.locator('.stat-card')).toHaveCount(4);

  await expect(
    page.getByRole('heading', { name: 'Authentication', exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole('heading', { name: 'Student Data Protection' })
  ).toBeVisible();

  await expect(
    page.getByRole('heading', { name: 'Role & Access' })
  ).toBeVisible();

  await expect(
    page.getByRole('heading', { name: 'Security Verification' })
  ).toBeVisible();

  await expect(
    page.getByRole('heading', { name: 'Quick Actions' })
  ).toBeVisible();

});

// TEST 3 - Student photo and security banner

test('Dashboard images load successfully', async ({ page }) => {

  await page.goto('/');

  const avatarLoaded = await page
    .locator('.user-profile img')
    .evaluate(img => img.complete && img.naturalWidth > 0);

  const bannerLoaded = await page
    .locator('.hero-visual img')
    .evaluate(img => img.complete && img.naturalWidth > 0);

  expect(avatarLoaded).toBe(true);
  expect(bannerLoaded).toBe(true);

});

// TEST 4 - View Details button

test('View Details opens the correct panel', async ({ page }) => {

  await page.goto('/');

  await page.locator('.security-panel')
    .filter({
      has: page.getByRole('heading', {
        name: 'Student Data Protection'
      })
    })
    .getByRole('button', { name: /View Details/ })
    .click();

  await expect(
    page.getByRole('dialog')
      .getByRole('heading', { name: 'Student Data Protection' })
  ).toBeVisible();

  await page.getByRole('button', { name: 'Got it' }).click();

  await expect(page.getByRole('dialog')).toHaveCount(0);

});

// TEST 5 - Quick Action buttons

test('Quick Action buttons work', async ({ page }) => {

  await page.goto('/');

  await expect(
    page.locator('.quick-action')
  ).toHaveCount(4);

  const actions = [
    'Manage Access Policies',
    'View Security Test Results',
    'Review Access Logs',
    'Security Settings'
  ];

  for (const action of actions) {

    await page.getByRole('button', { name: action }).click();

    await expect(
      page.getByRole('dialog')
        .getByRole('heading', { name: action })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Got it' }).click();
  }

});

// TEST 6 - Dashboard search

test('Dashboard search finds security panels', async ({ page }) => {

  await page.goto('/');

  await page.getByRole('searchbox', {
    name: 'Search dashboard panels'
  }).fill('Student Data');

  await page.getByRole('option', {
    name: 'Student Data Protection'
  }).click();

  await expect(
    page.getByRole('dialog')
      .getByRole('heading', { name: 'Student Data Protection' })
  ).toBeVisible();

});

// TEST 7 - Notification button

test('Notification button opens its preview', async ({ page }) => {

  await page.goto('/');

  await page.getByRole('button', {
    name: 'Notifications'
  }).click();

  await expect(
    page.getByText('These are example notifications', {
      exact: false
    })
  ).toBeVisible();

});

// TEST 8 - Laptop screen layout

test('Dashboard fits laptop screen without page scrolling', async ({ page }) => {

  await page.setViewportSize({
    width: 1366,
    height: 600
  });

  await page.goto('/');

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerHeight,
    pageHeight: document.documentElement.scrollHeight
  }));

  expect(dimensions.pageHeight).toBeLessThanOrEqual(
    dimensions.viewport + 2
  );

  await expect(
    page.getByRole('heading', { name: 'Quick Actions' })
  ).toBeInViewport();

  await expect(
    page.locator('.dashboard-footer')
  ).toBeInViewport();

});

// TEST 9 - Mobile navigation

test('Mobile navigation works', async ({ page }) => {

  await page.setViewportSize({
    width: 390,
    height: 844
  });

  await page.goto('/');

  await page.getByRole('button', {
    name: 'Open navigation'
  }).click();

  await expect(
    page.locator('.sidebar.sidebar-open')
  ).toBeVisible();

  await page.getByRole('button', {
    name: 'Dashboard',
    exact: true
  }).click();

  await expect(
    page.getByRole('dialog')
      .getByRole('heading', { name: 'Dashboard' })
  ).toBeVisible();

});

// TEST 10 - JavaScript runtime errors

test('Dashboard has no JavaScript runtime errors', async ({ page }) => {

  const errors = [];

  page.on('pageerror', error => {
    errors.push(error.message);
  });

  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Security & Access' })
  ).toBeVisible();

  expect(errors).toEqual([]);

});


