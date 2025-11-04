import { Page, expect } from '@playwright/test';

export default class UdemySearchPage {
  constructor(private readonly page: Page) {}

  private readonly seletores = {
    busca: 'input[name="q"], input[aria-label*="Search"]',
    resultados: '[data-testid="search-result"], a[href^="/course/"]',
    addCarrinho:
      '[data-testid="add-to-cart-button"], button:has-text("Add to cart"), button:has-text("Adicionar ao carrinho")',
    irCarrinho:
      '[data-testid="shopping-cart-button"], [data-purpose="go-to-cart-button"]',
    itemCarrinho: '[data-testid="cart-item"], [data-purpose="cart-list"]',
  };

  async buscarCurso(termo: string): Promise<void> {
    const campoBusca = this.page.locator(this.seletores.busca);
    await expect(campoBusca).toBeVisible({ timeout: 10000 });
    await campoBusca.fill(termo);
    await campoBusca.press('Enter');
    await expect(this.page.locator(this.seletores.resultados)).toBeVisible({ timeout: 15000 });
  }

  async clicarPrimeiroCurso(): Promise<void> {
    const curso = this.page.locator(this.seletores.resultados).first();
    await expect(curso).toBeVisible({ timeout: 15000 });
    await curso.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async adicionarAoCarrinho(): Promise<void> {
    const botao = this.page.locator(this.seletores.addCarrinho).first();
    await expect(botao).toBeVisible({ timeout: 15000 });
    await Promise.all([
      this.page.waitForResponse(resp =>
        resp.url().includes('/api-2.0/shopping-carts') &&
        ['POST', 'PUT'].includes(resp.request().method())
      ).catch(() => null),
      botao.click(),
    ]);
  }

  async irParaCarrinho(): Promise<void> {
    const botao = this.page.locator(this.seletores.irCarrinho).first();
    await expect(botao).toBeVisible({ timeout: 10000 });
    await botao.click();
    await expect(this.page).toHaveURL(/cart/, { timeout: 15000 });
  }

  async validarCarrinho(): Promise<void> {
    await expect(this.page).toHaveURL(/cart/);
    const itens = this.page.locator(this.seletores.itemCarrinho);
    await expect(itens.first()).toBeVisible({ timeout: 10000 });
    expect(await itens.count()).toBeGreaterThan(0);
  }
}
