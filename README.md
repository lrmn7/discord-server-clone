# Discord Server Clone

## Overview

Discord Server Clone is organized into small, focused modules so the main entrypoint stays lightweight and the behavior stays easier to maintain. The project keeps the interactive flow while separating CLI output, configuration, and cloning logic into dedicated files.

## Highlights

- Structured module layout under `src/`
- Interactive prompts for token, source server, and target server
- Role cloning with hierarchy handling
- Category, text channel, and voice channel cloning
- Permission overwrite mapping
- Optional server icon and name cloning
- Colored logs and progress indicators
- Delay controls to help reduce rate-limit pressure

## Project Layout

```text
discord-server-clone/
├── main.js
├── index.js.js
├── package.json
├── README.md
└── src/
     ├── app.js
     ├── cli/
     │   ├── banner.js
     │   ├── logger.js
     │   └── progress.js
     ├── cloner/
     │   ├── channels.js
     │   ├── cleanup.js
     │   ├── orchestrator.js
     │   └── roles.js
     ├── config/
     │   └── getConfig.js
     └── utils/
          ├── delay.js
          └── permissions.js
```

## Requirements

- Node.js 14.0.0 or higher
- A Discord account token
- Access to the source server
- Admin permissions on the target server

## Installation

1. Clone the repository.

    ```bash
    git clone https://github.com/lrmn7/discord-server-clone.git
    cd discord-server-clone
    ```

2. Install dependencies.

    ```bash
    npm install
    ```

3. Start the application.

    ```bash
    npm start
    ```

## Usage

1. Run `npm start`.
2. Enter your Discord token when prompted.
3. Enter the source server ID.
4. Enter the target server ID.
5. Choose whether to clone the server icon and name.
6. Wait until the cloning process finishes.

## Entry Points

- `npm start` runs `main.js`.

## Configuration

Runtime delay settings live in [src/app.js](src/app.js). Adjust them there if you want to change the cloning pace.

## Cloned Elements

| Feature | Status |
|---------|--------|
| Server Name | ✅ |
| Server Icon | ✅ |
| Roles | ✅ |
| Categories | ✅ |
| Text Channels | ✅ |
| Voice Channels | ✅ |
| Channel Permissions | ✅ |
| Channel Topics | ✅ |
| NSFW Settings | ✅ |
| User Limit (Voice) | ✅ |
| Bitrate (Voice) | ✅ |

## Not Cloned

- Messages
- Members
- Bans
- Invites
- Webhooks
- Integrations
- Nitro-only visual assets such as banner or splash

## Notes

- The project uses Discord.js selfbot v11, so behavior follows that API surface.
- Lower delays may increase the chance of rate limiting.
- The code is split by responsibility to make future changes safer.

## Disclaimer

This project is for educational purposes only. Using selfbots violates Discord's Terms of Service and may result in account restrictions or bans. Use at your own risk.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
