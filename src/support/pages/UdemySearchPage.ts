import { Page, expect } from '@playwright/test';

export default class UdemyPage {
  constructor(private readonly page: Page) {}

  private readonly seletores = {
    campoBusca: 'input[name="q"]',
    resultadosCurso: 'a[href^="/course/"]',
    botaoAddCarrinho: 'button:has-text("Add to cart"), button:has-text("Add to Cart")',
    tituloCarrinho: 'h1:has-text("Shopping Cart")'
  };

  async fecharBannerCookies(): Promise<void> {
    const cookieButton = this.page.locator('button:has-text("Accept"), button:has-text("Accept all")');
    if (await cookieButton.isVisible().catch(() => false)) {
      await cookieButton.click();
    }
  }

  async validarPaginaInicial(): Promise<void> {
    await expect(this.page).toHaveURL(/udemy\.com/);
    await expect(this.page.locator(this.seletores.campoBusca)).toBeVisible();
  }

  async buscarCurso(termo: string): Promise<void> {
    await this.page.locator(this.seletores.campoBusca).fill(termo);
    await this.page.locator(this.seletores.campoBusca).press('Enter');
    await this.page.waitForURL(/search/);
  }

  async validarResultadosBusca(): Promise<void> {
    const resultados = this.page.locator(this.seletores.resultadosCurso);
    await expect(resultados.first()).toBeVisible();
    expect(await resultados.count()).toBeGreaterThan(0);
  }

  async adicionarCursoAoCarrinho(): Promise<void> {
    // Vai direto para um curso específico
    await this.page.goto('https://www.udemy.com/course/git-e-github-para-iniciantes/');
    
    const botaoAdd = this.page.locator(this.seletores.botaoAddCarrinho);
    //await botaoAdd.click();
    
    // Aguarda a ação ser processada
    //await this.page.waitForTimeout(3000);
  }

  async validarCarrinho(): Promise<void> {
    await this.page.goto('https://www.udemy.com/cart/');
    await expect(this.page).toHaveURL(/cart/);
    await expect(this.page.locator(this.seletores.tituloCarrinho)).toBeVisible();
  }
}