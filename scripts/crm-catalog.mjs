import { mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';

export function validateCatalog(snapshot) {
  if (!snapshot || !Array.isArray(snapshot.listings) || snapshot.listings.length > 2000 || snapshot.revision == null) throw new Error('Invalid CRM export');
  const ids = new Set(), paths = new Set(['/', '/en/', '/αγορά/', '/ενοικίαση/', '/πώληση/', '/υπηρεσίες/', '/νέα/', '/επικοινωνία/', '/privacy-policy/', '/en/buy/', '/en/buy-2/', '/en/rent/', '/en/sale/', '/en/services/', '/en/news/', '/en/contact/', '/en/privacy-policy-2/', '/η-οπτική-της-leaf-επιτόκια-αποδόσεις-2026/', '/en/the-leaf-workflow/', '/404/']);
  for (const p of snapshot.listings) {
    if (!p.id || ids.has(p.id) || !Array.isArray(p.photos) || !p.photos.length) throw new Error('Duplicate ID or missing photos');
    ids.add(p.id);
    for (const lang of ['el','en']) {
      const route = p.locales?.[lang]?.path;
      if (typeof route !== 'string' || !/^\/(?:[^/]+\/)+$/.test(route) || /[%?#\\.]/.test(route) || route.length > 200) throw new Error('Invalid property path');
      const key = route.normalize('NFC').toLowerCase();
      if (paths.has(key)) throw new Error(`Duplicate/reserved route: ${route}`);
      paths.add(key);
    }
  }
  return snapshot;
}

export async function prepareCrmCatalog(env) {
  const generated = path.resolve('src/data/crm-catalog.json');
  const media = path.resolve('public/_crm');
  // Never reuse a previous export when an endpoint fails.
  await writeFile(generated, 'null\n');
  await rm(media, {recursive:true, force:true});
  const cleanup = async () => { await writeFile(generated,'null\n'); await rm(media,{recursive:true,force:true}); };
  if (env.CRM_SITE_ENABLED !== 'true') return { enabled:false, cleanup };
  const base = env.CRM_SUPABASE_URL?.replace(/\/$/, '');
  const secret = env.CRM_SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !/^https:\/\/[^/]+\.supabase\.co$/.test(base) || !secret) throw new Error('Missing CRM build secrets');
  const headers = {apikey:secret, Authorization:`Bearer ${secret}`};
  try {
    const response = await fetch(`${base}/rest/v1/rpc/leaf_website_export`, {method:'POST',headers:{...headers,'Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(30000)});
    if (!response.ok) throw new Error(`CRM export failed (${response.status}); previous deployment remains live.`);
    const snapshot = validateCatalog(await response.json());
    const files = new Map();
    async function materialize(src) {
      if (files.has(src)) return files.get(src);
      if (!/^crm:\/\/[a-f0-9-]{36}\/[a-f0-9-]{36}\.jpg$/.test(src)) throw new Error('Publication image must reference a private snapshot');
      const objectPath = src.slice(6), target = `_crm/${objectPath}`;
      const image = await fetch(`${base}/storage/v1/object/authenticated/website-assets/${objectPath}`, {headers,signal:AbortSignal.timeout(30000)});
      if (!image.ok) throw new Error(`CRM image unavailable (${image.status})`);
      const bytes = new Uint8Array(await image.arrayBuffer());
      if (bytes.length > 2097152 || bytes[0] !== 255 || bytes[1] !== 216) throw new Error('Invalid publication JPEG');
      await mkdir(path.dirname(path.resolve('public',target)),{recursive:true});
      await writeFile(path.resolve('public',target),bytes);
      files.set(src,target); return target;
    }
    for (const p of snapshot.listings) {
      for (const photo of p.photos) photo.src = await materialize(photo.src);
      p.cover = await materialize(p.cover);
    }
    await writeFile(generated,JSON.stringify(snapshot.listings));
    return { enabled:true, revision:snapshot.revision, count:snapshot.listings.length, cleanup };
  } catch(error) { await cleanup(); throw error; }
}
