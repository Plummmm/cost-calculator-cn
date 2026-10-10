const assert=require('node:assert/strict');const {defaults:D,calc,unit,ranges,compare}=require('./dist/calc.js');
let tests=0;function test(name,f){f();tests++;console.log('PASS',name)}
test('default bill independently derived',()=>{const c=calc(D);assert.equal(c.n,220);assert.equal(c.packs,3);assert.equal(c.wb,220);const expected=(30000*(.8*1.32+.2*.044)+5000*3.96)/1e6*7.1*220;assert.ok(Math.abs(c.api-expected)<1e-8)});
test('exact pack boundaries',()=>{assert.equal(calc(D,100).packs,0);assert.equal(calc(D,101).packs,1);assert.equal(calc(D,150).packs,1);assert.equal(calc(D,151).packs,2)});
test('bonus and zero tasks',()=>{assert.equal(calc({...D,bonus:true},200).packs,0);assert.equal(calc(D,0).api,0);assert.equal(calc(D,0).wb,70)});
test('annual USD subscription and packs conversion',()=>{const c=calc({...D,bill:96,months:12,wbCurrency:'USD',credits:1000,packCredits:500,packPrice:15},100);assert.equal(c.wb,(8+30)*7.1);assert.equal(c.upfront,96*7.1)});
test('cache extremes and currency',()=>{const s={...D,input:1e6,output:0,apiCurrency:'CNY'};assert.equal(unit({...s,cache:0}),1.32);assert.equal(unit({...s,cache:100}),.044)});
test('extras, retry and time costs',()=>{const c=calc({...D,input:1e6,output:0,cache:0,apiCurrency:'CNY',inputPrice:2,multiplier:2,tool:1,fee:10,fixed:3,setup:120,amort:12,hourly:60,apiMinutes:2,wbMinutes:1},10);assert.equal(c.api,88);assert.equal(c.wb,80)});
test('ranges cover every integer without gaps and allow multiple switches',()=>{const s={...D,bill:10,credits:20,creditTask:1,packCredits:10,packPrice:20,input:1e6,output:0,cache:0,inputPrice:1,apiCurrency:'CNY',limit:100};const r=ranges(s);assert.ok(r.length>2);assert.equal(r[0].start,0);assert.equal(r.at(-1).end,100);r.forEach((x,i)=>{if(i)assert.equal(x.start,r[i-1].end+1);for(let n=x.start;n<=x.end;n++)assert.equal(x.winner,compare(s,n))})});
test('zero variable cost and equal costs',()=>{const s={...D,bill:0,creditTask:0,input:0,output:0,limit:20};assert.deepEqual(ranges(s),[{start:0,end:20,winner:'equal'}])});
console.log(`${tests} calculation tests passed`);
