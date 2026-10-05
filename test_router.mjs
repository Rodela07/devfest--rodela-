import { DatasetValidator } from './js/validator.js';
import { EvacuationRouter } from './js/router.js';
import fs from 'fs';

const sampleBuilding = JSON.parse(fs.readFileSync('./building.json', 'utf8'));

console.log('--- TEST 0: VALIDATION ---');
const valResult = DatasetValidator.validate(sampleBuilding);
console.log('Valid:', valResult.valid, 'Errors:', valResult.errors);

console.log('\n--- TEST 1: Baseline (Start R1) ---');
const t1 = EvacuationRouter.calculateRoute(sampleBuilding, 'R1', [], [], []);
console.log('T1 Result:', t1.status, 'Path:', t1.path.join(' -> '), 'Cost:', t1.totalCost);
console.assert(t1.status === 'FOUND' && t1.path.join('-') === 'R1-C1-C2-E1' && t1.totalCost === 7, 'Test 1 Failed');

console.log('\n--- TEST 2: Block C2 (Start R1) ---');
const t2 = EvacuationRouter.calculateRoute(sampleBuilding, 'R1', ['C2'], [], []);
console.log('T2 Result:', t2.status, 'Path:', t2.path.join(' -> '), 'Cost:', t2.totalCost);
console.assert(t2.status === 'FOUND' && t2.path.join('-') === 'R1-C1-C3-C4-E2' && t2.totalCost === 11, 'Test 2 Failed');

console.log('\n--- TEST 3: Close E1 and E2 (Start R1) ---');
const t3 = EvacuationRouter.calculateRoute(sampleBuilding, 'R1', [], [], ['E1', 'E2']);
console.log('T3 Result:', t3.status, 'Message:', t3.messageKey);
console.assert(t3.status === 'NO_ROUTE', 'Test 3 Failed');

console.log('\n--- TEST 4: Start R2 ---');
const t4 = EvacuationRouter.calculateRoute(sampleBuilding, 'R2', [], [], []);
console.log('T4 Result:', t4.status, 'Path:', t4.path.join(' -> '), 'Cost:', t4.totalCost);
console.assert(t4.status === 'FOUND' && t4.path.join('-') === 'R2-C3-C4-E2' && t4.totalCost === 7, 'Test 4 Failed');

console.log('\n--- TEST 5: Blocked Start R1 ---');
const t5 = EvacuationRouter.calculateRoute(sampleBuilding, 'R1', ['R1'], [], []);
console.log('T5 Result:', t5.status, 'Message:', t5.messageKey);
console.assert(t5.status === 'START_BLOCKED', 'Test 5 Failed');

console.log('\n--- TEST 6: Multi-Exit Tie Break ---');
const tieBuilding = JSON.parse(fs.readFileSync('./data/multi_exit_tiebreak.json', 'utf8'));
const t6 = EvacuationRouter.calculateRoute(tieBuilding, 'R0', [], [], []);
console.log('T6 Result:', t6.status, 'Destination:', t6.destination, 'Path:', t6.path.join(' -> '), 'Cost:', t6.totalCost);
console.assert(t6.destination === 'E1' && t6.totalCost === 6, 'Test 6 Failed');

console.log('\nALL 6 AUTOMATED ROUTING TESTS PASSED PERFECTLY!');
