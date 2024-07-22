# Color Swatches - Akkio Frontend Technical Assessment

## Overview 
An example project that uses the [color api][https://www.thecolorapi.com/] to build a grid of Hue, Saturation, Lightness (HSL) color swatches by taking user inputs for Saturation (S) and Lightness (L).

## Demo

## Getting Started

To run this project locally, follow the steps below.

1. Clone the repository.

    ```
    git clone  https://github.com/k-erdem/color-swatches.git
    ```

2.  Navigate to the folder and then the server directory:

    ```
    cd color-swatches
    cd src
    ```
    
3. Install Node.js

https://nodejs.org/en/download/package-manager

4. Install dependencies in the project directory. Install the required dependencies by running:

    ```
    npm install
    ```

This command will install all the dependencies listed in the package.json file, including React and other necessary packages.

5. Start the development server

Once the dependencies are installed, you can start the development server by running:
    ```
    npm start
    ```
This command will start the React development server. The application should open automatically in your default web browser. If it doesn't, you can manually open http://localhost:3000 in your browser.

6. View the application

You should now see the Color Swatch application running in your browser. You can interact with the color controls to see different color swatches.

7. Stop the server

When you're done, you can stop the development server by pressing Ctrl + C in the terminal where the server is running.


## Considerations & Design Choices

- How efficiently can the distinct names be determined? Can the number of API calls be reduced?*
- Do all colors need to be rendered at once?
- When will the API calls be made?
- What is the best user experience for selecting S and L values?
- What sort of feedback will the user receive? How will loading times be handled?



## File Structure


-- Edge case when S or L is 100 or 0.
-- I also maybe need to erase localstorage every time we close the program.

** I used custom hooks to make the code more readable (ie. useColorFetching and useDebounce)

*** Note: I coded this site for desktop use cases primarily in mind. This would've changed how things would be used otherwise.

*** For more sophisticated builds, we can consider using IndexedDB style DB to improve caching. Cuz it'll be async etc.

Render only transition colors:
The current implementation in the ColorSwatchGrid component already does this. It only renders the color swatches for the transition points where the color name changes. This is an efficient approach that gives users a good overview of the color spectrum without overwhelming them.

Folder Structure. Why did I choose this folder structure?
