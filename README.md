# Jarurat Care Website

Jarurat Care website is built using Svelte. It is powered by SvelteKit.

## Developing

Once you've cloned the repository and installed dependencies with `npm
install`, start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of Jarurat Care Website:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Contributing

Please create a separate branch for your changes. Here are some common prefix
that you could use:

- Bugs and Issues: `bugfixes/branch-name`
- New Feature: `features/feature-branch-name`
- Hotfixes: `hotfixes/fix-desc`
- ...and so on.

When making a Pull Request (PR), please make it to the `develop` branch. The
`prod` branch is protected and will only be updated when a new release is made.

```text
# git PR workflow
features/nav-bar -> develop -> prod -> deployed to jarurat.care
```
