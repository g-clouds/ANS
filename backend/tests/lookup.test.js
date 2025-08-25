import supertest from 'supertest';
import { expect } from 'chai';
import express from 'express';
import { performance } from 'perf_hooks';
import { lookupHandler } from '../src/routes/lookup.js';

// --- Test Configuration ---
// Add or modify the test cases in this array to change the lookup queries.
const testCases = [
  {
    name: "Find agent by exact name",
    query: { query: "Translator", trust_level: 'provisional' },
    expected: { id: "translator.ans", name: "Translator" }
  },
  {
    name: "Find agent by name prefix",
    query: { query: "Nia", trust_level: 'provisional' },
    expected: { id: "nia.ans" }
  },
  {
    name: "Find agent by all capabilities (AND logic)",
    query: { capabilities: ['translator', 'english', 'multilingual'], trust_level: 'provisional' },
    expected: { id: "translator.ans" }
  },
  {
    name: "Find agent by a subset of capabilities",
    query: { capabilities: ['translator', 'english'], trust_level: 'provisional' },
    expected: { id: "translator.ans" }
  },
  {
    name: "Fail to find agent with mixed capabilities",
    query: { capabilities: ['translator', 'sales'], trust_level: 'provisional' },
    expected: { id: "translator.ans", shouldBeFound: false }
  },
  {
    name: "Find all provisional agents",
    query: { trust_level: 'provisional' },
    expected: { minResults: 3 }
  },
  {
    name: "Check policy compatibility success",
    query: {
        query: "Translator",
        trust_level: 'provisional',
        policy_requirements: { capabilities: ['english'] }
    },
    expected: { id: "translator.ans", policy: true }
  },
  {
    name: "Check policy compatibility failure",
    query: {
        query: "Translator",
        trust_level: 'provisional',
        policy_requirements: { capabilities: ['non_existent_capability'] }
    },
    expected: { id: "translator.ans", policy: false }
  },
  {
    name: "Generic: Empty Result Lookup",
    query: { query: "NonExistentAgent12345" },
    expected: { minResults: 0, maxResults: 0 }
  }
];
// --------------------------

// Setup Express app
const app = express();
app.use(express.json());
app.post('/lookup', lookupHandler);

describe('Configurable Lookup API Test', function() {
  jest.setTimeout(25000); // Set a timeout for all tests

  console.log(`
Running ${testCases.length} configured test cases...
`);

  testCases.forEach(testCase => {
    it(`should run test: '${testCase.name}' and measure performance`, async () => {
      const startTime = performance.now();
      const res = await supertest(app).post('/lookup').send({ params: testCase.query });
      const endTime = performance.now();
      const duration = endTime - startTime;

      // --- Output Results ---
      console.log(`  [Test: ${testCase.name}]`);
      console.log(`    - Query Parameters: ${JSON.stringify(testCase.query)}`);
      console.log(`    - Response Time: ${duration.toFixed(2)}ms`);
      console.log(`    - Results Found: ${res.body.results?.length || 0}`);

      // --- Assertions ---
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status', 'success');
      expect(res.body).to.have.property('results').that.is.an('array');

      if (testCase.expected) {
        if (testCase.expected.id) {
          const foundAgent = res.body.results.find(r => r.agent_id === testCase.expected.id);

          if (testCase.expected.shouldBeFound === false) {
            expect(foundAgent, `Expected NOT to find agent with id: ${testCase.expected.id}`).to.be.undefined;
          } else {
            expect(foundAgent, `Expected to find agent with id: ${testCase.expected.id}`).to.not.be.undefined;

            if (testCase.expected.name) {
                expect(foundAgent.name).to.equal(testCase.expected.name);
            }
            if (testCase.expected.hasOwnProperty('policy')) {
                expect(foundAgent.policy_compatibility).to.equal(testCase.expected.policy);
            }
          }
        }

        if (testCase.expected.minResults) {
          expect(res.body.results.length).to.be.at.least(testCase.expected.minResults);
        }
        if (testCase.expected.maxResults) {
          expect(res.body.results.length).to.be.at.most(testCase.expected.maxResults);
        }
      }
    });
  });

  it('should run multiple lookups to check for performance consistency', async () => {
    const consistencyQuery = { capabilities: ['translator'] };
    const latencies = [];
    console.log(`
  [Test: Performance Consistency]`);
    console.log(`    - Running 5 lookups with query: ${JSON.stringify(consistencyQuery)}`);

    for (let i = 0; i < 5; i++) {
        const startTime = performance.now();
        await supertest(app).post('/lookup').send({ params: consistencyQuery });
        const endTime = performance.now();
        const duration = endTime - startTime;
        latencies.push(duration);
    }

    const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const minLatency = Math.min(...latencies);
    const maxLatency = Math.max(...latencies);

    console.log(`    - Min Latency: ${minLatency.toFixed(2)}ms`);
    console.log(`    - Max Latency: ${maxLatency.toFixed(2)}ms`);
    console.log(`    - Average Latency: ${avgLatency.toFixed(2)}ms`);
  });
});
