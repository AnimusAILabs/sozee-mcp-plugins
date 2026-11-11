#!/usr/bin/env node
// Regenerates every client config, the one-click links and docs/install-links.json
// from the constants below. Run: node scripts/build.mjs   (add --check to fail on drift)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const NAME = 'sozee';
const URL = 'https://mcp.sozee.ai/mcp';
const VERSION = '0.1.0';
const DESCRIPTION = 'Make photos and video of your AI character, schedule posts and read results in a Sozee account.';
const REPO = 'https://github.com/AnimusAILabs/sozee-mcp-plugins';
const check = process.argv.includes('--check');
let drift = false;

const json = (v) => JSON.stringify(v, null, 2) + '\n';
function out(rel, text) {
  const path = join(ROOT, rel);
  let prev = null;
  try { prev = readFileSync(path, 'utf8'); } catch {}
  if (prev === text) return;
  if (check) { drift = true; console.error(`out of date: ${rel}`); return; }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
  console.log(`wrote ${rel}`);
}

// Skill body shared by every agent-instruction file.
const skill = readFileSync(join(ROOT, 'plugins/sozee/skills/sozee/SKILL.md'), 'utf8');
const skillBody = skill.replace(/^---\n[\s\S]*?\n---\n+/, '');
out('antigravity/sozee/skills/sozee/SKILL.md', skill);
out('GEMINI.md', skillBody);

// Per-client configs.
const claude = { mcpServers: { [NAME]: { type: 'http', url: URL } } };
const cursorEntry = { url: URL };
const cursor = { mcpServers: { [NAME]: cursorEntry } };
const vscodeEntry = { type: 'http', url: URL };
const vscode = { servers: { [NAME]: vscodeEntry } };
const gemini = {
  name: NAME, version: VERSION, description: DESCRIPTION,
  contextFileName: 'GEMINI.md',
  mcpServers: { [NAME]: { httpUrl: URL } },
};
const antigravity = { mcpServers: { [NAME]: { serverUrl: URL } } };
const devin = { mcpServers: { [NAME]: { url: URL, transport: 'http' } } };
const zed = { context_servers: { [NAME]: { url: URL } } };
const codex = `[mcp_servers.${NAME}]\nurl = "${URL}"\n`;

out('plugins/sozee/.mcp.json', json(claude));
out('cursor/mcp.json', json(cursor));
out('vscode/mcp.json', json(vscode));
out('gemini-extension.json', json(gemini));
out('antigravity/sozee/mcp_config.json', json(antigravity));
out('devin/mcp_config.json', json(devin));
out('zed/settings.json', json(zed));
out('codex/config.toml', codex);

// One-click links.
const cursorB64 = Buffer.from(JSON.stringify(cursorEntry)).toString('base64');
const cursorLink = `cursor://anysphere.cursor-deeplink/mcp/install?name=${NAME}&config=${cursorB64}`;
// Cursor's template inserts the base64 as is; keep it free of characters a URL would need escaped.
assert.match(cursorB64, /^[A-Za-z0-9=]+$/);
const vscodeQuery = encodeURIComponent(JSON.stringify({ name: NAME, ...vscodeEntry }));
const vscodeLink = `vscode:mcp/install?${vscodeQuery}`;
const vscodeInsidersLink = `vscode-insiders:mcp/install?${vscodeQuery}`;
const vscodeWebLink = `https://vscode.dev/redirect?url=${encodeURIComponent(vscodeLink)}`;
const vscodeInsidersWebLink = `https://vscode.dev/redirect?url=${encodeURIComponent(vscodeInsidersLink)}`;

// Round-trip checks.
assert.deepEqual(JSON.parse(Buffer.from(cursorLink.split('config=')[1], 'base64').toString()), cursorEntry);
assert.deepEqual(JSON.parse(decodeURIComponent(vscodeLink.split('?')[1])), { name: NAME, ...vscodeEntry });
assert.equal(new globalThis.URL(vscodeWebLink).searchParams.get('url'), vscodeLink);

const clients = [
  { id: 'claude', name: 'Claude (web, desktop and mobile)', kind: 'connector',
    steps: [
      'Open Customize, then Connectors.',
      'Select + Add, then Add custom connector.',
      'Name it Sozee and paste the server URL: ' + URL,
      'Select Continue, keep the detected sign-in settings, then Add.',
      'Connect and sign in to your Sozee account.',
      'On Team and Enterprise plans an owner adds it under Organization settings, Connectors (Add, Custom, Web); members then select Connect.',
    ],
    source: 'https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp' },
  { id: 'chatgpt', name: 'ChatGPT', kind: 'connector',
    steps: [
      'Go to chatgpt.com/plugins.',
      'Select the plus button, then Add custom MCP server.',
      'Name it Sozee and add a short description.',
      'Under Connection choose Public endpoint and paste the server URL: ' + URL,
      'Choose OAuth for authentication, review the warning and continue.',
      'Select Create as a plugin, then sign in to your Sozee account.',
      'Your account or workspace settings decide whether custom MCP servers are allowed.',
    ],
    source: 'https://developers.openai.com/apps-sdk/deploy/connect-chatgpt' },
  { id: 'claude-code', name: 'Claude Code', kind: 'config',
    config: `/plugin marketplace add AnimusAILabs/sozee-mcp-plugins\n/plugin install sozee@sozee`, configLang: 'text',
    steps: [
      'Add the marketplace and install the plugin (commands above), or run: claude mcp add --transport http sozee ' + URL,
      'Run /mcp and sign in to Sozee.',
    ],
    source: 'https://code.claude.com/docs/en/plugin-marketplaces' },
  { id: 'cursor', name: 'Cursor', kind: 'oneclick', link: cursorLink,
    config: json(cursor), configLang: 'json',
    steps: ['Open the link to install, or add the config to ~/.cursor/mcp.json (all projects) or .cursor/mcp.json (one project).', 'Sign in to Sozee when Cursor asks.'],
    source: 'https://cursor.com/docs/mcp/install-links' },
  { id: 'vscode', name: 'VS Code', kind: 'oneclick', link: vscodeLink, webLink: vscodeWebLink,
    config: json(vscode), configLang: 'json',
    steps: ['Open the link and select Install, or add the config to .vscode/mcp.json.', 'Sign in to Sozee when VS Code asks.'],
    source: 'https://code.visualstudio.com/api/extension-guides/ai/mcp' },
  { id: 'vscode-insiders', name: 'VS Code Insiders', kind: 'oneclick', link: vscodeInsidersLink, webLink: vscodeInsidersWebLink,
    config: json(vscode), configLang: 'json',
    steps: ['Open the link and select Install.', 'Sign in to Sozee when asked.'],
    source: 'https://code.visualstudio.com/api/extension-guides/ai/mcp' },
  { id: 'codex', name: 'Codex CLI', kind: 'config', config: codex, configLang: 'toml',
    steps: ['Add this to ~/.codex/config.toml, or run: codex mcp add sozee --url ' + URL, 'Run: codex mcp login sozee'],
    source: 'https://learn.chatgpt.com/docs/extend/mcp?surface=cli' },
  { id: 'gemini-cli', name: 'Gemini CLI', kind: 'config', config: `gemini extensions install ${REPO}`, configLang: 'bash',
    steps: ['Install the extension with the command above.', 'Sign in to Sozee when Gemini CLI asks.'],
    source: 'https://geminicli.com/docs/extensions/reference/' },
  { id: 'antigravity', name: 'Antigravity', kind: 'config', config: json(antigravity), configLang: 'json',
    steps: ['Add this to ~/.gemini/config/mcp_config.json (all projects) or .agents/mcp_config.json (one project), or install the plugin in antigravity/sozee from a clone of this repo with: agy plugin install ./antigravity/sozee', 'Authenticate Sozee under Customizations, Installed, MCP Servers.'],
    source: 'https://antigravity.google/docs/mcp' },
  { id: 'zed', name: 'Zed', kind: 'config', config: json(zed), configLang: 'json',
    steps: ['Add this to your Zed settings.json.', 'Sign in to Sozee when Zed asks.'],
    source: 'https://zed.dev/docs/ai/mcp' },
  { id: 'devin', name: 'Devin Desktop and CLI', kind: 'config', config: json(devin), configLang: 'json',
    steps: ['Add this to ~/.config/devin/mcp_config.json (all projects) or .devin/mcp_config.json (one project).', 'Select Authenticate when Sozee shows Needs authentication.'],
    source: 'https://docs.devin.ai/cli/extensibility/mcp/configuration.md' },
];
out('docs/install-links.json', json({ server: { name: 'ai.sozee/mcp', url: URL, version: VERSION }, clients }));

if (check && drift) process.exit(1);
console.log(check ? 'all generated files up to date' : 'done');
console.log(`\ncursor:  ${cursorLink}\nvscode:  ${vscodeLink}\ninsiders: ${vscodeInsidersLink}\nvscode web: ${vscodeWebLink}`);
