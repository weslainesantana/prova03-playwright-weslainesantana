
import { join } from 'path';
import { TheConfig } from 'sicolo';
import UdemyPage from '../support/pages/UdemySearchPage';
import { test, expect } from "../support/fixtures/zerostep";

test.describe('Udemy - Busca e Carrinho', () => {
  const CONFIG = join(__dirname, '../support/fixtures/config.yml');
  let udemyPage: UdemyPage;
  const BASE_URL = TheConfig.fromFile(CONFIG)
    .andPath('application.udemy')
    .retrieveData();

  test.beforeEach(async ({ page }) => {
    udemyPage = new UdemyPage(page);
    await page.goto(BASE_URL || 'https://www.udemy.com/');
    await udemyPage.fecharBannerCookies();
  });

  test('Acessar página inicial e validar elementos', async () => {
    await udemyPage.validarPaginaInicial();
  });

  test('Pesquisar curso React e validar resultados', async () => {
    await udemyPage.buscarCurso('React');
    await udemyPage.validarResultadosBusca();
  });

  test('Adicionar curso ao carrinho e validar', async () => {
    await udemyPage.adicionarCursoAoCarrinho();
    await udemyPage.validarCarrinho();
  });

  test('teste com IA', async ({ai}) => {
    await ai("clique no botão de fazer login");
  });
});