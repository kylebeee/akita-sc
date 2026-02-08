import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // E2E tests against localnet need longer timeouts
    testTimeout: 120000,
    hookTimeout: 120000,
    // Run tests sequentially to avoid localnet conflicts
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // Include all test files from tests/ and smart_contracts/ directories
    include: [
      'tests/**/*.spec.ts',
      'tests/**/*.test.ts',
      'smart_contracts/**/*.spec.ts',
      'smart_contracts/**/*.test.ts',
    ],
    // Setup file for log suppression
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
    },
  },
})
