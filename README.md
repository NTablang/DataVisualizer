# A Data Visualizer Series Implementation

https://user-images.githubusercontent.com/49734520/148604528-4bec85b5-cb27-46fd-9718-596a2e185e85.mp4     

Ever need a refresher with how egregious the student loan industry has become? 
How about just getting a bigger picture of the subject? 
Well fret not, this website is here to do just that. 
This shows the relationships between the central topics emerging since the conception of the industry and the cause and effects of known themes. 
Although this personal-guided research shows a general bigger picture, it is not intended to be used as an official material! 
It is simply a show of design, data, and discussion bundled up together. 
This is made with HTML, CSS, Javascript, [d3.js](https://d3js.org/), and the [New York Times Article Search API](https://developer.nytimes.com/docs/articlesearch-product/1/overview)

<img align="right" src="gif1.gif" alt="gif1 of the DataVisualizer">   
To start:   
Simply hover over a node to view its name and its connections.
It is recommended that you start with the biggest and the most isolated node.  
<br>
<br>
White nodes indicate a key point that is essential to such groups and connections, while orange nodes indicate subpoints; 
whereas orange nodes provide a more specific point, white nodes provides the more overarching themes.  
<br>
<br>
<br>
<img align="left" src="gif2.gif" alt="gif1 of the DataVisualizer" height="500px">
   
### Informational Popouts ###
Click on a node to find what lies underneath. The popout explains how and why a given point relates to the overarching theme and its connections. With the popout, one can see the image, the text description, and it is also fully draggable. <br> <br><br><br>
    
### Suggested Feed: Articles ###
Articles listed are fetched through the New York Times Article Search API. Note that the articles suggested are simply queried by fetching the API with the topic name as the query parameters. As such, it may or may not be possible that the feeds suggested may be relevant to the actual topic.<br><br><br>
  
    
### About the New York Times API ###
This website utilized the use of the New York Times API. How I used the API is that for every popout that appeared, 
I took the topic name and used that to be queried for the article lookup. As stated earlier, it is possible that an article may be irrelevant to the topic; 
I simply chose the top 3 most relevant articles given by the API in the json object given. Note that I have included the API key on this public repo because I don't know how I could hide the API-key whilst still making sure the live version works. Fortunately, the NYT api is free for use. I got lucky!<br><br><br>
  
    
### About the d3.js framework ###
This website utilized the use of the data visualization framework, d3.js. This is my first time using d3.js and although I have not used its other features (line graphs, scatter plots, and etc), I used the force-directed node graph layout. The d3.js version that is used is version 3. This framework allowed me to build a force system (with charge, link strength, and others) as well as its nodes and edges that responds to a drag mouse event.<br><br><br>
  

## 🔥 Acknowledgements

 - [The Coding Train's NYT API](https://www.youtube.com/watch?v=IMne3LY4bks&t=794s&ab_channel=TheCodingTrain)
 - [How to D3 Force Directed Layout Graph](https://www.youtube.com/watch?v=HP1tOlxVYz4&t=846s&ab_channel=BenSullins)
 - [D3.js tutorial - 10 - Loading External Data](https://www.youtube.com/watch?v=2S1AbEWX85o&ab_channel=d3Vienno)
 - [1.1: fetch() - Working With Data & APIs in JavaScript](https://www.youtube.com/watch?v=tc8DU14qX6I&ab_channel=TheCodingTrain)

## About the Author

Hi! My name is [Nathan Tablang](https://www.linkedin.com/in/nathan-tablang-297b861b1/) and as of January 2022, 
I am a sophomore computer science student studying at University of Maryland, College Park! 
I have big aspirations and I would like to keep improving my skills to the point that other people will seek for my help. 
Helping those in need is a fulfilling thing and it makes every problem worthwhile!

## Color Reference

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Key Ideas  | ![#FFFFFF](https://via.placeholder.com/10/ffffff?text=+) #FFFFFF |
| Sub points | ![#FF5F1F](https://via.placeholder.com/10/ff5f1f?text=+) #FF5F1F |
| Background Color | ![#1F1919](https://via.placeholder.com/10/1f1919?text=+) #1f1919 |


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Tech Stack

**Languages:** HTML, CSS, Javascript

**API & Frameworks:** The New York Times API, d3.js
