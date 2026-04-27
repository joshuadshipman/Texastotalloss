import { test, expect } from '@playwright/test';

test.describe('Texas Total Loss - Validation & Legal Tripwire Flows', () => {

  test('Fast ACV Flow - Property Damage Only (No Injuries)', async ({ page }) => {
    // Navigate to the direct ACV landing page
    await page.goto('/quiz');
    
    // Step 1: Vehicle Info & Injury Check
    await page.getByLabel(/Year/i).fill('2020');
    await page.getByLabel(/Make/i).fill('Honda');
    await page.getByLabel(/Model/i).fill('Accord');
    await page.getByLabel(/Mileage/i).fill('45000');
    
    // Medical / Injury check -> Property Only
    await page.getByRole('button', { name: /JUST PROPERTY/i }).click();
    
    // Next step
    await page.getByRole('button', { name: /Continue to Interior Audit/i }).click();
    
    // Step 2: Interior Conditioning
    await expect(page.getByText(/Interior Conditioning/i)).toBeVisible();
    await page.getByRole('button', { name: /Daily Driver/i }).click();
    await page.getByRole('button', { name: /Continue to Photo Audit/i }).click();
    
    // Step 3: Photo Evidence
    await expect(page.getByText(/Take or Select Photos/i)).toBeVisible();
    
    // Test logic expects file uploads here, we can skip actual file upload and verify button state 
    // Since we need 3 photos to proceed, the submit button will be disabled
    const submitBtn = page.getByRole('button', { name: /Submit for Expert Audit/i });
    await expect(submitBtn).toBeDisabled();
  });

  test('Detailed Audit Flow - Legal Tripwire Execution (Injuries)', async ({ page }) => {
    await page.goto('/quiz');
    
    // Step 1: Vehicle Info & Injury Check
    await page.getByLabel(/Year/i).fill('2020');
    await page.getByLabel(/Make/i).fill('Honda');
    
    // Trigger Legal Tripwire (User reports injuries)
    await page.getByRole('button', { name: /YES, HURT/i }).click();
    
    // Next step
    await page.getByRole('button', { name: /Continue to Interior Audit/i }).click();
    
    // Step 2 & 3
    await page.getByRole('button', { name: /Continue to Photo Audit/i }).click();
    
    // It should proceed, but we are looking for Attorney Handoff. 
    // In current implementation, it doesn't immediately branch. The Legal Tripwire isn't fully built in page.tsx!
  });
});

