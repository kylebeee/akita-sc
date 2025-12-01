import { abimethod, Contract } from "@algorandfoundation/algorand-typescript";
import { ProposalAddAllowances, ProposalAddNamedPlugin, ProposalAddPlugin, ProposalExecuteNamedPlugin, ProposalExecutePlugin, ProposalNewEscrow, ProposalRemoveAllowances, ProposalRemoveExecutePlugin, ProposalRemoveNamedPlugin, ProposalRemovePlugin, ProposalToggleEscrowLock, ProposalUpdateField, ProposalUpgradeApp } from "./types";

export class AkitaDAOTypes extends Contract {
  @abimethod({ readonly: true })
  proposalUpgradeAppShape(shape: ProposalUpgradeApp): ProposalUpgradeApp {
    return shape
  }

  @abimethod({ readonly: true })
  proposalAddPluginShape(shape: ProposalAddPlugin): ProposalAddPlugin {
    return shape
  }

  @abimethod({ readonly: true })
  proposalAddNamedPluginShape(shape: ProposalAddNamedPlugin): ProposalAddNamedPlugin {
    return shape
  }

  @abimethod({ readonly: true })
  proposalRemovePluginShape(shape: ProposalRemovePlugin): ProposalRemovePlugin {
    return shape
  }

  @abimethod({ readonly: true })
  proposalRemoveNamedPluginShape(shape: ProposalRemoveNamedPlugin): ProposalRemoveNamedPlugin {
    return shape
  }

  @abimethod({ readonly: true })
  proposalExecutePluginShape(shape: ProposalExecutePlugin): ProposalExecutePlugin {
    return shape
  }

  @abimethod({ readonly: true })
  proposalExecuteNamedPluginShape(shape: ProposalExecuteNamedPlugin): ProposalExecuteNamedPlugin {
    return shape
  }

  @abimethod({ readonly: true })
  proposalRemoveExecutePluginShape(shape: ProposalRemoveExecutePlugin): ProposalRemoveExecutePlugin {
    return shape
  }

  @abimethod({ readonly: true })
  proposalAddAllowancesShape(shape: ProposalAddAllowances): ProposalAddAllowances {
    return shape
  }

  @abimethod({ readonly: true })
  proposalRemoveAllowancesShape(shape: ProposalRemoveAllowances): ProposalRemoveAllowances {
    return shape
  }

  @abimethod({ readonly: true })
  proposalNewEscrowShape(shape: ProposalNewEscrow): ProposalNewEscrow {
    return shape
  }

  @abimethod({ readonly: true })
  proposalToggleEscrowLockShape(shape: ProposalToggleEscrowLock): ProposalToggleEscrowLock {
    return shape
  }

  @abimethod({ readonly: true })
  proposalUpdateFieldShape(shape: ProposalUpdateField): ProposalUpdateField {
    return shape
  }
}