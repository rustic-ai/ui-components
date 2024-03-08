# Contributing to UI Components for Rustic AI

Thank you for considering contributing to UI Components for Rustic AI! 🎉 Every little bit
helps, and credit will always be given. To ensure a smooth contribution process, please follow the guidelines outlined below.

You can contribute in many ways:

## Types of Contributions

### Report Bugs

Report bugs at <https://github.com/rustic-ai/ui-components/issues>.

If you are reporting a bug, please include:

- Your operating system name and version.
- Any details about your local setup that might be helpful in troubleshooting.
- Detailed steps to reproduce the bug.

### Fix Bugs

Look through the GitHub issues for bugs. Anything tagged with "bug" and "help
wanted" is open to whoever wants to implement it.

### Implement Features

Look through the GitHub issues for features. Anything tagged with "enhancement"
and "help wanted" is open to whoever wants to implement it.

### Write Documentation

Rustic UI could always use more documentation, whether as part of the
official Rustic UI docs, or even on the web in blog posts,
articles, and such.

### Submit Feedback

The best way to send feedback is to file an issue at <https://github.com/rustic-ai/ui-components/issues>.

If you are proposing a feature:

- Explain in detail how it would work.
- Keep the scope as narrow as possible, to make it easier to implement.
- Remember that this is a volunteer-driven project, and that contributions
  are welcome :)
- Check existing issues to avoid duplicates.

## Creating a Pull Request

### Pull Request Guidelines

Before you submit a pull request, check that it meets these guidelines:

1. The pull request should include tests and Storybook stories if applicable.
2. If the pull request adds functionality, the component's storybook description should be updated.
3. Remember to sign your commits. Commit signature verification is needed to merge your pull request. Refer to [GitHub's documentation about signing commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)

### Conventions

Thank you for considering contributing to Rustic UI! In our project, we maintain specific naming and style conventions to ensure consistency, readability, and maintainability. These conventions play a crucial role in helping developers understand the purpose and usage of different elements within the codebase. By adhering to these conventions, our codebase becomes more organized, easier to navigate, and less prone to errors.

- **File Names**: Please name files in camelCase.
- **Component Naming**: If a component relies on another library for its main feature, prefix the component with the library name.
  - For example, our `OpenLayersMap` component is a map component that relies on the OpenLayers library.
- **CSS Styles**: Try to avoid using MUI `sx` props for styling components and use CSS `className` instead. When doing this, be sure to prefix with `rustic`, followed by the component name in kebab-case, followed by the subcomponent.
  - For example, use `rustic-recharts-time-series-title` for a title component within the `RechartsTimeSeries` component or `rustic-recharts-time-series` for the component itself.
- **Function Naming**: Functions should have descriptive names that start with a verb and specify the type of output.
- **Variable Naming**:
  - Prefix `maybe` to the variable name if the variable can be undefined.
  - Prefix `is` or `has` to the variable name if the variable is of type boolean.
  - Avoid verb-like names to avoid confusion with function names.

For other conventions, our codebase follows the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html).

### Set Up

Ready to contribute? Here's how to set up `@rustic-ai/ui-components` for local development.

1.  Fork the `ui-components` repo on GitHub.
2.  Clone your fork locally

    ```bash
    git clone git@github.com:<your_github_username_name_here>/ui-components.git
    ```

3.  Go to project folder:

    ```bash
    cd ui-components
    ```

4.  Install dependencies and git hooks:

    ```bash
    npm install
    npm run setup-dev-env
    ```

5.  Create a branch for local development:

    ```bash
    git checkout -b name-of-your-bugfix-or-feature
    ```

6.  Now you can make your changes locally. Run storybook to see your changes:

    ```bash
    npm run storybook
    ```

7.  Remember to update storybook stories when you are making changes to the UI.

8.  When you're done making changes, add new tests and check that your changes pass the tests.

    ```bash
    npm test
    ```

9.  Commit your changes and push your branch to GitHub:

    ```bash
    git add .
    npx cz commit -S
    git push origin name-of-your-bugfix-or-feature
    ```

    Note: Commit messages must follow the Conventional Commits Specification. This ensures a standardized and semantic versioning-friendly commit history. Refer to [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for more details.

10. You may want to add the remote upstream repository to your local repository to stay in sync with the main repository:

    - Run this command to add the upstream repository:

      ```
      git remote add upstream [upstream SSH url]
      ```

    - You can verify if you added the upstream repository successfully by running the following command:

      ```
      git remote -v
      ```

    - Now you can pull the latest changes from the main repository by running the following command:

      ```
      git pull --rebase upstream main
      ```

11. Once you have committed your changes, you can push your changes to your branch:

    ```
    git push origin name-of-your-bugfix-or-feature
    ```

12. Submit a pull request through the GitHub website. Please specify the changes you made and provide screenshots and videos.

Note: For major changes or new features, it's recommended to create an issue first to discuss and align with project goals.

## Building From Source and Using It Locally

To build and use the library locally, follow these steps:

1. Ensure you have cloned the repository and installed dependencies.

2. Bundle and pack the local version of the library to test your changes in a real-world scenario.

   In the `ui-components` directory, execute the following command:

   ```bash
   NODE_ENV=production npm run build
   npm pack
   ```

   This will create a `rustic-ai-ui-components-<version>.tgz` file in the root of the `ui-components` directory.

   Then, in your project directory where you want to use the local version of `@rustic-ai/ui-components`, run:

   ```bash
   npm i <absolute-path-to-tar>/ui-components/rustic-ai-ui-components-<version>.tgz
   ```

3. You can now import and use the components from your library in your project. Import the components as you would with any other library:

   ```javascript
   import { ComponentName } from '@rustic-ai/ui-components'
   ```
