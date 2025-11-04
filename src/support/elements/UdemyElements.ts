import { Locator, Page } from '@playwright/test';

export default class UdemyElements {
  constructor(readonly page: Page) {}

  // ===== BUSCA =====
  getCampoBusca(): Locator {
    return this.page.locator('input[name="q"], input[aria-label*="Search"]');
  }

  getBotaoBuscar(): Locator {
    return this.page.locator('button[type="submit"]');
  }

  getListaResultados(): Locator {
    return this.page.locator('[data-testid="search-result"], a[href^="/course/"]');
  }

  // ===== CURSO =====
  getBotaoAddCarrinho(): Locator {
    return this.page.locator(
      '[data-testid="add-to-cart-button"], button:has-text("Add to cart"), button:has-text("Adicionar ao carrinho")'
    );
  }

  getBotaoIrCarrinho(): Locator {
    return this.page.locator(
      '[data-testid="go-to-cart-button"], [data-testid="shopping-cart-button"]'
    );
  }

  getTituloCurso(): Locator {
    return this.page.locator('h1[data-purpose="lead-title"]').first();
  }

  // ===== CARRINHO =====
  getContainerCarrinho(): Locator {
    return this.page.locator('[data-testid="cart-container"], [data-purpose="cart-list"]');
  }

  getItensCarrinho(): Locator {
    return this.page.locator('[data-testid="cart-item"]');
  }

  getBotaoCheckout(): Locator {
    return this.page.locator('[data-testid="checkout-button"]');
  }

  getPrecoTotal(): Locator {
    return this.page.locator('[data-testid="total-price-text"]');
  }

  // ===== UTILITÁRIOS =====
  getModalConfirmacao(): Locator {
    return this.page.locator('[role="dialog"]');
  }

  getBotaoFecharModal(): Locator {
    return this.page.locator('button[aria-label="Close"]').first();
  }

  async aguardarResultados(): Promise<void> {
    await this.page.waitForSelector('[data-testid="search-result"], a[href^="/course/"]', {
      state: 'visible',
      timeout: 15000,
    });
  }

  async aguardarBotaoCarrinho(): Promise<void> {
    await this.page.waitForSelector(
      '[data-testid="add-to-cart-button"], button:has-text("Add to cart")',
      { state: 'visible', timeout: 15000 }
    );
  }

  async contarItensCarrinho(): Promise<number> {
    return await this.getItensCarrinho().count();
  }

  async estaNoCarrinho(): Promise<boolean> {
    return this.page.url().includes('/cart');
  }
}
