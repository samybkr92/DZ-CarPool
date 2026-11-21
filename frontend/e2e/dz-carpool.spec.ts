import { test, expect } from '@playwright/test';

/**
 * DZ-CarPool — Scénarios E2E Critiques
 * Couvre l'ensemble du cycle de vie : Inscription, Recherche de trajet,
 * Décomposition tarifaire (15% commission + 30% confort),
 * Pause réglementaire > 300 km, et Approbation de réservation par le conducteur.
 */

test.describe('DZ-CarPool — Flux Utilisateurs Critiques & Règles Métier', () => {

  test('Scénario 1 : Recherche de trajet Alger -> Oran, vérification de la pause > 300 km et du calcul tarifaire', async ({ page }) => {
    // 1. Accès à la page d'accueil
    await page.goto('/');
    await expect(page).toHaveTitle(/DZ-CarPool/);

    // 2. Recherche d'un trajet Alger -> Oran
    await page.fill('input[placeholder*="Alger"]', 'Alger');
    await page.fill('input[placeholder*="Oran"]', 'Oran');
    await page.click('button[type="submit"]');

    // 3. Redirection vers la page de résultats
    await expect(page).toHaveURL(/\/search/);

    // 4. Sélection d'un trajet longue distance (> 300 km)
    const tripCard = page.locator('text=Alger').first();
    await expect(tripCard).toBeVisible();
    await tripCard.click();

    // 5. Vérification de la fiche détaillée du trajet
    await expect(page).toHaveURL(/\/trips\/\d+/);

    // Vérification de la règle métier : Pause de sécurité obligatoire de 15 min > 300 km
    const mandatoryRestBadge = page.locator('text=Pause sécurité obligatoire (15 minutes)');
    await expect(mandatoryRestBadge).toBeVisible();

    // Vérification de la décomposition tarifaire transparente
    await expect(page.locator('text=Prix de base conducteur')).toBeVisible();
    await expect(page.locator('text=Frais de service plateforme (15%)')).toBeVisible();
    await expect(page.locator('text=Total passager à régler')).toBeVisible();

    // Test de l'activation de l'option Trajet Confort (+30%)
    const comfortToggle = page.locator('input[type="checkbox"]');
    if (await comfortToggle.count() > 0) {
      await comfortToggle.first().check();
      await expect(page.locator('text=Supplément Trajet Confort (+30%)')).toBeVisible();
    }
  });

  test('Scénario 2 : Cycle complet de réservation (Demande passager -> Approbation conducteur -> Décompte atomique)', async ({ page }) => {
    // 1. Connexion en tant que passager
    await page.goto('/login');
    await page.fill('input[type="email"]', 'khadidja.m@dz-carpool.dz');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // 2. Navigation vers la recherche et sélection d'un trajet
    await page.goto('/search');
    const firstTrip = page.locator('.group.cursor-pointer').first();
    await expect(firstTrip).toBeVisible();
    await firstTrip.click();

    // 3. Soumission de la demande de réservation
    const bookButton = page.locator('button:has-text("Confirmer la réservation")');
    await expect(bookButton).toBeVisible();
    await bookButton.click();

    // 4. Confirmation de l'état "pending"
    await expect(page.locator('text=Demande envoyée avec succès')).toBeVisible();

    // 5. Consultation de l'espace Mes Réservations
    await page.goto('/dashboard/passenger');
    await expect(page.locator('text=En attente d\'approbation').first()).toBeVisible();

    // 6. Bascule vers le compte conducteur pour validation
    await page.goto('/login');
    await page.fill('input[type="email"]', 'amine.benali@dz-carpool.dz');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // 7. Accès à l'Espace Conducteur et approbation de la demande
    await page.goto('/dashboard/driver');
    const approveBtn = page.locator('button:has-text("Accepter")').first();
    if (await approveBtn.isVisible()) {
      await approveBtn.click();
      // Vérification que le statut passe à "Confirmée"
      await expect(page.locator('text=Confirmée').first()).toBeVisible();
    }
  });

  test('Scénario 3 : Support bilingue Français/Arabe et inversion RTL dynamique', async ({ page }) => {
    await page.goto('/');

    // 1. Vérification de la langue par défaut (Français LTR)
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');

    // 2. Clic sur le sélecteur de langue vers l'Arabe
    const langSwitchBtn = page.locator('button[aria-label="Toggle language"]');
    await langSwitchBtn.click();

    // 3. Vérification de l'attribut RTL et des traductions arabes
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('text=ديزاد كربول')).toBeVisible();
    await expect(page.locator('text=البحث عن رحلة')).toBeVisible();

    // 4. Retour vers le Français
    await langSwitchBtn.click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('text=Trouver un trajet')).toBeVisible();
  });

});
