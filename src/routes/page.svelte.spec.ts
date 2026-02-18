import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render core controls', async () => {
		render(Page);

		const printButton = page.getByText('見積書を発行');
		const loadTemplateButton = page.getByText('小屋解体');
		const loadTemplateButton2 = page.getByText('厚基礎プラン');
		const jsonLoadButton = page.getByText('JSON読込');
		const jsonSaveButton = page.getByText('JSON保存');

		await expect.element(printButton).toBeInTheDocument();
		await expect.element(loadTemplateButton).toBeInTheDocument();
		await expect.element(loadTemplateButton2).toBeInTheDocument();
		await expect.element(jsonLoadButton).toBeInTheDocument();
		await expect.element(jsonSaveButton).toBeInTheDocument();
	});
});
