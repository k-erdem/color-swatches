# To-Do

- Code readibilty duzeltilmeli
- Decouple the methods.
- Write Comments.
- Write how to locally run the app.

-- Edge case when S or L is 100 or 0.
-- I also maybe need to erase localstorage every time we close the program.

** I used custom hooks to make the code more readable (ie. useColorFetching and useDebounce)

*** Note: I coded this site for desktop use cases primarily in mind. This would've changed how things would be used otherwise.

*** For more sophisticated builds, we can consider using IndexedDB style DB to improve caching. Cuz it'll be async etc.

Render only transition colors:
The current implementation in the ColorSwatchGrid component already does this. It only renders the color swatches for the transition points where the color name changes. This is an efficient approach that gives users a good overview of the color spectrum without overwhelming them.

Folder Structure. Why did I choose this folder structure?


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
