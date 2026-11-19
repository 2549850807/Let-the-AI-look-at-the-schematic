import extensionConfig from '../extension.json' with { type: 'json' };
import { showAiGuide } from './ai-guide';
import { diagnoseNetlistStructure } from './netlist-diagnostic';
import {
	activateProbeEventLog,
	createNetLabelProbe,
	createNetPortProbe,
	deactivateProbeEventLog,
	deleteSelectedWire,
	deleteTrackedNetLabel,
	deleteTrackedNetPort,
	exportEventLog,
	exportSelectionProbe,
	probeLabelThenDeleteWire,
	probeNetlistRefresh,
	restoreWireSnapshot,
	snapshotSelectedWire,
} from './phase0-probe';
import { openRegionImportInput, runRegionImportPreflight } from './phase2-preflight';
import { runWireConflictPreflight } from './phase3-preflight';
import { runNetPortLifecycleProbe } from './phase4-prerequisite';
import {
	cleanupComplexWireCloneProbe,
	diagnoseWireCloneResidue,
	recoverFullRegionStubPortProbe,
	recoverOriginalWireDeleteRestoreProbe,
	recoverSingleNetworkPrototype,
	runAllNetworkSequentialStubPortProbe,
	runComplexWireCloneProbe,
	runFullRegionStubPortRollbackProbe,
	runNetworkStubPortProbe,
	runOneClickFullDebug,
	runOneClickPersistentConversion,
	runOriginalWireDeleteRestoreProbe,
	runPersistentFullRegionConversion,
	runSingleNetworkPrototype,
	verifyManualRecoveryAndClearState,
} from './phase4-prototype';
import { exportRegionStructure } from './region-export';

export function activate(status?: 'onStartupFinished', arg?: string): void {
	void status;
	void arg;
	activateProbeEventLog();
}

export function deactivate(): void {
	deactivateProbeEventLog();
}

export function about(): void {
	eda.sys_Dialog.showInformationMessage(
		`让AI看看你的原理图\n版本：${extensionConfig.version}\n支持连接关系导出、AI 文本修改、安全导入、上一次导入撤回和全面检查。`,
		'关于',
	);
}

export function phase0ExportSelection(): void {
	void exportSelectionProbe();
}

export function phase0ProbeNetlistRefresh(): void {
	void probeNetlistRefresh();
}

export function phase0CreateNetLabel(): void {
	void createNetLabelProbe();
}

export function phase0DeleteNetLabel(): void {
	void deleteTrackedNetLabel();
}

export function phase0CreateNetPort(): void {
	void createNetPortProbe();
}

export function phase0DeleteNetPort(): void {
	void deleteTrackedNetPort();
}

export function phase0SnapshotWire(): void {
	void snapshotSelectedWire();
}

export function phase0DeleteWire(): void {
	void deleteSelectedWire();
}

export function phase0RestoreWire(): void {
	void restoreWireSnapshot();
}

export function phase0LabelThenDeleteWire(): void {
	void probeLabelThenDeleteWire();
}

export function phase0ExportEventLog(): void {
	void exportEventLog();
}

export function phase1DiagnoseNetlistStructure(): void {
	void diagnoseNetlistStructure();
}

export function phase1ExportRegionStructure(): void {
	void exportRegionStructure();
}

let regionImportInProgress = false;

export function phase2OpenRegionImportInput(): void {
	if (regionImportInProgress) {
		eda.sys_Dialog.showInformationMessage('导入窗口已打开或正在处理导入，请完成当前操作后再试。', '导入连接关系');
		return;
	}
	regionImportInProgress = true;
	void (async () => {
		try {
			const importRequested = await openRegionImportInput();
			if (importRequested) {
				await runPersistentFullRegionConversion();
			}
		}
		catch (error) {
			eda.sys_Dialog.showInformationMessage(error instanceof Error ? error.message : String(error), '导入连接关系失败');
		}
		finally {
			regionImportInProgress = false;
		}
	})();
}

export function showAiCollaborationGuide(): void {
	void showAiGuide();
}

export function phase2RunRegionImportPreflight(): void {
	void runRegionImportPreflight();
}

export function phase3RunWireConflictPreflight(): void {
	void runWireConflictPreflight();
}

export function phase4RunNetPortLifecycleProbe(): void {
	void runNetPortLifecycleProbe();
}

export function phase4RunSingleNetworkPrototype(): void {
	void runSingleNetworkPrototype();
}

export function phase4RecoverSingleNetworkPrototype(): void {
	void recoverSingleNetworkPrototype();
}

export function phase4VerifyManualRecoveryAndClearState(): void {
	void verifyManualRecoveryAndClearState();
}

export function phase4RunComplexWireCloneProbe(): void {
	void runComplexWireCloneProbe();
}

export function phase4CleanupComplexWireCloneProbe(): void {
	void cleanupComplexWireCloneProbe();
}

export function phase4DiagnoseWireCloneResidue(): void {
	void diagnoseWireCloneResidue();
}

export function phase4RunOriginalWireDeleteRestoreProbe(): void {
	void runOriginalWireDeleteRestoreProbe();
}

export function phase4RecoverOriginalWireDeleteRestoreProbe(): void {
	void recoverOriginalWireDeleteRestoreProbe();
}

export function phase4RunNetworkStubPortProbe(): void {
	void runNetworkStubPortProbe();
}

export function phase4RunAllNetworkSequentialStubPortProbe(): void {
	void runAllNetworkSequentialStubPortProbe();
}

export function phase4RunFullRegionStubPortRollbackProbe(): void {
	void runFullRegionStubPortRollbackProbe();
}

export function phase4RecoverFullRegionStubPortProbe(): void {
	void recoverFullRegionStubPortProbe();
}

export function phase4RunOneClickFullDebug(): void {
	void runOneClickFullDebug();
}

export function phase4RunPersistentFullRegionConversion(): void {
	void runPersistentFullRegionConversion();
}

export function phase4RunOneClickPersistentConversion(): void {
	void runOneClickPersistentConversion();
}

export function phase4UndoPersistentFullRegionConversion(): void {
	void recoverFullRegionStubPortProbe();
}
