import * as core from '@actions/core';
import { Utils } from './utils';

async function cleanup() {
    try {
        core.startGroup('Cleanup JFrog CLI servers configuration');
        if (!Utils.addCachedCliToPath()) {
            return;
        }
        await Utils.removeJFrogServers();
        if (!core.getBooleanInput(Utils.JOB_SUMMARY_DISABLE)) {
            core.startGroup('Generate Job Summary');
            // Generate summary Markdown from data files
            try {
                await Utils.runCli(['generate-summary-markdown']);
            } catch (error) {
                core.error(`Failed to generate summary markdown: ${error}`);
            }
            // Combine to a unified report
            await Utils.setMarkdownAsJobSummary();
        }
    } catch (error) {
        core.setFailed((<any>error).message);
    } finally {
        core.endGroup();
    }
}

cleanup();
