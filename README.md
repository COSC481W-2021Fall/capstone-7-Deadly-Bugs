# Flashfolio

**Team 3: 7 Deadly Bugs**

## Project Description
An application for creating, sharing, and studying flashcards easily, simply, and quickly.


## Commit Message Guideline

All commits should have at least a small title indicating what was changed. It should also include at the beginning of the commit at least one of the following categories:

impl: A change to the source code which implements a new feature, method, block, et cetera
fix: A bug fix
style: Feature and updates related to styling
refactor: Refactoring a specific section of the codebase
test: Everything related to testing
docs: Everything related to documentation
chore: Regular code maintenance

e.g. "impl: Changed X in Function Y", "style: Fixed formatting of file Z"

If a commit changes mutliple aspects of the source code in one of the previously mentioned ways, please string the types together in kebab-case. Ideally these should all be different commits, but sometimes it is best if changes are together in a single commit.

e.g. "test-doc: Update documentation and unit tests for module M" 

Commit messages should indicate *why* a change was made and what the intentions were for the commit. Escpecially if the commit changes a large portion of code.

## Pull Request Guideline

1) PRs are only to be made upon the (percieved) completion of an issue (e.g. every PR should have a "closes issue #______" associated to it.

2) If there are any major conflicts between the branch and main, these conflicts must be resolved locally *before* the PR is created.

e.g. merge main into branch, resolve conflicts, open PR to merge branch into main.

If you are removing another developers code due to conflicts, please tag them so they are aware.

3) The first comment (description) of the PR ought to give an overview of everything that was changed.

4) All tests must be shown to pass upon submitting a PR, and it is expected that the developer has done some amount of general testing (starting the server, trying out the UI)

5) PR Titles should be in the following format: `(type) short description`

6) If a new known bug is introduced, please create an issue for the bug and link the issue in your PR. If you have a rough idea where the bug is occuring in your code please point it out in a comment somewhere in the code.

## Code Review Checklist

1) All unit tests are run.

2) Each affected unit has been manually reviewed for potential issues, including:
  * Logical Errors
  * Stylistic Errors
  * Poor Documentation
  * Bad coding practices
  * et cetera
The reviewer may choose to reject the PR if any of these errors appear, or may document the error as something that needs to be fixed later.

3) If a unit test is failing, the unit must be rejected, or an exception must be made and an issue must be created to resolve the failure.

4) If potential improvements or optimizations have been determined, these must be documented in the PR's comments.

5) Manual testing may be completed at the reviewer's discretion. Any bugs found by the reviewer in manual testing must be documented & an issue created.

6) The reviewer may make small changes to the code, but larger changes should be the duty of the developer.

## Team Member Bios

### Ron (Team Lead)

Senior Computer Science major with a minor in Classical Studies. Big fan of low level programming. I dream of working on the kernel. 🐧

### Erik (Deputy Team Lead)

Senior in computer science who has an interest in pursuing android app developement.

### Alex

Hello! I am a Senior CompSci major. I enjoy playing and now creating video games. After school I would love to cut my teeth at a large company while creating video games in any spare time I could find.

### Kyle

Hi, I'm Kyle. I plan on studying data science after graduating; I am interested in gaining experience with cloud computing and artificial intelligence ✌

### Madeeha

Hi! I'm a senior Computer Science and Psychology major. After graduating I want to gain experience in web and mobile development as a full stack developer, though I'm not yet fully sure where I want to end up.

### Marvin
Hello, my name is Marvin Zavala, I am a computer science major and a math minor. I like video games, so game programming sounds like something fun to do after I graduate.

### Shefali
Hi, my name is Shefali! I'm a senior majoring in Computer Science. Post graduation, I'm interested in working in cloud computing.
