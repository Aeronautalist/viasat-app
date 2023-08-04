# Viasat App

## Running the project

- Install Node
- Install Project Dependencies
- Run Project
- Run Tests

### Install Node

This is a simple Node base App.  
The Node version I am using is the latest LTS version v18.17.0. You probably won't need the latest Node version to run it but Node 18 is probably safest.

- [Install Node](https://nodejs.org/en)

### Install Project Dependencies

- Cd into the root of the project.
- Run the `npm install` command, or simply `npm i` in your command line.
- I have included a `package-lock.json` file, so the dependency versions you install should be the same as the ones I ran.

### Run Project

Simply run the `dev` command, `npm run dev` in your command line. The project will start on the default host, in this case `http://localhost:5173/`

### Run Tests

`npm run test` will run the tests in your command line.

## Project Considerations

### Technologies

The project uses the following technologies:

- Vite
- React
- React-testing-library, Vitest, Jsdom and msw for testing.
- [Shoelace-style](https://shoelace.style/) for some of the components/theming.

### Key Points

- Single Page App.
- Design patters such as Provider, Mediator, Hooks, Slots.
- Global CSS variables for colour and styling to keep the App uniform.
- Flex and Grid Layouts for responsive design.
- Separation of Logical/Presentation components
- Basic error handling if the API call fails.
- Basic loading animation.

### Decisions Made

- If a launch has no image, use the patch image. If there are neither, use a local default launch image.
- If filters are applied, if a launch matches any of the filters it will be included.
- Due to time constraints testing has been limited to the App and Pagination-buttons component. Most use cases should be covered by these two as they are the most complex.
- You can build the project with the `npm run build` command. I didn't make any changes here to the Vite build so it's just what comes out of the box.

## Other

Thank you for taking the time to review my project!
