
let studentjson;
let graph = {
    nodes: ["Student Debt", "Government", "Taxes"

    ]
}
setup();

async function setup() {

    for (const name of graph.nodes) {
        let currentNodeName = name;
        let url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${currentNodeName}&api-key=xAskm0aJnTaEfA22HWvzeIEfg6WyLTaQ`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        setTimeout(function(){}, 7000);
    }
   
}

async function findSuggested(name) {
    let currentNodeName = name;
    let url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${currentNodeName}&api-key=xAskm0aJnTaEfA22HWvzeIEfg6WyLTaQ`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
}
/*
const gotData = (data) => {
    studentjson = data;
    d3.csv("../nodesDescs.csv", parseCSV);
}
const parseCSV = (data) => {
    for (let i = 0; i < data.length; i++) {
        let newObject = {};
        let currentNodeName = data[i]["Topic"];
        let currentDescription = data[i]["Description"];
        let newImagePath = data[i]["Image Path"];


        newObject.name = currentNodeName;
        newObject.connectedNodes = [];
        newObject.connectedEdges = [];
        newObject.important = false;
        newObject.description = currentDescription;
        newObject.imgPath = newImagePath;


        if (currentNodeName == "Student Debt") {
            newObject.important = true;
        }
        graph.nodes.push(newObject);
    }
    //console.log(graph.nodes);
    //console.log(studentjson);
    showTitles();
}
setup();
function showTitles() {
    let nodes = graph.nodes;
    
    }
    
   
   let i = 0;
   while (i < 2) {
        
        setTimeout(async function() {
        let searchKey = nodes[i].name;
        console.log(searchKey);
        let subURL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchKey}&api-key=xAskm0aJnTaEfA22HWvzeIEfg6WyLTaQ`;
        await d3.json(subURL, displayDiv)
        i++;
        }, 6000);

   }

   

    
}
*/
/*

const displayDiv = (jsonData) => {
    // get the first articles only
    
    console.log(jsonData);
    let headline = jsonData.response.docs[0].headline.main;
        let subtitle = jsonData.response.docs[0].abstract;
        let masterDiv = document.createElement("div");
        let headlineDiv = document.createElement("h1");
        headlineDiv.innerHTML = headline;
        let subtitleDiv = document.createElement("h3");
        subtitleDiv.innerHTML = subtitle;
        masterDiv.appendChild(headlineDiv);
        masterDiv.appendChild(subtitleDiv);

        document.body.appendChild(masterDiv);

        setTimeout(function() {
            console.log(graph.nodes);
        }, 6000);
}
*/
/*
console.log("about to fetch");
fetch("rainbow.jpg").then(response => {
    console.log(response);
    
})
*/