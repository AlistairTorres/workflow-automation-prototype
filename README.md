# Workflow Automation Prototype

A focused three-stage workflow board for turning small pieces of work into visible progress.

## Highlights

- Move tasks through **To do**, **In progress** and **Done**
- Drag cards between stages or advance them with keyboard-friendly controls
- Persist board state in the browser
- Show live counts and status feedback as work changes
- Adapt the board layout for narrow screens

## Technical approach

The project uses semantic HTML, a small dependency-free state layer and event delegation. Tasks are validated when loaded, updates are persisted as JSON, and the view is rendered from the current state rather than edited ad hoc.

## Run locally

Open taskflow.html in a modern browser. No build step or package installation is required.

The project explores the interaction patterns behind lightweight workflow tools: capture, movement, state visibility and a clear sense of progress.
