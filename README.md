# Sozee for AI assistants

Use your Sozee account from Claude, ChatGPT, Cursor, VS Code and other AI assistants. Ask for a photo of your character, a short video or a week of posts, and your assistant does it in your account.

Server URL: `https://mcp.sozee.ai/mcp`

You need a Sozee account. [Sign up](https://app.sozee.ai/sign-up) if you don't have one. Sozee is for adults 18 and over.

## What you can do

- Create an AI character, then update its look and backstory.
- Make photos and photoshoots of your character, then edit, crop and upscale them.
- Plan and render short-form video: UGC-style videos, ads, reel clones and photos brought to life.
- Organize boards, your vault and your library of outfits, places and objects.
- Schedule posts to your connected social accounts and see how they did.
- Research trends, viral posts and creators.
- Check your plan, credits and prices.

## How sign-in works

There are no API keys. The first time your assistant uses Sozee, it opens a browser window where you sign in to your Sozee account and approve access. You can disconnect at any time from the assistant's settings.

## Credits and safety

Anything that costs credits is quoted first. Your assistant tells you the price, and nothing is charged until you confirm. The same goes for deleting things or disconnecting an account. Everything you make follows the same plan limits and content rules as the Sozee website.

## Install

### Claude (web, desktop and mobile)

Works on every Claude plan. The Free plan allows one custom connector.

1. Open **Customize**, then **Connectors**.
2. Select **+ Add**, then **Add custom connector**.
3. Name it `Sozee` and paste `https://mcp.sozee.ai/mcp`.
4. Select **Continue**, keep the detected sign-in settings and select **Add**.
5. Connect and sign in to your Sozee account.

On Team and Enterprise plans an owner adds the connector under **Organization settings**, **Connectors** (**Add**, **Custom**, **Web**). Members then find it under **Customize**, **Connectors** and select **Connect**.

### ChatGPT

1. Go to [chatgpt.com/plugins](https://chatgpt.com/plugins).
2. Select the plus button, then **Add custom MCP server**.
3. Name it `Sozee` and add a short description.
4. Under **Connection**, choose **Public endpoint** and paste `https://mcp.sozee.ai/mcp`.
5. Choose OAuth for authentication, review the warning and continue.
6. Select **Create as a plugin**, then sign in to your Sozee account.

Whether you can add a custom MCP server depends on your ChatGPT plan and, on work accounts, your workspace settings.

### Claude Code

Install the plugin. It adds the server and a short guide that helps Claude work well with Sozee.

```text
/plugin marketplace add AnimusAILabs/sozee-mcp-plugins
/plugin install sozee@sozee
```

Then run `/mcp` and sign in to Sozee. To add only the server:

```bash
claude mcp add --transport http sozee https://mcp.sozee.ai/mcp
```

### Cursor

Open this link in your browser to install:

```text
cursor://anysphere.cursor-deeplink/mcp/install?name=sozee&config=eyJ1cmwiOiJodHRwczovL21jcC5zb3plZS5haS9tY3AifQ==
```

Or add this to `~/.cursor/mcp.json` (all projects) or `.cursor/mcp.json` (one project):

```json
{
  "mcpServers": {
    "sozee": {
      "url": "https://mcp.sozee.ai/mcp"
    }
  }
}
```

### VS Code

[Install in VS Code](https://vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522sozee%2522%252C%2522type%2522%253A%2522http%2522%252C%2522url%2522%253A%2522https%253A%252F%252Fmcp.sozee.ai%252Fmcp%2522%257D) · [Install in VS Code Insiders](https://vscode.dev/redirect?url=vscode-insiders%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522sozee%2522%252C%2522type%2522%253A%2522http%2522%252C%2522url%2522%253A%2522https%253A%252F%252Fmcp.sozee.ai%252Fmcp%2522%257D)

Or add this to `.vscode/mcp.json`:

```json
{
  "servers": {
    "sozee": {
      "type": "http",
      "url": "https://mcp.sozee.ai/mcp"
    }
  }
}
```

### Codex CLI

```bash
codex mcp add sozee --url https://mcp.sozee.ai/mcp
codex mcp login sozee
```

Or add this to `~/.codex/config.toml`, then run `codex mcp login sozee`:

```toml
[mcp_servers.sozee]
url = "https://mcp.sozee.ai/mcp"
```

### Gemini CLI

```bash
gemini extensions install https://github.com/AnimusAILabs/sozee-mcp-plugins
```

### Antigravity

Add this to `~/.gemini/config/mcp_config.json` (all projects) or `.agents/mcp_config.json` (one project), then authenticate Sozee under **Customizations**, **Installed**, **MCP Servers**:

```json
{
  "mcpServers": {
    "sozee": {
      "serverUrl": "https://mcp.sozee.ai/mcp"
    }
  }
}
```

The `antigravity/sozee` folder is also a plugin with the same guide as the Claude Code plugin. From a clone of this repository, run `agy plugin install ./antigravity/sozee`.

### Zed

Add this to your Zed `settings.json`. Zed asks you to sign in the first time.

```json
{
  "context_servers": {
    "sozee": {
      "url": "https://mcp.sozee.ai/mcp"
    }
  }
}
```

### Devin

Add this to `~/.config/devin/mcp_config.json` (all projects) or `.devin/mcp_config.json` (one project), then select **Authenticate**:

```json
{
  "mcpServers": {
    "sozee": {
      "url": "https://mcp.sozee.ai/mcp",
      "transport": "http"
    }
  }
}
```

### Other assistants

Any assistant that supports remote MCP servers over Streamable HTTP with OAuth sign-in can use `https://mcp.sozee.ai/mcp`. Sozee is listed in the MCP Registry as `ai.sozee/mcp`.

## What's in this repository

| Path | What it is |
| --- | --- |
| `.claude-plugin/marketplace.json`, `plugins/sozee/` | Claude Code marketplace and plugin |
| `server.json` | MCP Registry entry |
| `gemini-extension.json`, `GEMINI.md` | Gemini CLI extension |
| `antigravity/sozee/` | Antigravity plugin |
| `cursor/`, `vscode/`, `codex/`, `zed/`, `devin/` | Ready-to-copy configs |
| `docs/install-links.json` | Every install link and config, for sozee.ai |
| `scripts/build.mjs` | Regenerates the configs, links and `docs/install-links.json` |

The guide for assistants lives in `plugins/sozee/skills/sozee/SKILL.md`. After editing it, run `node scripts/build.mjs` to update the copies.

## Help

- Sozee for AI assistants: [sozee.ai/mcp](https://www.sozee.ai/mcp)
- Guides: [sozee.ai/guides](https://www.sozee.ai/guides)
- Support: [support@sozee.ai](mailto:support@sozee.ai)

## License

[MIT](LICENSE)
