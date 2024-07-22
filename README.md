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

 Just go on [official Node.js website](https://nodejs.org/) and download the installer.

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

The design choices in this project were informed by the necessities to optimize the API calls. With possible values of 360 for Hue, 100 for Saturation, and 100 for Lightness, the Color API calls had to be optimized to provide a high performing application with a smooth user experience. 

The website is made up of 2 distinct parts. The user input control tools (sliders for Saturation and Lightness) and the Color Swatch grid, displaying all distinct colors for the given S,L values. Users can interact with the website by changing the saturation and lightness values. The best user experience for selecting these values was ensured through giving the users the options to either manually type a value for the variables (so they can look up specific outcomes they're curious about), or use the slider to experiment with different values of S,L variables. Debouncing was used to limit excessive API requests, and to make sure the user gets a fast response without having to see twitching color swatches. A loading indicator in the form of a message text and a cute theme-relevant was used to prompt the users and provide the necessary feedback. 

Distinct swatch names were determined by 

Edge cases including but not limited to S=0, L=0, L=100 were tested, and relevant responses were crafted.

- How efficiently can the distinct names be determined? Can the number of API calls be reduced?*
- Do all colors need to be rendered at once?
- When will the API calls be made?
- What is the best user experience for selecting S and L values?
- What sort of feedback will the user receive? How will loading times be handled?



## File Structure


-- I also maybe need to erase localstorage every time we close the program.

** I used custom hooks to make the code more readable (ie. useColorFetching and useDebounce)

*** Note: I coded this site for desktop use cases primarily in mind. This would've changed how things would be used otherwise.

*** For more sophisticated builds, we can consider using IndexedDB style DB to improve caching. Cuz it'll be async etc.

Render only transition colors:
The current implementation in the ColorSwatchGrid component already does this. It only renders the color swatches for the transition points where the color name changes. This is an efficient approach that gives users a good overview of the color spectrum without overwhelming them.

Folder Structure. Why did I choose this folder structure?
