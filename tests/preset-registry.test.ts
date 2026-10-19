import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildPresetRegistry } from '../plugins/preset-registry';

test('registry uses folder hierarchy, numeric ordering, and configurable filenames', async () => {
  const root = await mkdtemp(join(tmpdir(), 'preset-registry-'));
  const config = { sources: { layouts: { base: 'layouts', files: { html: 'markup.html' } } } };
  async function add(path: string, id: string) {
    const folder = join(root, 'layouts', path);
    await mkdir(folder, { recursive: true });
    await writeFile(join(folder, 'preset.json'), JSON.stringify({ id, name: 'Same display name' }));
    await writeFile(join(folder, 'markup.html'), '<div class="container">Example</div>');
    await writeFile(join(folder, 'styles.css'), '.container { display: grid; }');
  }
  try {
    await add('10-zebra/01-example/10-other', 'last');
    await add('02-new-category/01-example/02-grid', 'second');
    await add('02-new-category/01-example/01-flex', 'first');
    const entries = await buildPresetRegistry(config, root);
    assert.deepEqual(entries.map(entry => entry.id), ['first', 'second', 'last']);
    assert.equal(entries[0].editor?.category, 'New Category');
    assert.equal(entries[0].html, '<div class="container">Example</div>');
    await add('01-added/01-example', 'new');
    assert.equal((await buildPresetRegistry(config, root))[0].id, 'new');
    await add('20-duplicate', 'first');
    await assert.rejects(buildPresetRegistry(config, root), /Duplicate preset ID/);
    await rm(join(root, 'layouts/20-duplicate'), { recursive: true });
    await rm(join(root, 'layouts/01-added/01-example/styles.css'));
    await assert.rejects(buildPresetRegistry(config, root), /ENOENT/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
