// responbile for parsing data from a .csv file
getData();

async function getData() {
    const response = await fetch("/data/asoiaf-book1-nodes.csv");

    const data = await response.text();
    console.log(data);

    /*
    const rows = data.split("\n").slice(1);
    for (let i = 0; i < rows.length; i++) {
        let currentRow = rows[i].split(",");
        console.log(`YEAR: ${currentRow[0]}, GLOB: ${currentRow[1]}`);
    }
    */

} 



/*
// responsible for making nodes
class characterNode {
    constructor(nodeName, connectedNodes, connectedEdges, important) {
        this.nodeName = nodeName;
        this.connectedNodes = connectedNodes;
        this.connectedEdges = connectedEdges;
        this.important = important;
    }
    
}

// resposible for making edges
class characterEdge {
    // source should be of type character node
    // target should be of type character node
    constructor(source, target) {
        this.source = source;
        this.target = target;
    }
    get sourceOfEdge(){
        return this.source;
    }
    get targetOfEdge(){
        return this.target
    }
}

// the database
let dataset = {
    nodes: [

    ],

    edges: [

    ]
}


// functions to add data to the dataset (the database)
const addNode = (node) => {
    dataset.nodes.push(node)
}
const addEdge = (edge) => {
    dataset.edges.push(edge);
}

// customization variables
let squareSideLength = 10;
let nodeWidth = squareSideLength;
let nodeHeight = squareSideLength;
let distancesBetweenLinks = 250;
let nodeColor = "#FF5F1F";
let linkStrength = 10;
let charge = [-450];
let grav = 0.1;
let w = window.innerWidth;
let h = window.innerHeight;

const names = [

];
    

// for adding nodes to the database
for (let i = 0; i < 50; i++) {
    let isImportant = false;
    if (i % 10 == 0) {
        isImportant = true;
    }
    let characterToBeAdded = new characterNode(names[i], [], [], isImportant);
    addNode(characterToBeAdded);
}

// TODO: REMOVE THIS METHOD! THIS METHOD IS JUST FOR RANDOM CONNECTIONS
let max = 30; // TODO: change this max value to the size of the names array
for (let i = 0; i < 30; i++) {
    let randomSourceIndex = Math.floor(Math.random() * max);
    let randomTargetIndex = Math.floor(Math.random() * max);
    //console.log(randomSourceIndex)
    addEdge(new characterEdge(dataset.nodes[randomSourceIndex], dataset.nodes[randomTargetIndex]));
}


console.log("!!!!!!!!!!!!IMPORTANT!!!!!!!!!!!!!!");
console.log(dataset);

// COMMENT THIS BELOW
let dataset = {
    nodes:[
            
            {name:"Adam", connectedNodes: [], connectedEdges: [], important: true}, // 0
            {name:"Bob", connectedNodes: [], connectedEdges: []}, // 1
            {name:"Carrie", connectedNodes: [], connectedEdges: []}, // 2
            {name:"Donovan", connectedNodes: [], connectedEdges: [], important: true}, // 3
            {name:"Edward", connectedNodes: [], connectedEdges: []}, // 4
            {name:"Felicity", connectedNodes: [], connectedEdges: []}, // 5
            {name:"George", connectedNodes: [], connectedEdges: []}, // 6
            {name:"Hannah", connectedNodes: [], connectedEdges: []}, // 7
            {name:"Iris", connectedNodes: [], connectedEdges: []}, // 8
            {name:"Jerry", connectedNodes: [], connectedEdges: []}, // 9

            {name:"hans", connectedNodes: [], connectedEdges: [], important: true}, // 10
            {name:"nathan", connectedNodes: [], connectedEdges: []}, // 11
            {name:"angelo", connectedNodes: [], connectedEdges: []}, // 12
            {name:"tablang", connectedNodes: [], connectedEdges: []}, // 13
            {name:"canete", connectedNodes: [], connectedEdges: []}, // 14
            

    ],
    edges:[
            {source: 0, target: 1},
            
            {source: 0, target: 2},
           // {source: 0, target: 3},
            {source: 0, target: 4},
            {source: 1, target: 5},
            {source: 2, target: 5},
            
           // {source: 2, target: 5},
            {source: 3, target: 4},
            {source: 5, target: 8},
            {source: 5, target: 9},
            {source: 6, target: 7},
            {source: 7, target: 8},
            {source: 8, target: 9},

            {source: 10, target: 11},
            {source: 11, target: 12},
          //  {source: 11, target: 13},
            {source: 13, target: 14},

            {source: 10, target: 0}
            

    ]
};
// COMMENT THIS ABOVE



const storeLinksNodesToEachNode = () => {
    // get the set of nodes and edges
    let nodeSet = dataset.nodes;
    let edgeSet = dataset.edges;
    // for each edge in the edgeset
    edgeSet.forEach((edge) => {
        let currentSourceCharacterNode = edge["source"];
        let currentTargetCharacterNode = edge["target"];

        // store each other node to each other's connectedNodes property
        currentSourceCharacterNode["connectedNodes"].push(currentTargetCharacterNode);
        currentTargetCharacterNode["connectedNodes"].push(currentSourceCharacterNode);

        // store this edge in each other's connectedEdge property
        currentSourceCharacterNode["connectedEdges"].push(edge);
        currentTargetCharacterNode["connectedEdges"].push(edge);

        // COMMENT THIS BELOW
        // get its source and target numbers
        //let currentSource = edge[characterEdge].sourceOfEdge;
        let currentSource = edge["source"];
        let currentTarget = edge["target"];
        console.log(currentSource);
        console.log(currentTarget);

        // those numbers pertain to the index location of nodes
        let connectedNodesOfSource = nodeSet[currentSource].connectedNodes;
        let connectedNodesOfTarget = nodeSet[currentTarget].connectedNodes;
        connectedNodesOfSource.push(nodeSet[currentTarget]);
        connectedNodesOfTarget.push(nodeSet[currentSource]);

        // put this edge inside the connectedEdges attr of those nodes
        let connectedEdgesOfSource = nodeSet[currentSource].connectedEdges;
        let connectedEdgesOfTarget = nodeSet[currentTarget].connectedEdges;
        connectedEdgesOfSource.push(edge);
        connectedEdgesOfTarget.push(edge);
        // COMMENT THIS ABOVE
    });
}
storeLinksNodesToEachNode();
console.log("!!!!!!!!!!!!AFTER storeLinksNodesToEachNode !!!!!!!!!!!!!!");
console.log(dataset);



// force simulation
let force = d3.layout.force()
    .size([w, h])
    .nodes(dataset.nodes)
    .links(dataset.edges)
    .linkDistance(distancesBetweenLinks)
    // COMMENT THIS BELOW
    .charge(function(d){
        let charge = -900;
        if (d.index === 0) charge = 10 * charge;
        return charge;
    })
    // COMMENT THIS ABOVE
    .charge(charge)
    .gravity(grav)
    .linkStrength(linkStrength)
    .start();


let svg = d3.select("body") // change body to .canvas
                .append("svg")
                .attr("width", w)
                .attr("height", h);
inner = svg.select('g');

function zoomed() {
    inner.attr('transform', 'translate(' + zoom.translate() + ')scale(' + zoom.scale() + ')');
}

let zoom = d3.behavior.zoom()
  .translate([0, 0])
  .scale(1)
  .size([w, h])
  .scaleExtent([1, 8])
  .on('zoom', zoomed);


let graphEdges = svg.selectAll("line")
    .data(dataset.edges)
    .enter()
    .append("line")
    .attr("class", "link");

let graphNodes = svg.selectAll(".node")
    .data(dataset.nodes)
    .enter().append("rect")
    .attr("class", "node")
    .attr("class", "twinkle")
    .attr("width", nodeWidth)
    .attr("height", nodeHeight)
    .style("fill", nodeColor)
    .call(force.drag);
    
let label = svg.selectAll(".mytext")
    .data(dataset.nodes)
    .enter()
    .append("text")
    .text(function (d) { return d.nodeName.toUpperCase(); })
    .style("text-anchor", "middle")
    .style("fill", nodeColor)
    .attr("class", "defaultText")
    .style("font-size", 12);

    const tick = () => {
        graphEdges.attr("x1", function(d){ return d.source.x; })
             .attr("y1", function(d){ return d.source.y; })
             .attr("x2", function(d){ return d.target.x; })
             .attr("y2", function(d){ return d.target.y; });
        graphNodes.attr("cx", function(d){ return d.x; })
             .attr("cy", function(d){ return d.y; });
        label.attr("x", function(d){ return d.x + 20; })
             .attr("y", function (d) {return d.y - 15; });
    };

force.on("tick", function(){
    graphEdges.attr("x1", function(d){ return d.source.x - 10; })
        .attr("y1", function(d){ return d.source.y + 50; })
        .attr("x2", function(d){ return d.target.x - 10; })
        .attr("y2", function(d){ return d.target.y + 50; });
        graphNodes.attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
    label.attr("x", function(d){ return d.x + 20; })
        .attr("y", function (d) {return d.y - 10; });        
});


setInterval(() => {
    let offset = Math.random() + 10;
    force.start();

    force.on("tick", function() {
        graphEdges.attr("x1", function(d){ return d.source.x + offset - 5;})
        .attr("y1", function(d){ return d.source.y + offset - 5; })
        .attr("x2", function(d){ return d.target.x + offset - 5; })
        .attr("y2", function(d){ return d.target.y + offset - 5; });
        graphNodes.attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
    label.attr("x", function(d){ return d.x + 20; })
        .attr("y", function (d) {return d.y - 10; });
    })
}, 100)




// get the nodes and add an event click listener to all of them
let rects = document.querySelectorAll("rect");
let textLabels = document.querySelectorAll("text");
let edgeSet = document.querySelectorAll("line");


console.log(document.querySelector("text"));
rects.forEach((rect) => {

    
    if (rect["__data__"]["important"]) {
        console.log(rect);
        rect.classList.add("important");

        let nameNode = rect["__data__"]["nodeName"].toUpperCase();
        textLabels.forEach((text) => {
            if (text["textContent"] == nameNode) {
                text.classList.add("importantText");
            }
        });


    }

    rect.addEventListener("mouseover", e => {
        let allEdges = document.querySelectorAll("line");
        let allTextLabels = document.querySelectorAll("text");
        allEdges.forEach((edge) => {
            edge.classList.remove("linkShown");
        });
        allTextLabels.forEach((text) => {
            text.classList.remove("textShown");
        });

        let edgesOfRects = e["target"]["__data__"]["connectedEdges"];
        let nodesAssociated = e["target"]["__data__"]["connectedNodes"];
        let textLabelsAssociated = [];
        nodesAssociated.forEach((node) => {
            textLabelsAssociated.push(node["nodeName"].toUpperCase());
        });
        allTextLabels.forEach((text) => {
            if (text["textContent"] == e["target"]["__data__"]["nodeName"].toUpperCase()) {
                text.classList.add("textShown");
            }
            if (textLabelsAssociated.includes(text["textContent"])) {
                text.classList.add("textShown");
            }
        });

        edgesOfRects.forEach((edge) => {
            // get all existing edges in the document

            allEdges.forEach((match) => {
                // get source and target of those edges
                let sourceNode = match["__data__"]["source"];
                let targetNode = match["__data__"]["target"];
                // if this is the edge that we are looking for then apply the link shown
                if (sourceNode.nodeName == edge.source.nodeName && targetNode.nodeName == edge.target.nodeName) {
                    console.log("here000!!!!!");
                    match.classList.add("linkShown");
                    console.log(match["__data__"]);
                    
                    if (e["target"]["__data__"]["important"] == null || e["target"]["__data__"]["important"] == undefined) {
                        let connectedEdgesToTarget = e["target"]["__data__"]["connectedEdges"];
                        connectedEdgesToTarget.forEach((edge) => {
                            console.log("test here");
                            console.log(edge);
                            allEdges.forEach((edge) => {
                                if (e["target"]["__data__"]["nodeName"] == edge["__data__"]["source"] || e["target"]["__data__"]["nodeName"] == edge["__data__"]["target"]) {
                                    edge.classList.add("overrideLink");
                                }
                            });
                        });
                    }
                    else if ((match["__data__"]["source"]["important"] == true || match["__data__"]["target"]["important"] == true )
                        && e["target"]["__data__"]["important"] == true) {
                        match.classList.add("importantLink");

                        
                    }
                    
                }
                else if (sourceNode.nodeName == edge.target.nodeName && targetNode.nodeName == edge.source.nodeName) {
                    console.log("here222!!!!!");
                    match.classList.add("linkShown");
                    console.log(match["__data__"]);
                }
            });
        });
    
    
    
    
    
    
    
    });

    //rect.classList.add("twinkle");
});

textLabels.forEach((label) => {
    label.addEventListener("mouseover", e => {
        label.classList.add("textBoldened");
    });
    label.addEventListener("mouseleave", e => {
        label.classList.remove("textBoldened");
    })
});


console.log("CHECK HERE!!");
let nodesInTheGraph = document.querySelectorAll(".node");
nodesInTheGraph.forEach((node) => {
    console.log(node);
    //node.gravi
})
//console.log(averageConnections);
console.log(force);


*/
  