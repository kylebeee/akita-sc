/**
 * Test Fixture Logger - Condensed output for Akita DAO test fixtures.
 * Uses process.stdout.write to bypass Jest's console interception.
 * 
 * Theme: Purple (#9439e6) & Pink (#f35ff2)
 */

// 24-bit true color ANSI codes
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  // Primary theme
  purple: '\x1b[38;2;148;57;230m',    // #9439e6
  pink: '\x1b[38;2;243;95;242m',      // #f35ff2
  // Utility
  white: '\x1b[38;2;255;255;255m',
  gray: '\x1b[38;2;120;120;120m',
  red: '\x1b[38;2;255;80;80m',
  cyan: '\x1b[38;2;80;200;220m',
} as const;

type LogPhase = 'DEPLOY_CORE' | 'DEPLOY_PLUGINS' | 'CONFIGURE_DAO' | 'SETUP_ESCROWS' | 'SETUP_BONES' | 'FINALIZE';

const PHASE_LABELS: Record<LogPhase, string> = {
  DEPLOY_CORE: 'Deploy Core',
  DEPLOY_PLUGINS: 'Deploy Plugins',
  CONFIGURE_DAO: 'Configure DAO',
  SETUP_ESCROWS: 'Setup Escrows',
  SETUP_BONES: 'Setup Bones',
  FINALIZE: 'Finalize',
};

const log = (msg: string) => process.stdout.write(msg + '\n');

type LogMode = 'full' | 'compact' | 'silent';

class FixtureLogger {
  private stepCounter = 0;
  private enabled = process.env.FIXTURE_LOGS !== 'false';
  private mode: LogMode = 'full';
  private currentSuite: string | null = null;

  /**
   * Set logging mode:
   * - 'full': Show all logs with phases and details (default for buildAkitaUniverse)
   * - 'compact': Show only key milestones on single lines
   * - 'silent': No output
   */
  setMode(mode: LogMode): void {
    this.mode = mode;
  }

  /**
   * Start a new test suite - resets step counter and optionally shows header
   */
  startSuite(name: string, showHeader = true): void {
    if (!this.enabled || this.mode === 'silent') return;
    this.stepCounter = 0;
    this.currentSuite = name;
    if (showHeader) {
      log(`\n${C.cyan}${C.bold}🧪 ${name}${C.reset}`);
    }
  }

  /**
   * End current test suite
   */
  endSuite(): void {
    this.currentSuite = null;
    this.stepCounter = 0;
  }

  phase(phase: LogPhase): void {
    if (!this.enabled || this.mode === 'silent') return;
    this.stepCounter = 0;
    if (this.mode === 'compact') return;
    log(`\n${C.purple}━━━ ${C.bold}${C.pink}${PHASE_LABELS[phase]}${C.reset}${C.purple} ━━━${C.reset}`);
  }

  deploy(name: string, appId: bigint | number, address?: string): void {
    if (!this.enabled || this.mode === 'silent') return;
    
    if (this.mode === 'compact') {
      log(`${C.gray}  📦${C.reset} ${C.white}${name}${C.reset} ${C.gray}→${C.reset} ${C.pink}${appId}${C.reset}`);
      return;
    }
    
    log(`${C.gray}[${++this.stepCounter}]${C.reset} 📦 ${C.bold}${C.white}${name}${C.reset}`);
    log(`    ${C.purple}↳${C.reset} ${C.gray}id:${C.reset} ${C.pink}${appId}${C.reset}`);
    if (address) log(`    ${C.purple}↳${C.reset} ${C.gray}addr:${C.reset} ${C.purple}${address}${C.reset}`);
  }

  wallet(name: string, appId: bigint | number, address: string): void {
    if (!this.enabled || this.mode === 'silent') return;
    
    if (this.mode === 'compact') {
      log(`${C.gray}  👛${C.reset} ${C.white}${name}${C.reset} ${C.gray}→${C.reset} ${C.pink}${appId}${C.reset}`);
      return;
    }
    
    log(`${C.gray}[${++this.stepCounter}]${C.reset} 👛 ${C.bold}${C.white}${name}${C.reset}`);
    log(`    ${C.purple}↳${C.reset} ${C.gray}id:${C.reset} ${C.pink}${appId}${C.reset}`);
    log(`    ${C.purple}↳${C.reset} ${C.gray}addr:${C.reset} ${C.purple}${address}${C.reset}`);
  }

  plugin(action: 'deploy' | 'install' | 'remove', name: string, appId?: bigint | number): void {
    if (!this.enabled || this.mode === 'silent') return;
    
    if (this.mode === 'compact') {
      const icon = action === 'deploy' ? '🔌' : action === 'install' ? '📋' : '🗑️';
      const suffix = appId ? ` ${C.gray}→${C.reset} ${C.pink}${appId}${C.reset}` : '';
      log(`${C.gray}  ${icon}${C.reset} ${C.pink}${name}${C.reset}${suffix}`);
      return;
    }
    
    const verbs = { deploy: 'Deploy', install: 'Install', remove: 'Remove' };
    log(`${C.gray}[${++this.stepCounter}]${C.reset} 🔌 ${verbs[action]} ${C.pink}${name}${C.reset}`);
    if (appId) log(`    ${C.purple}↳${C.reset} ${C.gray}id:${C.reset} ${C.pink}${appId}${C.reset}`);
  }

  proposal(action: string, proposalId?: bigint | number): void {
    if (!this.enabled || this.mode === 'silent') return;
    
    if (this.mode === 'compact') {
      const suffix = proposalId !== undefined ? ` ${C.gray}#${C.pink}${proposalId}${C.reset}` : '';
      log(`${C.gray}  📋${C.reset} ${C.purple}${action}${C.reset}${suffix}`);
      return;
    }
    
    const id = proposalId !== undefined ? ` ${C.gray}#${C.pink}${proposalId}${C.reset}` : '';
    log(`${C.gray}[${++this.stepCounter}]${C.reset} 📋 ${C.purple}${action}${C.reset}${id}`);
  }

  escrow(name: string, action: 'create' | 'lock' | 'unlock' | 'configure' | 'optin'): void {
    if (!this.enabled || this.mode === 'silent') return;
    
    if (this.mode === 'compact') {
      log(`${C.gray}  🔐${C.reset} ${C.pink}"${name}"${C.reset}`);
      return;
    }
    
    const verbs = { create: 'Create', lock: 'Lock', unlock: 'Unlock', configure: 'Configure', optin: 'Opt-in' };
    log(`${C.gray}[${++this.stepCounter}]${C.reset} 🔐 ${verbs[action]} escrow ${C.pink}"${name}"${C.reset}`);
  }

  config(description: string): void {
    if (!this.enabled || this.mode === 'silent') return;
    if (this.mode === 'compact') return;
    log(`${C.gray}[${++this.stepCounter}]${C.reset} ⚙️  ${description}`);
  }

  detail(message: string): void {
    if (!this.enabled || this.mode === 'silent' || this.mode === 'compact') return;
    log(`    ${C.purple}↳${C.reset} ${C.gray}${message}${C.reset}`);
  }

  fund(target: string, amount: bigint | number): void {
    if (!this.enabled || this.mode === 'silent' || this.mode === 'compact') return;
    log(`    ${C.purple}↳${C.reset} ${C.gray}💰 ${target}:${C.reset} ${C.pink}${Number(amount).toLocaleString()}${C.reset} ${C.gray}µALGO${C.reset}`);
  }

  startBuild(): void {
    if (!this.enabled || this.mode === 'silent') return;
    this.stepCounter = 0;
    log(`\n${C.purple}${C.bold}🐕 ${C.pink}AKITA UNIVERSE BUILD${C.reset}`);
  }

  completeBuild(summary: { dao: bigint; wallet: bigint; escrowFactory: bigint; walletFactory: bigint }): void {
    if (!this.enabled || this.mode === 'silent') return;
    
    if (this.mode === 'compact') {
      log(`${C.pink}${C.bold}✓${C.reset} ${C.gray}DAO:${C.reset} ${C.pink}${summary.dao}${C.reset} ${C.gray}Wallet:${C.reset} ${C.pink}${summary.wallet}${C.reset}`);
      return;
    }
    
    log(`\n${C.pink}${C.bold}✓ BUILD COMPLETE${C.reset}`);
    log(`    ${C.purple}↳${C.reset} ${C.gray}DAO:${C.reset} ${C.pink}${summary.dao}${C.reset}  ${C.gray}Wallet:${C.reset} ${C.pink}${summary.wallet}${C.reset}`);
    log(`    ${C.purple}↳${C.reset} ${C.gray}EscrowFactory:${C.reset} ${C.pink}${summary.escrowFactory}${C.reset}  ${C.gray}WalletFactory:${C.reset} ${C.pink}${summary.walletFactory}${C.reset}`);
  }

  error(context: string, error: unknown): void {
    const msg = error instanceof Error ? error.message : String(error);
    log(`${C.red}${C.bold}✗ ERROR: ${context}${C.reset}`);
    log(`    ${C.gray}${msg}${C.reset}`);
  }

  divider(): void {
    if (!this.enabled || this.mode === 'silent' || this.mode === 'compact') return;
    log(`${C.purple}───${C.reset}`);
  }
}

export const logger = new FixtureLogger();
export { FixtureLogger };
