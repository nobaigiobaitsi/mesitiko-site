import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCatalog } from '../scripts/crm-catalog.mjs';
const listing=()=>({id:'001',photos:[{}],locales:{el:{path:'/akinito-001/'},en:{path:'/en/property-001/'}}});
test('empty published catalog remains intentionally empty',()=>assert.deepEqual(validateCatalog({revision:2,listings:[]}).listings,[]));
test('reject malformed export and duplicate or reserved routes',()=>{
 assert.throws(()=>validateCatalog({listings:[]}));
 assert.throws(()=>validateCatalog({revision:1,listings:[listing(),listing()]}));
 const p=listing();p.locales.el.path='/';assert.throws(()=>validateCatalog({revision:1,listings:[p]}));
 p.locales.el.path='/../bad/';assert.throws(()=>validateCatalog({revision:1,listings:[p]}));
 assert.equal(validateCatalog({revision:1,listings:[listing()]}).listings.length,1);
});
