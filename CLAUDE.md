# Claude Code: run this project for the creator

This project was made with Claude Code connected to a Chinese GLM model and
HyperFrames. Reply in the user's language. The user is a beginner: they describe
the result and approve creative choices; **you run the tools and commands**.
Never hand them a list of packages to install or shell commands to copy.

Read [VIDEO-WORKFLOW.md](VIDEO-WORKFLOW.md) before making a new video.
Use the following routes for the user's request.

## Prepare / install HyperFrames

When asked to prepare the project, perform setup yourself:

1. Detect the operating system, available shell and package managers. Check
   Node.js (22+), npm/npx, Git, FFmpeg and ffprobe. Reuse working installations.
2. Install missing prerequisites through the available supported package manager
   or official installer. On macOS, use Homebrew if available; on Windows, use
   winget if available. Consult current official installation instructions when
   a tool or package manager is absent. Do not paste a manual setup checklist
   back to the user. Ask for the specific system approval only when it is needed.
3. Install the HyperFrames Claude plugin using the official commands below,
   after checking whether it is already installed. Execute these yourself:

   ```bash
   claude plugin marketplace add heygen-com/hyperframes
   claude plugin install hyperframes@hyperframes
   ```

   If this Claude session needs reopening to load the plugin, explain that one
   action to the user and resume setup afterward. If plugin installation is
   unavailable, consult `npx hyperframes skills --help` and install the standalone
   skills with `npx hyperframes skills update` for Claude Code. Choose one route;
   do not install duplicate sets of skills.
4. Read the installed HyperFrames entry skill and follow its setup/doctor/browser
   guidance. Install a missing browser or transcription dependency yourself when
   required, using the CLI's current help. Do not install transcription models
   just to show the supplied example.
5. Verify the CLI and the required executables in the environment used by Claude.
   An installer exit code is insufficient if PATH has not updated. Report what
   is ready and any real remaining blocker; do not claim a tool works without
   checking it.

Official sources: [HyperFrames](https://github.com/heygen-com/hyperframes),
[Claude Code setup](https://code.claude.com/docs/en/setup).
Claude Code + GLM setup is in the user's
[china-models guide](https://github.com/DmitryVDV/china-models).
Never request an API key or password in chat, save one in this project, or print
credentials. Use existing local provider configuration. Browser login, a system
password and application permission dialogs may require the user's participation.

## “Покажи пример” / show the example

This means **open the supplied headphones composition**, not start a questionnaire
for a new film. Prepare missing tools yourself, then:

1. Work in `examples/headphones/`. Preserve its pinned HyperFrames 0.8.140 and
   source files. Run an upgrade compatibility probe if the installed skill
   requires it; do not upgrade this example automatically.
2. Start a managed persistent preview from that directory:

   ```bash
   npx --yes hyperframes@0.8.140 preview --background
   npx --yes hyperframes@0.8.140 preview --status
   ```

3. Read the actual port from CLI output. Verify the Studio endpoint with an HTTP
   request and check that the project is discoverable. Hand off its project URL:
   `http://localhost:<actual-port>/#project/headphones`. Never invent a port or
   announce an unverified URL.
4. Explain briefly how to play the example. Keep the preview server running
   throughout review. Stop it only when the user asks or finishes that review.

If the environment genuinely cannot run a local server, explain the specific
blocker and offer `examples/headphones/demo.mp4` as a temporary viewing option.
Do not claim a localhost preview started when it failed.

## Create my video / follow VIDEO-WORKFLOW.md

**Begin with questions, then do the work.** Ask at most two questions at a time.
First find out what the video is about, who it is for, and where the footage is.
If the prompt already answers a question, use that answer. Accept `footage/` or
an existing folder path. Use ordinary language; explain creative options with
examples rather than asking the creator to configure technical flags.

Prepare any missing tools yourself. Inspect and transcribe the actual footage,
then discuss the useful length. Follow these stages in order:

1. Inspect files and transcribe speech accurately.
2. Agree on a length that the material can support.
3. Present and get explicit approval of the script, including on-screen wording.
4. Agree on music and sound effects; accept “no music.”
5. Show and agree on typography and visual style.
6. Trim, build, validate, and start a verified persistent localhost preview.
7. After explicit preview approval, render with one worker and inspect the MP4.

Do not cut before the script, music and style choices are approved. Do not render
the final MP4 before preview approval. Read saved `index.html` immediately before
rendering so edits made in Studio are preserved.

Create each new composition in `work/<project-name>/`. Keep a local `frame.md`
there and retain these instructions, either through this ancestor `CLAUDE.md` or
a local copy. Use the example's design and code as a reference; **do not copy its
video clips, face or voice into a new project**. Use only the creator's materials.
Create `footage/` and `work/` if needed. Raw footage, working projects, transcripts,
screenshots and credentials stay local and are ignored by Git. Do not publish or
push anything unless specifically asked.

## Editing and delivery rules

- Follow the detailed workflow's speech, timing, safe-area and caption rules.
- Ask for missing creative decisions, not permission to run every routine command.
- Show previews when the creator needs to choose a style or review an edit.
- Resolve validation errors; inspect text, cuts, audio and blank frames.
- Rebuild word timings after changing cuts. Keep caption geometry stable while
  highlighting spoken words.
- Report only checks actually performed. If a browser check fails to run, say so.
- Hand off the verified final file path and keep the approved project available.
- Follow [MEDIA-USAGE.md](MEDIA-USAGE.md) for all example media.
