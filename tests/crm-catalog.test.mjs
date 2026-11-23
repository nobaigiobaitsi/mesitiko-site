import test from 'node:test';
import assert from 'node:assert/strict';
import { upgradeImportedSnapshot, validateCatalog } from '../scripts/crm-catalog.mjs';
const listing=()=>({id:'001',photos:[{}],locales:{el:{path:'/akinito-001/'},en:{path:'/en/property-001/'}}});
test('empty published catalog remains intentionally empty',()=>assert.deepEqual(validateCatalog({revision:2,listings:[]}).listings,[]));
test('reject malformed export and duplicate or reserved routes',()=>{
 assert.throws(()=>validateCatalog({listings:[]}));
 assert.throws(()=>validateCatalog({revision:1,listings:[listing(),listing()]}));
 const p=listing();p.locales.el.path='/';assert.throws(()=>validateCatalog({revision:1,listings:[p]}));
 p.locales.el.path='/../bad/';assert.throws(()=>validateCatalog({revision:1,listings:[p]}));
 assert.equal(validateCatalog({revision:1,listings:[listing()]}).listings.length,1);
});

test('older published imports are cleaned before bundling, while native and updated snapshots pass through', () => {
  // The real importer derives this property directory from the original ID 002.
  const cover = 'crm://9bd32351-3954-4cf1-809f-681b9d9e5a8d/00000000-0000-4000-8000-000000000001.jpg';
  const locale = { title:'Edited title', cardAddress:'', address:'Old street', location:'Old street', mapNote:'Old pin', description:'Edited description', features:[] };
  const original = {
    id:'002', cover, mapUrl:'https://www.google.com/maps?q=Old+street', wc:2,
    locales:{el:{...locale,path:'/custom/'},en:{...locale,path:'/en/custom/'}},
    photos:[{src:cover,alt:{el:'Old street',en:'Old street'}}], additionalFacts:[{key:'parking'}],
  };
  const cleaned = upgradeImportedSnapshot(original);
  assert.doesNotMatch(JSON.stringify(cleaned), /Old street|Old pin|google\.com|parking/);
  assert.equal(cleaned.locales.el.address, '');
  assert.equal(cleaned.locales.en.path, '/en/custom/');
  assert.equal(cleaned.locales.en.description, 'Edited description');
  assert.equal(cleaned.photos[0].src, cover);
  const native = {...original, cover:cover.replace('9bd32351','00000000')};
  assert.equal(upgradeImportedSnapshot(native), native);
  const current = {...cleaned, publicFieldsVersion:2};
  assert.equal(upgradeImportedSnapshot(current), current);
});
