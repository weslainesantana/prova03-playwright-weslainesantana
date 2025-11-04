import { test, expect } from '@playwright/test';

test.describe('Udemy - Busca e Carrinho', () => {
  test('Buscar curso React e adicionar ao carrinho', async ({ page, context }) => {

    // Teste 1: Acessa a página inicial
    await page.goto('https://www.udemy.com/?persist_locale=1&locale=en_US', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    // Teste 2: Fecha banner de cookies (se aparecer)
    const cookieButton = page.locator(
      [
        'button:has-text("Accept")',
        'button:has-text("Accept all")',
        'button:has-text("Allow all")',
        'button:has-text("Agree")',
        'button:has-text("Aceitar")',
      ].join(', ')
    );
    if (await cookieButton.isVisible().catch(() => false)) await cookieButton.click().catch(() => {});

    // Teste 3: Pesquisa pelo curso "React"
    const searchInput = page.locator('input[name="q"], [aria-label*="Search"], [data-testid="search-input"]').first();
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await searchInput.fill('React');
    await searchInput.press('Enter');

    // Teste 4: Espera resultados e clica no primeiro curso
    await expect(page).toHaveURL(/courses\/search/, { timeout: 20000 });
    const firstCourse = page.locator('a[href^="/course/"]').first();
    await firstCourse.waitFor({ state: 'visible', timeout: 20000 });

    const [newTab] = await Promise.all([
      context.waitForEvent('page').catch(() => null),
      firstCourse.click(),
    ]);
    const coursePage = newTab ?? page;
    await coursePage.waitForURL('**/course/**', { timeout: 30000 });

    // Teste 5: Adiciona ao carrinho ou vai direto se já estiver adicionado
    const addToCartBtn = coursePage.locator(
      [
        '[data-purpose="add-to-cart"]',
        '[data-purpose="buy-this-course-button"]',
        'button:has-text("Add to cart")',
        'button:has-text("Adicionar ao carrinho")',
        'button:has-text("Go to cart")',
        'button:has-text("Enroll now")',
      ].join(', ')
    ).first();

    await addToCartBtn.waitFor({ state: 'visible', timeout: 15000 });
    const label = (await addToCartBtn.innerText().catch(() => '')).toLowerCase();

    if (label.includes('go to cart')) {
      await addToCartBtn.click();
    } else {
      await Promise.all([
        coursePage.waitForResponse(resp =>
          resp.url().includes('/api-2.0/shopping-carts') &&
          ['POST', 'PUT'].includes(resp.request().method())
        ).catch(() => null),
        addToCartBtn.click(),
      ]);
    }

    // Teste 6: Abre carrinho via modal ou navega manualmente
    const goToCart = coursePage.locator(
      [
        '[data-purpose="go-to-cart-button"]',
        'a:has-text("Go to cart")',
        'a:has-text("Ir para o carrinho")',
        'button:has-text("Go to cart")',
      ].join(', ')
    ).first();

    if (await goToCart.isVisible({ timeout: 4000 }).catch(() => false)) {
      await goToCart.click();
    } else {
      await coursePage.goto('https://www.udemy.com/cart/', { waitUntil: 'domcontentloaded' });
    }

    // Teste 7: Valida que está na página do carrinho
    await expect(coursePage).toHaveURL(/cart/, { timeout: 20000 });
    await expect(coursePage.getByRole('heading', { name: /cart|carrinho/i })).toBeVisible({ timeout: 10000 });
  });
});
