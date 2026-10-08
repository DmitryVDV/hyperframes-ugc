# How We Make UGC Videos: The Complete Workflow

**Instructions for Claude Code.** You take the creator from a folder of footage
to a finished MP4 for Reels. The creator talks to you and approves decisions;
you install tools, execute commands, start localhost previews, and render.
Do not ask a beginner to follow the command blocks manually.
We use a human creator, Claude Code connected to a GLM model, and HyperFrames.
The example uses the **Tsekh** design system: a dark palette, custom fonts,
rectangular text panels, and captions that highlight words as they are spoken.

For the beginner's starting prompts on macOS or Windows, see [README.md](README.md).
For automatic setup and the “Покажи пример” route, follow [CLAUDE.md](CLAUDE.md).
For a working composition, see [the headphones example](examples/headphones/README.md).
The author's example footage is for local study only; its use elsewhere requires
prior written permission. Read [the media usage rules](MEDIA-USAGE.md).

## Start with the creator, not package installation

When the creator asks to make their video, your first response must ask about
its topic, audience, and footage location. Ask no more than two questions per
message. Use details already supplied; do not ask the creator to repeat them.
A suitable first question in Russian is:

> О чём ролик и для кого? Где лежат исходные видео — в footage или другой папке?

Wait for the answers. Prepare missing tools yourself following CLAUDE.md, then
inspect the actual footage. Discuss duration after understanding the material.
Ask about music and typography at their stages, show choices, and wait for the
creator's answers. Do not submit a long intake form or start editing immediately.

Create the new composition in `work/<project-name>/`; raw footage can stay in
`footage/` or the creator's existing folder. These local working directories are
ignored by Git. Preserve the author's example composition and media.

## The seven steps

Always follow this order:

```text
1. INSPECT AND TRANSCRIBE  files → contact sheets → speech transcript
2. CHOOSE THE LENGTH      ask the creator: 30 / 60 / 90 seconds
3. APPROVE THE SCRIPT     speech → on-screen text → shot; creator reviews it
4. CHOOSE MUSIC AND SFX   confirm the source, level, and effects
5. CHOOSE TYPOGRAPHY      show examples; creator chooses the treatment
6. BUILD AND PREVIEW      trim → compose → check → review in Studio
7. RENDER AND VERIFY      after approval → MP4 → inspect the finished file
```

**Do not trim or assemble footage before step 6.** The script must be explicitly
approved, and the decisions about music and typography must be recorded first.

**The command blocks below are for you, the agent. Execute them yourself.**
They illustrate Bash syntax; on Windows, use the available Git Bash or adapt
them to your current shell. Resolve paths and values from the actual project.
Use the system temporary directory on each OS instead of assuming `/tmp` exists.
Before render-affecting operations, read the installed HyperFrames entry skill
and perform any required compatibility probe. Keep the example's 0.8.140 pin;
for new projects, verify the CLI version and use that version consistently.

## Step 1: Inspect the footage and transcribe the speech

Find out what each file contains: spoken material, silent gestures, ambient sound,
or an audio reference. Do not infer speech from the picture alone.

### 1.1 Record the technical details of each clip

```bash
cd work/my-reel/assets/footage/batch-name
for f in *.MOV; do
  ffprobe -v error -select_streams v:0 \
    -show_entries stream=width,height,r_frame_rate \
    -show_entries format=duration -of csv=p=0 "$f"
done
```

Record duration, resolution, and frame rate. Our source footage was vertical 4K,
2160×3840. Check an extracted frame as well as the stream dimensions: phone
footage can include rotation metadata that changes its displayed orientation.
Adjust the file pattern if your clips use another extension.

### 1.2 Make contact sheets

Create one JPEG per clip to see its contents at a glance. The following command
samples the footage and arranges thumbnails in a 6×2 grid:

```bash
mkdir -p /tmp/batch-name-sheets
for f in *.MOV; do
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  n=$(echo "$d" | awk '{printf "%d", ($1/12)+1}')
  ffmpeg -y -v error -i "$f" \
    -vf "fps=1/$n,scale=270:-1,tile=6x2" -frames:v 1 -q:v 3 \
    "/tmp/batch-name-sheets/${f%.MOV}.jpg"
done
```

These are working files. Do not add contact sheets or unrelated personal images
to the publication repository.

### 1.3 Check the audio level

```bash
for f in *.MOV; do
  ffmpeg -i "$f" -af volumedetect -f null - 2>&1 | grep mean_volume
done
```

These ranges were useful for our footage; they are a screening aid, not a speech
detector. Listen to the clip before deciding how to use it.

| Mean volume | Typical contents in this project | Editing decision |
| --- | --- | --- |
| −17 to −22 dB | Recorded speech | Candidate material for the script |
| −45 to −65 dB | Quiet background or reference sound | Inspect before treating it as speech |
| −90 dB or lower | Essentially silent gesture take | Use briefly, without claiming it contains speech |

### 1.4 Transcribe Russian speech explicitly

```bash
npx hyperframes transcribe clip.MOV \
  --engine whisper --model large-v3 --language ru \
  --dir /tmp/batch-name-transcripts --json
```

The `small.en` model is for English. In our Russian footage, using it produced
repeated English phrases that looked plausible but did not match the recording.
For this workflow, explicitly set `--model large-v3 --language ru`.

Whisper can also invent text over silence. Compare the transcript with the audio
and the measurements from section 1.3. A transcript that claims speech over a
silent take must be corrected before scripting.

### What must be ready before moving on

For every clip, record its duration, visible action, whether speech is present,
and the actual words with timestamps. These findings become the input to step 3.

## Step 2: Agree on the video length

Ask the creator explicitly and explain what each length can hold:

| Length | What it can hold | Typical use |
| --- | --- | --- |
| 30–40 seconds | A hook and two or three sections | A product introduction or one main point |
| About 60 seconds | A hook and roughly five sections | A standard UGC review |
| Up to 90 seconds | More detail or a short demonstration | A deeper review or an episode in a series |

The footage determines the useful length. If there is only a minute of meaningful
speech, extending it to 90 seconds adds repetition. Build the script around the
agreed duration. Mark omitted sections; they may become a separate follow-up.

These are discussion options, not fixed limits. The included headphones example
is longer: its final composition runs for 109.63 seconds.

## Step 3: Build the script from the speech and get approval

Prepare a table with one row per section:

| Field | Source |
| --- | --- |
| Source file and in/out timestamps | The transcript from step 1 |
| **Spoken words** | The recording, with repetitions removed only as agreed |
| **On-screen text** | The creator's wording; reproduce requested edits exactly |
| Shot | The visible action identified in the contact sheet |

Follow these rules:

- Build the script from what was actually said. Do not invent a spoken message
  because it would fit the picture.
- **Keep complete thoughts.** End a cut at a meaningful phrase boundary from the
  transcript, rather than at a convenient duration. The last word should finish
  the thought; the next word should begin a new one.
- Use the creator's requested on-screen wording exactly.
- After a script edit, reread the entire table to check the sequence.
- Start cutting only after explicit approval, such as **“The script is approved;
  go ahead and trim the footage.”**

## Step 4: Agree on music and sound effects

Ask the creator which source to use:

1. **A file supplied by the creator.** Confirm permission for the intended use.
   Extracting audio from another video does not establish permission to reuse it.
2. **Generated music.** Use the configured media workflow, such as local MusicGen
   or an available generation provider. Record its access and usage conditions.
3. **The HeyGen catalog.** Run `npx hyperframes auth login` yourself; if needed, let the creator complete
   the browser sign-in. Then select a
   suitable track, and record its source and permitted use.
4. **No music.** Speech and the sounds of handling the product may be enough.

For our speech-led videos, **10% of the track's original level** is the starting
point for background music. Listen to the mix and adjust it to keep speech clear.

If a track is shorter than the video, join repeated sections with a crossfade
and fade out the ending. This example makes a 59-second bed:

```bash
ffmpeg -i bgm.m4a -filter_complex \
  "[0:a]atrim=0:38.7,asetpts=PTS-STARTPTS[a1];\
   [0:a]atrim=0:21.5,asetpts=PTS-STARTPTS[a2];\
   [a1][a2]acrossfade=d=1.2:c1=tri:c2=tri,afade=t=out:st=57.5:d=1.5[out]" \
  -map "[out]" -c:a aac -b:a 160k bgm-loop.m4a
```

Change the trim and fade times for your agreed length.

### Sound effect selection

Our search order is [Pixabay Sound Effects](https://pixabay.com/sound-effects/),
then [Freesound](https://freesound.org/) with a **CC0** filter. Check the terms of
each downloaded asset and keep its source. If you use a file under CC-BY, provide
the attribution its license requires.

Search in English: `whoosh`, `swoosh`, `riser`, `impact`, `hit`, `pop`, `UI click`,
`glitch`, `typing`, `transition`, `camera shutter`, `notification`, `ambience`.

| Effect | Placement in this workflow |
| --- | --- |
| Whoosh or transition | A cut between sections |
| Pop or click | The appearance of a text panel |
| Impact or hit | The title or a punch line |
| Camera shutter | A product freeze frame |
| Ambience | A silent gesture take |

Save selected files in `assets/audio/sfx/`. Levels around 0.3–0.5 were useful in
our project, but set the final level by listening. Align the effect with the
action or cut it supports.

The published example contains no music bed: the source license of the working
track was not retained. Its demonstration video uses the recorded speech instead.

## Step 5: Choose typography and effects

Show examples before committing to a caption treatment. Typography is a large
part of the video's visual identity.

Run `npx hyperframes docs examples` yourself to find composition examples, browse
the [HyperFrames website](https://hyperframes.heygen.com/), or see the treatment
over actual footage in Studio.

Search the block catalog before implementing an effect:

```bash
npx hyperframes catalog --query "caption wipe" --json
npx hyperframes add caption-clip-wipe
```

The search does not install anything. The second command installs the selected
component, which can then be wired into the composition. Other useful queries
include `kinetic type`, `glitch`, `film grain`, `zoom transition`, and `count-up`.

The `caption-clip-wipe` component is an example of a word-timed reveal treatment.
Our final example uses a different behavior: the entire phrase is visible from
the beginning, and its words change color as they are spoken.

### The default Tsekh style

Ask the creator whether to keep this style or choose another:

| Role | Typeface | Weight and size | Use |
| --- | --- | --- | --- |
| hook | Alumni Sans Black | 900, 88–132 px, uppercase | Opening hook |
| kicker | JetBrains Mono | 700, 26 px, uppercase | Section labels |
| callout | Golos Text | 700, 36–40 px | On-screen text panels |
| cta | Golos Text | 800, 46 px | Closing call to action |

The background is `#17181A`, text is `#EDEAE3`, and the accent is yellow
`#E0DD1F`, or `rgb(224, 221, 31)`. Caption panels use a dark translucent fill;
the standard panel token is `rgba(23, 24, 26, 0.86)`, with 24/30 px padding and
square corners. See [the example's design notes](examples/headphones/frame.md)
and [CSS tokens](examples/headphones/assets/tokens.css) for the implementation.

### Word timing for karaoke captions

- Store word timings in `assets/wipe-words.js`, exposed as `window.__WIPE_DATA`.
  Generate them from the word-level transcript and the source-to-segment cut map.
- **Regenerate the word data after changing the cuts.** Otherwise, the highlights
  will drift away from the speech.
- Correct known transcription mistakes, discard words with zero duration, and
  remove hallucinated repetitions. Break caption groups at segment boundaries.
- Keep dimmed words readable. Our large caption text uses at least a 3:1 contrast
  target; the example's unspoken words use `rgba(237, 234, 227, 0.66)` over the
  dark panel. Check the actual result over the footage.
- Place closing callouts after the last karaoke phrase so they do not overlap.
  The layout audit can report such collisions as `content_overlap`.

## Step 6: Build the composition and review it

### 6.1 Apply the Reels safe areas

For a 1080×1920 vertical canvas, our working margins are:

| Edge | Margin |
| --- | --- |
| Top | 220 px |
| Bottom | 480 px |
| Left | 72 px |
| Right, for captions | 180 px |

The title/content band spans x=72…1008; the narrower caption band spans
x=72…900. Keep captions clear of the username, description, and action buttons.
These are project layout choices: check the current platform interface when
preparing your own video.

```text
┌──────────────────────────┐ 1080 px wide
│ TOP UI AREA              │ 220 px reserved above titles
│                          │
│ TITLE AREA               │ from y=220; x=72…1008
│                          │
│ FULL-FRAME VIDEO         │
│                          │
│ CAPTION AREA             │ x=72…900; around y=1330…1440
│                          │
│ BOTTOM UI AREA           │ 480 px below the caption area
└──────────────────────────┘
```

Caption rules for this workflow:

1. **Use one font size throughout the video.** Do not resize each phrase to fit.
   Our karaoke captions use Alumni Sans Black at 58 px.
2. **Keep captions inside the agreed safe area.**
3. **Show the whole phrase immediately.** Highlight words in `#E0DD1F` as they
   are spoken; already spoken words stay highlighted. Replace phrases with a
   hard cut rather than an entrance animation.
4. Use word-level speech timings, not estimated timings.

The saved example uses `bottom: 470px` for its karaoke container. That is the
existing HTML value; use the agreed 480 px margin when applying this guide to a
new composition.

### 6.2 Trim the approved segments

Replace `START`, `SOURCE.mov`, `DURATION`, and `segment.mp4` with actual values:

```bash
ffmpeg -ss START -i SOURCE.mov -t DURATION \
  -vf "scale=1080:1920:flags=lanczos,fps=30" \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" \
  -c:v libx264 -crf 18 -g 30 -keyint_min 30 -sc_threshold 0 \
  -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart segment.mp4
```

This example assumes vertical source footage with the correct aspect ratio.
Crop or pad deliberately if your footage differs; do not stretch the picture.

Use one file per segment. At 30 fps, `-g 30` gives a keyframe every second, which
helped prevent black frames during seeking in our project. Normalize each speech
segment to the project's target of −16 LUFS.

### 6.3 Assemble the HyperFrames composition

- For audible footage, use `data-has-audio="true"`, `data-volume="1"`, and
  `playsinline`.
- Place background music in a separate `<audio>` element with an `id` and, as a
  starting point, `data-volume="0.1"`.
- Apply the agreed title, section-label, and caption tokens.
- Our motion defaults are a 0.52-second entrance with `power4.out`, a
  0.08-second stagger, and a 0.30-second exit followed by a hard hide.
- Word highlighting changes color only; it must not shift the text's geometry.

### 6.4 Check the composition before showing it

```bash
npm run check
npx hyperframes snapshot --at 3,12,22 --no-end
```

Choose snapshot times that cover the important sections, text transitions, and
cuts. Resolve errors and inspect the frames for contrast, missing media, clipped
text, overlaps, and black frames. Brightness can help flag a blank frame, but a
single numeric threshold is not a substitute for looking at the image.

Start a persistent Studio preview for the creator:

```bash
npx hyperframes preview --background
npx hyperframes preview --status
```

Read the actual port printed by the CLI and verify that Studio responds with
HTTP 200. Check project discovery, then share
`http://localhost:<actual-port>/#project/<project-name>` using the actual project
directory name, URL-encoded if needed. Keep the server running during review.
Do not announce a localhost URL before verifying that the server works. Use a
pinned CLI invocation when the project is pinned, including for status and stop.
When the creator finishes review or asks you to stop:

```bash
npx hyperframes preview --stop
```

The included example pins CLI 0.8.140. Follow [CLAUDE.md](CLAUDE.md) to show it
automatically. For a new project, generate and execute the appropriate scripts yourself.

## Step 7: Render after approval and verify the MP4

**Reread `index.html` from disk before rendering.** Studio edits can change the
saved timings, durations, and attributes. The renderer uses the saved file, not
the version an agent remembers. Preserve the creator's edits when making yours.

After the creator explicitly approves the preview:

```bash
npm run render
```

For this workflow, the render script in `package.json` must use **one worker**:
`hyperframes render -w 1`. In our multi-video compositions, parallel workers
produced black clips even when `check` passed and the render exited successfully.

Inspect the finished MP4, including its audio. Make a contact sheet, look at the
cuts and closing frames, and compare the duration with the approved script.
A successful render log does not prove that the video is correct. Give the
creator the verified output file path and a brief account of checks actually run.

## Final checklist

- [ ] The creator approved the script and the on-screen wording.
- [ ] Every segment contains the intended speech or an explicitly chosen silent take.
- [ ] Speech is normalized to the project target; background music stays behind it.
- [ ] Text respects the agreed safe areas and fixed caption size.
- [ ] `npm run check` ran successfully; its browser audits actually ran.
- [ ] Key snapshots show the correct footage, readable text, and no unintended black frames.
- [ ] The creator saw the preview and explicitly approved rendering.
- [ ] Rendering used `-w 1`; the finished MP4 was inspected, not just its log.
- [ ] The final length matches the approved script.
- [ ] Music, effects, and footage have the permissions required for the intended use.

## Troubleshooting lessons from this project

| Symptom | Likely cause in our project | What to check or change |
| --- | --- | --- |
| Repeated English phrases in a Russian transcript | English-only `small.en` model | Use `--model large-v3 --language ru` and verify the transcript |
| A transcript claims speech over a silent clip | Whisper hallucination | Compare with `volumedetect` and listen to the source |
| Black clips in a render despite a passing check | Parallel capture of multiple videos | Render with `-w 1` and inspect the MP4 |
| A clip goes black when seeking | Keyframes are too sparse | Re-encode with `-g 30 -keyint_min 30` at 30 fps |
| Music ends before the video | The music bed is too short | Extend it with `acrossfade` and finish with `afade` |
| Captions sit under Reels controls | The safe area was ignored | Apply the project's 220/480/72/180 px margins and review on the platform |
