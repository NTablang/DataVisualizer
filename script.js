/*
let width = 640,
    height = 480;

let links = [
    {source: "Baratheon", target: "Lannister"},
    {source: "Baratheon", target: "Stark"},
    {source: "Lannister", target: "Stark"},
];

let nodes = {};

// parse links to nodes
links.forEach((link) => {
    // if we have the same node, don't add them
    link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
    // if you are not in the source, but you are in the target, we will add you as well
    link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});

    // essentially what the above does is if it already exists, update them otherwise, add them
});

//console.log(window);





// add svg to our body
let svg = d3.select("body").append("svg")
    .attr("width", window.screen.width)
    .attr("height", window.screen.height);

let force = d3.layout.force()
    .size([width, height])
    .nodes(d3.values(nodes))
    .links(links)
    .on("tick", tick) // motion
    .linkDistance(300) // how far they are apart
    .start();

// need to add links then nodes
let link = svg.selectAll(".link")
    .data(links)
    .enter().append("line") // kind of path that connects each node -- essentially the links
    .attr("class", "link"); // first param is the attribute that we are modifying second param is the class that we are adding

let node = svg.selectAll(".node")
    .data(force.nodes())
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", width * 0.03); // how big our nodes are


    var label = svg.selectAll(null)
    .data(nodes)
    .enter()
    .append("text")
    .text(function (d) { console.log(d.name); return d.name; })
    .style("text-anchor", "middle")
    .style("fill", "#555")
    .style("font-family", "Arial")
    .style("font-size", 12);

function tick(e) {
    // lets modify our attributes of nodes and links!
    node.attr("cx", function(d) {return d.x;}) // relative x position of the node
        .attr("cy", function(d) {return d.y;})
        .call(force.drag); // allows us to drag things out
    
    

    link.attr("x1", function(d) {return d.source.x})
        .attr("y1", function(d) {return d.source.y})
        .attr("x2", function(d) {return d.target.x})
        .attr("y2", function(d) {return d.target.y});
    
    label.attr("x", function(d){ return d.x; })
        .attr("y", function (d) {return d.y - 10; });
}
*/


var w = window.screen.width;
var h = window.screen.height;
var dataset = {
    nodes:[
            {name:"Adam", connectedNodes: [], connectedEdges: []}, // 0
            {name:"Bob", connectedNodes: [], connectedEdges: []}, // 1
            {name:"Carrie", connectedNodes: [], connectedEdges: []}, // 2
            {name:"Donovan", connectedNodes: [], connectedEdges: []}, // 3
            {name:"Edward", connectedNodes: [], connectedEdges: []}, // 4
            {name:"Felicity", connectedNodes: [], connectedEdges: []}, // 5
            {name:"George", connectedNodes: [], connectedEdges: []}, // 6
            {name:"Hannah", connectedNodes: [], connectedEdges: []}, // 7
            {name:"Iris", connectedNodes: [], connectedEdges: []}, // 8
            {name:"Jerry", connectedNodes: [], connectedEdges: []}, // 9

            {name:"hans", connectedNodes: [], connectedEdges: []}, // 10
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

const storeLinksNodesToEachNode = () => {
    // get the set of nodes and edges
    let nodeSet = dataset.nodes;
    let edgeSet = dataset.edges;
    // for each edge in the edgeset
    edgeSet.forEach((edge) => {
        // get its source and target numbers
        let currentSource = edge.source;
        let currentTarget = edge.target;

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
        

    });
}
storeLinksNodesToEachNode();

/*
let grav = 0.1;
var force = d3.layout.force()
                    .nodes(dataset.nodes)
                    .links(dataset.edges)
                    .size([w, h])
                    .linkDistance(120)
                    //.charge([-500])
                    .gravity(0.1)
                    .start();
console.log(force);
*/
const tick = () => {

    edges.attr("x1", function(d){ return d.source.x; })
         .attr("y1", function(d){ return d.source.y; })
         .attr("x2", function(d){ return d.target.x; })
         .attr("y2", function(d){ return d.target.y; });
    nodes.attr("cx", function(d){ return d.x; })
         .attr("cy", function(d){ return d.y; });
    label.attr("x", function(d){ return d.x + 20; })
         .attr("y", function (d) {return d.y - 15; });
};
console.log("test");

console.log(d3.layout.force());
let force = d3.layout.force()
    .size([w, h])
    .nodes(dataset.nodes)
    .links(dataset.edges)
    .linkDistance(250) // how far they are apart
    .charge(function(d){
        var charge = -900;
        if (d.index === 0) charge = 10 * charge;
        return charge;
    })
    .linkStrength(10)
   // .gravity(100)
    .start();



    /*
setInterval(() => {
    force.stop();
    //force.charge((-1)^(Math.floor(Math.random())) * Math.random() + 500);
    //force.linkDistance([Math.random() + 500]);
    force.linkStrength([Math.random()]);
    force.start();
}, 1);
*/

// delete these below
var svg = d3.select('svg'),
  inner = svg.select('g');

function zoomed() {
    inner.attr('transform', 'translate(' + zoom.translate() + ')scale(' + zoom.scale() + ')');
  }

var zoom = d3.behavior.zoom()
  .translate([0, 0])
  .scale(1)
  .size([w, h])
  .scaleExtent([1, 8])
  .on('zoom', zoomed);
// delete above


var svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .call(zoom) // delete this line to disable free zooming
  .call(zoom.event);

var edges = svg.selectAll("line")
                .data(dataset.edges)
                .enter()
                .append("line")
                .attr("class", "link");

var nodes = svg.selectAll("circle")
                .data(dataset.nodes)
                .enter()
                .append("circle")
                .attr("r", 10)
                .attr("class", "node")
                .call(force.drag);
    
var label = svg.selectAll(".mytext")
                .data(dataset.nodes)
                .enter()
                .append("text")
                .text(function (d) { console.log(d); return d.name.toUpperCase(); })
                .style("text-anchor", "middle")
                .style("fill", "magenta")
                //.style("font-family", "Arial")
                .style("font-size", 12);



force.on("tick", function(){
    edges.attr("x1", function(d){ return d.source.x; })
         .attr("y1", function(d){ return d.source.y; })
         .attr("x2", function(d){ return d.target.x; })
         .attr("y2", function(d){ return d.target.y; });
    nodes.attr("cx", function(d){ return d.x; })
         .attr("cy", function(d){ return d.y; });
    label.attr("x", function(d){ return d.x + 20; })
         .attr("y", function (d) {return d.y - 15; });
                
});

setInterval(() => {
    let offset = Math.random() + 10;
    force.start();
    force.on("tick", function() {
        edges.attr("x1", function(d){ return d.source.x + offset; })
    .attr("y1", function(d){ return d.source.y + offset; })
    .attr("x2", function(d){ return d.target.x + offset; })
    .attr("y2", function(d){ return d.target.y + offset; });
nodes.attr("cx", function(d){ return d.x + offset; })
    .attr("cy", function(d){ return d.y + offset; });
label.attr("x", function(d){ return d.x + 20 + offset; })
    .attr("y", function (d) {return d.y - 15 + offset; });
    })
}, 100)


console.log(force);




// get the nodes and add an event click listener to all of them
let circles = document.querySelectorAll("circle");
circles.forEach((circle) => {

    circle.addEventListener("mouseover", e => {
        let allEdges = document.querySelectorAll("line");
        allEdges.forEach((edge) => {
            edge.classList.remove("linkShown");
        });


        console.log(e);
        

        

        let edgesOfCircle = e["target"]["__data__"]["connectedEdges"];
        console.log("here");
        console.log(edgesOfCircle);

        edgesOfCircle.forEach((edge) => {
            // get all existing edges in the document

            allEdges.forEach((match) => {
                // get source and target of those edges
                let sourceNode = match["__data__"]["source"];
                let targetNode = match["__data__"]["target"];
                // if this is the edge that we are looking for then apply the link shown
                if (sourceNode.name == edge.source.name && targetNode.name == edge.target.name) {
                    console.log("here!!!!!");
                    match.classList.add("linkShown");
                }
                else if (sourceNode.name == edge.target.name && targetNode.name == edge.source.name) {
                    console.log("here!!!!!");
                    match.classList.add("linkShown");
                }
                
            });
        });



    })

})


let liness = document.querySelectorAll("line");
liness.forEach((line) => {
    line.addEventListener("click", e => {
        console.log(e);

    })
})

const isEqual = (edge1, edge2) => {
    // the source and target nodes are the same for each edge regardless of their "true" source points
    let edge1Source = edge1["__data__"][source];
    let edge1Target = edge1["__data__"][target];
    let edge2Source = edge2["__data__"][source];
    let edge2Target = edge2["__data__"][target];
    if (edge1Source == edge2Source && edge1Target == edge2Target) {
        return true;
    }
    return false;
}
