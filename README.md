# Texkit

A library to help build web applications for Texas.gov

## Getting Started

### To make sure you are pulling latest version, check tags before adding to your project. You can either look in the repository itself or if you have the project cloned you can run the following.

```BASH
git fetch && git describe --tags `git rev-list --tags --max-count=1`
```

```BASH
npm i git+http://100.71.11.29:7990/scm/tex/texkit_ui_library.git#v2.0.0-canary.21
yarn add git+http://100.71.11.29:7990/scm/tex/texkit_ui_library.git#v2.0.0-canary.21
```

Include Texas font

```HTML
<!-- Texas standard fonts -->
<link
  href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,400;0,500;0,600;0,700;0,900;1,400;1,700;1,900&display=swap"
  rel="stylesheet"
/>
```

Include relevent css in your global stylesheet

```CSS
/* Import all texkit styles (common for brand new projects) */
@import "~texkit-ui/styles/texkit.css";

/* Or import each bit independently (When integrating into existing projects or when you don't need the whole thing) */
@import "~texkit-ui/styles/vars.css";
@import "~texkit-ui/styles/global.css";
@import "~texkit-ui/styles/spacing.css";

@import "~texkit-ui/styles/alert-banner.css";
@import "~texkit-ui/styles/alert.css";
@import "~texkit-ui/styles/button.css";
@import "~texkit-ui/styles/card.css";
@import "~texkit-ui/styles/checkbox.css";
@import "~texkit-ui/styles/input.css";
@import "~texkit-ui/styles/loading-text.css";
@import "~texkit-ui/styles/modal.css";
@import "~texkit-ui/styles/progress.css";
@import "~texkit-ui/styles/radio-group.css";
@import "~texkit-ui/styles/radio.css";
@import "~texkit-ui/styles/select.css";
```

### Import components from library

```TS
import { Checkbox } from 'texkit-ui';

// import { Checkbox } from 'texkit-ui/components';
// import { WarningIcon } from 'texkit-ui/icons';
// import { FocusTrap } from 'texkit-ui/utils';
```

## Development

All code changes should happen under the `src` directory. All other directories are artifacts since we diistribute this repo as the installable package as well as the source code.

Git hooks will run on every commit and every push to make sure that the latest build is part of each commit and that tests are run.

### Install deps:

```BASH
npm i
```

### Run storybook:

```BASH
npm run storybook
```

## Styling

All styling for components should be done with vanilla css under `src/styles` and very closely follow [BEM](http://getbem.com/introduction/).
This gives us flexibility in downstream tooling meaning the library should work out of the box with most if not all projects.

## Cut canary release

This branch is to do work for the next or "canary" version of texkit.

```BASH
npm version prerelease --preid canary
```

```BASH
git push && git push --tags
```
