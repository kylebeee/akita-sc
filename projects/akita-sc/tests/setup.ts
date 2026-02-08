/**
 * Vitest Setup File
 * 
 * Suppresses noisy AlgoKit SDK logs while preserving our structured fixture logs.
 * 
 * Environment Variables:
 * - FIXTURE_LOGS=false   → Disable fixture logs
 * - ALGOKIT_LOGS=true    → Enable AlgoKit SDK logs (info/debug)
 */

import { afterAll } from 'vitest';

// Set network for SDKs that need to detect it
process.env.ALGORAND_NETWORK = 'localnet';

const originalConsoleLog = console.log;
const originalConsoleInfo = console.info;
const originalConsoleDebug = console.debug;

// Check if AlgoKit logs should be shown (default: suppressed)
const showAlgokitLogs = process.env.ALGOKIT_LOGS === 'true';

// Patterns that indicate AlgoKit SDK logs we want to suppress
const algokitPatterns = [
  'Idempotently deploying app',
  'App .* not found in apps created by',
  'App created by',
  'Sending .* µALGO from',
  'Transaction IDs',
  'App .* called with',
  'Building group \\d+/\\d+ with start:',  // SDK debug logs
];

const isAlgokitLog = (...args: unknown[]): boolean => {
  const message = args.map(arg => String(arg)).join(' ');
  return algokitPatterns.some(pattern => new RegExp(pattern).test(message));
};

if (!showAlgokitLogs) {
  // Suppress console.info and console.debug from AlgoKit SDK
  console.info = (...args: unknown[]) => {
    if (!isAlgokitLog(...args)) {
      originalConsoleInfo.apply(console, args);
    }
  };

  console.debug = (...args: unknown[]) => {
    if (!isAlgokitLog(...args)) {
      originalConsoleDebug.apply(console, args);
    }
  };

  // Filter console.log for AlgoKit-style messages (transaction arrays, etc.)
  console.log = (...args: unknown[]) => {
    // Check if this looks like a transaction ID array log
    const firstArg = args[0];
    if (typeof firstArg === 'string') {
      // Skip transaction ID arrays
      if (firstArg.includes('Transaction IDs')) {
        return;
      }
      // Skip AlgoKit-style messages
      if (isAlgokitLog(...args)) {
        return;
      }
    }
    originalConsoleLog.apply(console, args);
  };
}

// Restore original console methods after all tests
afterAll(() => {
  console.log = originalConsoleLog;
  console.info = originalConsoleInfo;
  console.debug = originalConsoleDebug;
});

