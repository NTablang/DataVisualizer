// the local database
let graphs = {
    nodes: [
    ], 
    edges: [
    ]
}
let idCount = 0;
let linkCount = 0;
let suggestedTitles;
let suggestedLinks;

// responsible for creating the graph and its components
const drawGraph = () => {
    let nodeSideLength = 8;
    let nodeWidth = nodeSideLength; // square
    let nodeHeight = nodeSideLength; // square
    let distancesBetweenLinks = 250;
    let nodeColor = "#FF5F1F"; 
    let linkStrength = 0;
    let grav = 0.3;
    let w = window.innerWidth - 50;
    let h = window.innerHeight - 60;
   
    // force simulation
    let force = d3.layout.force()
        .size([w, h])
        .nodes(graphs.nodes)
        .links(graphs.edges)
        .linkDistance(distancesBetweenLinks)
       .charge([1100])
       .charge(function(d){
        let charge = -900;
        if (d.index === 0) charge = 10 * charge;
        return charge;
        })
        .linkStrength(linkStrength)
        .gravity(grav)
        .start();

    // the .svg of the graph itself
    let svg = d3.select(".graph")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
    inner = svg.select('g');

    // zooming function
    function zoomed() {
        inner.attr('transform', 'translate(' + zoom.translate() + ')scale(' + zoom.scale() + ')');
    }
    let zoom = d3.behavior.zoom()
        .translate([0, 0])
        .scale(1)
        .size([w, h])
        .scaleExtent([1, 8])
        .on('zoom', zoomed);

    // links/edges settings
    let edges = svg.selectAll("line")
        .data(graphs.edges)
        .enter()
        .append("line")
        .attr("class", "link");

    // nodes settings
    let nodes = svg.selectAll(".node")
        .data(graphs.nodes)
        .enter().append("rect")
        .attr("class", "node")
        .attr("class", "twinkle")
        .attr("width", nodeWidth)
        .attr("height", nodeHeight)
        .style("fill", nodeColor)
        .call(force.drag);
    
    // text label settings
    let label = svg.selectAll(".mytext")
        .data(graphs.nodes)
        .enter()
        .append("text")
        .text(function (d) { return d.name.toUpperCase(); })
        .style("text-anchor", "middle")
        .style("fill", nodeColor)
        .attr("class", "defaultText")
        .style("font-size", 12);

    // for motion stimulation
    force.on("tick", function(){
        edges.attr("x1", function(d){ return d.source.x - 10; })
            .attr("y1", function(d){ return d.source.y + 5; })
            .attr("x2", function(d){ return d.target.x - 10; })
            .attr("y2", function(d){ return d.target.y + 5; });
        nodes.attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });
        label.attr("x", function(d){ return d.x + 20; })
            .attr("y", function (d) {return d.y - 10; });        
    });
    // for motion stimulation every 100ms (0.1s)
    setInterval(() => {
        let offset = Math.random() + 10;
        force.start();

        force.on("tick", function() {
        edges.attr("x1", function(d){ return d.source.x + offset - 5;})
            .attr("y1", function(d){ return d.source.y + offset - 5; })
            .attr("x2", function(d){ return d.target.x + offset - 5; })
            .attr("y2", function(d){ return d.target.y + offset - 5; });
        nodes.attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });
        label.attr("x", function(d){ return d.x + 20; })
            .attr("y", function (d) {return d.y - 10; });
        })
    }, 100)

}

// responsible for converting the .csv file containing the nodes to actual node components
const parseNodesCSVToGraphNodes = (data) => {
    for (let i = 0; i < data.length; i++) {
        // object creation
        let newObject = {};
        let currentNodeName = data[i]["Topic"];
        let currentDescription = data[i]["Description"];
        let newImagePath = data[i]["Image Path"];

        newObject.name = currentNodeName;
        newObject.connectedNodes = [];
        newObject.connectedEdges = [];
        newObject.important = false;
        if (currentNodeName == "Student Debt") { // important for the main node
            setImportanceForNode(currentNodeName, true);
        }
        newObject.description = currentDescription;
        newObject.imgPath = newImagePath
        graphs.nodes.push(newObject);
    }
}

// responsible for converting the .csv file containing the link relationships to actual edge components
// this method also "kickstarts" the entire program! it calls the following methods:
// storeLinksNodesToEachNode, drawGraph, and addStyles methods.
const parseEdgesCSVToGraphEdges = (data) => {
    for (let i = 1; i < data.length; i++) {
        let currentSource = data[i]["Source"];
        let currentTarget = data[i]["Target"];
        let getImportance = data[i]["Important"];
        // if the relation important, set the edge source to important
        if (getImportance == "TRUE") {
            setImportanceForNode(currentTarget, true);
        }
        else {
            setImportanceForNode(currentTarget, false);
        }
        let newObject = {};
        newObject.source = getIndexOfNode(currentSource);
        newObject.target = getIndexOfNode(currentTarget);
        graphs.edges.push(newObject);
    }
    storeLinksNodesToEachNode();
    drawGraph();
    addStyles();
}

// sets the important attribute for each node
// P.S.: important means that this node (or this topic) is a key point for the argument
const setImportanceForNode = (targetName, importance) => {
    let nodeSet = graphs.nodes;
    for (let i = 0; i < nodeSet.length; i++) {
        if (nodeSet[i]["name"] == targetName) {
            nodeSet[i]["important"] = importance;
        }
    }
}

// gets the index of the node name being input in the local database graph.nodes! necessary for edge construction
const getIndexOfNode = (nodeNameToFind) => {
    let nodeSet = graphs.nodes;
    for (let i = 0; i < nodeSet.length; i++) {
        if (nodeSet[i]["name"] == nodeNameToFind) {
            return i;
        }
    }
}

// responsible for connecting the edges to the nodes as the edges are being read from a .csv file
const storeLinksNodesToEachNode = () => {
    // get the set of nodes and edges
    let nodeSet = graphs.nodes;
    let edgeSet = graphs.edges;
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

// get the nodes and add an event click listener to all of them
const addStyles = () => {
    let rects = document.querySelectorAll(".twinkle");
    let textLabels = document.querySelectorAll("text");
    let lastPopoutTop;
    let lastPopoutLeft;
    

    // NODES CONFIGURATIONS
    rects.forEach((rect) => {

        // RESPONSIBLE FOR TEXT LABELS
        if (rect["__data__"]["name"].toUpperCase() == "STUDENT DEBT") {
            rect.classList.add("main");
        }
        if (rect["__data__"]["important"]) {
            rect.classList.add("important");
            let nodeName = rect["__data__"]["name"].toUpperCase();
            textLabels.forEach((text) => {
                if (text["textContent"] == nodeName) {
                    text.classList.add("importantText");
                }
            });
        }
        textLabels.forEach((text) => {
            if (text["textContent"].toUpperCase() == "STUDENT DEBT") {
                text.id = "main-node";
                text.style.color = "white !important";
                
            }
        })

        // EVENT LISTENERS: hovering over a node
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
                textLabelsAssociated.push(node["name"].toUpperCase());
            });
            allTextLabels.forEach((text) => {
                if (text["textContent"] == e["target"]["__data__"]["name"].toUpperCase()) {
                    text.classList.add("textShown");
                }
                if (textLabelsAssociated.includes(text["textContent"])) {
                    text.classList.add("textShown");
                }
                if(text["textContent"] == "STUDENT DEBT") {
                    text.style.color = "white !important"
                    text.classList.add("main-text");
                }
            });
            edgesOfRects.forEach((edge) => {
                // get all existing edges in the document
                allEdges.forEach((match) => {
                    // get source and target of those edges
                    let sourceNode = match["__data__"]["source"];
                    let targetNode = match["__data__"]["target"];
                    // if this is the edge that we are looking for then apply the link styles
                    if (sourceNode.name == edge.source.name && targetNode.name == edge.target.name) {
                        match.classList.add("linkShown");
                        
                        if (e["target"]["__data__"]["important"] == null || e["target"]["__data__"]["important"] == undefined) {
                            let connectedEdgesToTarget = e["target"]["__data__"]["connectedEdges"];
                            connectedEdgesToTarget.forEach((edge) => {
                                allEdges.forEach((edge) => {
                                    if (e["target"]["__data__"]["name"] == edge["__data__"]["source"] || e["target"]["__data__"]["name"] == edge["__data__"]["target"]) {
                                        edge.classList.add("overrideLink");
                                    }
                                });
                            });
                        }
                        else if ((match["__data__"]["source"]["important"] == true || match["__data__"]["target"]["important"] == true )
                            && e["target"]["__data__"]["important"] == true) {
                            match.classList.add("importantLink");
                        }
                        if (e["target"]["__data__"]["name"].toUpperCase() == "STUDENT DEBT") {
                            match.classList.add("main-link");
                        }
                    }
                    else if (sourceNode.name == edge.target.name && targetNode.name == edge.source.name) {
                        match.classList.add("linkShown");
                    }
                });
            });
        });

        // EVENT LISTENERS: clicking the node
        rect.addEventListener("click", e => {
            let nodeName = rect["__data__"].name;
            // TO MAKE SURE STUDENT DEBT NODE IS IMPORTANT
            if(nodeName == 'Student Debt') {
                rect["__data__"].important = true;
            }

            // master popout
            let masterPopout = document.createElement("div");
            masterPopout.classList.add("default-popout");
            masterPopout.classList.add("show");
            masterPopout.id = `popout${idCount++}`;
            if (rect["__data__"].important) { // add shit here to the master popout if it is important
                masterPopout.style.border = "solid 1px white";
                masterPopout.style.backgroundColor = "white";
            }            
            
            // title pane
            let titleDiv = document.createElement("div");
            titleDiv.innerHTML = rect["__data__"].name.toUpperCase();
            titleDiv.classList.add("title-bar");
            
            // image
            let image;
            let imagePath = rect["__data__"].imgPath;
            if (imagePath != undefined || imagePath != null) {
                image = document.createElement("img");
                image.setAttribute('src', imagePath);
                image.setAttribute('width', "100%")
                image.setAttribute("height", "auto")
                image.style.border = "1px solid #FF5F1F";
                if (rect["__data__"].important) {
                    image.style.border = "1px solid white";
                }
            }
            // description
            let descriptionDiv = document.createElement("div");

            // textDiv
            let textDiv = document.createElement("div");
            textDiv.textContent = rect["__data__"].description;
            textDiv.classList.add("desc");
            descriptionDiv.appendChild(textDiv);

            // suggested feeds
            let suggestedDiv = document.createElement("div");
            suggestedDiv.classList.add("suggested");
            suggestedDiv.textContent = "📰 Suggested Feeds (NYT API)";
            // for filling out the suggested feeds
            findSuggested(nodeName);
            // for fetching data from the api
            setTimeout(() => {
                let lists = document.createElement("ul");
                for (let i = 0; i < 3; i++) {
                    let item = document.createElement("li");
                    let link = document.createElement("a")
                    link.innerHTML = suggestedTitles[i];
                    link.href = suggestedLinks[i];
                    link.id = `link${linkCount}`
                    item.appendChild(link);
                    lists.appendChild(item);
                    
                }
                suggestedDiv.appendChild(lists);
            }, 1000);
            
            // main pane
            let mainPaneDiv = document.createElement("div");
            mainPaneDiv.classList.add("main-pane")
            if (rect["__data__"].important) { // add shit here to the master popout if it is important
                mainPaneDiv.style.color = "white";
            }
            if (image != null || image != undefined) {
                mainPaneDiv.appendChild(image);
            }
            mainPaneDiv.appendChild(descriptionDiv);
            mainPaneDiv.appendChild(suggestedDiv);
           
            // close button
            let x = document.createElement("h1");
            x.classList.add("exit");
            x.textContent = "x";
            if (rect["__data__"].important) { // add shit here to the master popout if it is important
                x.style.color = "white";
                x.style.border = "1px solid white";
            }
            // event listener for the close button
            x.addEventListener("click", e => {
                let popoutToKillID = e["path"][1].id;
                let popoutToKill = document.getElementById(popoutToKillID)
                popoutToKill.classList.add("hide");
                popoutToKill.addEventListener("animationend", () => {
                    document.body.removeChild(popoutToKill);
                });
                idCount--;
                if (idCount == 0) {
                    let closerBtn = document.getElementById("closer");
                    closerBtn.classList.add("hide");
                    closerBtn.addEventListener("animationend", () => {
                        document.body.removeChild(closerBtn);
                        
                    })
                }
            })

            // APPENDATIONS TO MASTERPOPOUT
            masterPopout.appendChild(titleDiv);
            masterPopout.appendChild(mainPaneDiv);
            masterPopout.appendChild(x);

            // APPENDATIONS
            document.body.appendChild(masterPopout);
        
        
            // RESPONSIBLE FOR THAT CASCADING EFFECT WHEN OPENED
            // IF THIS DIV IS THE FIRST ONE
            // POPOUTDIV IS MASTER DIV
            // PREREQS: the master popout div, var lastPopoutTop, lastPopoutLeft
            if (lastPopoutTop == undefined && lastPopoutLeft == undefined) {
                lastPopoutTop = "5";
                lastPopoutLeft = "3";
                masterPopout.style.top = lastPopoutTop + "vh";
                masterPopout.style.left = lastPopoutLeft + "vw";
            }
            // IF THERE'S ALREADY A DIV EXISTING
            else {
                let newTop = parseInt(lastPopoutTop) + 3;
                let newLeft = parseInt(lastPopoutLeft) + 2

                lastPopoutTop = newTop;
                lastPopoutLeft = newLeft;
                masterPopout.style.top = `${newTop}vh`;
                masterPopout.style.left = `${newLeft}vw`;
            }
            draggableDivs();
            
            // RESPONSIBLE FOR THE CLOSE BUTTON DESTROY ALL BUTTON
            // ID closer IS THE "X DESTROY ALL" ID
            // MAKE SURE THERE'S ONLY ONE "X DESTROY ALL"
            // PREREQS: idCount variable, ".default-popout" class for the popouts
            let closers = document.getElementById("closer");
            if ((closers == undefined || closers == null)) {
                console.log("here");
                // RESPONSIBLE FOR MAKING THE DIV APPEAR
                let closer = document.createElement("div");
                closer.textContent = "x destroy all";
                closer.classList.add("closer");
                closer.classList.add("show");
                closer.id = "closer";
                document.body.appendChild(closer);

                // ADDEVENTLISTENER FOR WHEN YOU CLICK THE DIV: SHOULD CLOSE ALL POPOUTS INCLUDING ITSELF
                closer.addEventListener("click", () => {
                    // GET ALL POPOUTS
                    let popouts = document.querySelectorAll(".default-popout");
                    // FOR EACH POPOUT
                    popouts.forEach((popout) => {
                        // ADD THE HIDE ANIMATION
                        popout.classList.add("hide");
                        // WHEN THAT ANIMATION ENDS
                        popout.addEventListener("animationend", () => {
                            // REMOVE THE POPOUTS FROM THE DOCUMENT.BODY
                            document.body.removeChild(popout);
                        });
                        // DECREASE THE IDCOUNT
                        idCount--;
                    });
                    // ADD THE HIDE ANIMATION
                    closer.classList.add("hide");
                    // WHEN THAT ANIMATION ENDS
                    closer.addEventListener("animationend", () => {
                        // REMOVE THE POPOUTS FROM THE DOCUMENT.BODY
                        document.body.removeChild(closer);
                    })                    
                })

            }
            if (idCount == 0) {
                let destroyBtn = document.getElementById("closer");
                destroyBtn.classList.add("hide");
                destroyBtn.addEventListener("animationend", () => {
                    // REMOVE THE POPOUTS FROM THE DOCUMENT.BODY
                    document.body.removeChild(destroyBtn);
                })  

            }
            
            // INSTRUCTION DIV SETTINGS
            let instructionDiv = document.querySelector(".instructions");
            if (idCount > 0) {
                instructionDiv.classList.add("hide");
                
                instructionDiv.addEventListener("animationend", () => {
                    instructionDiv.classList.add("hidden-instructions");
                });
                
            }
            if (idCount == 0) {
                instructionDiv.classList.remove("hidden-instructions");
                instructionDiv.classList.remove("hide");
                instructionDiv.classList.add("visible-instructions");
            }

        });
    });

    // HOVER EFFECT FOR TEXT LABELS
    textLabels.forEach((label) => {
        label.addEventListener("mouseover", e => {
            label.classList.add("textBoldened");
        });
        label.addEventListener("mouseleave", e => {
            label.classList.remove("textBoldened");
        })
    });

    // TEXT LABEL FOR MAIN NODE
    let mainNode = document.getElementById("main-node");
    mainNode.style.color = "white";
    mainNode.classList.add("show-main");
    setTimeout(() => {
        mainNode.classList.add("hide");
        mainNode.classList.remove("show-main");
    }, 4000)

}

// RESPONSIBLE FOR ALLOWING THE POPOUTS TO BE DRAGGABLE
const draggableDivs = () => {
    divs = document.querySelectorAll(".default-popout");
            for (div of divs) div.onmousedown = onMouseDown;
            document.onmousemove = onMouseMove;
            document.onmouseup   = onMouseUp;
            let the_moving_div = ''; 
            let the_last_mouse_position = { x:0, y:0 };
            
            function onMouseDown(e) {
                e.preventDefault();
                the_moving_div            = e.target.id;      // remember which div has been selected 
                the_last_mouse_position.x = e.clientX;        // remember where the mouse was when it was clicked
                the_last_mouse_position.y = e.clientY;            
                var divs = document.querySelectorAll(".default-popout");
                e.target.style.zIndex = divs.length;          // put this div  on top
                var j = 1; for (div of divs) if (div.id != the_moving_div) div.style.zIndex = j++;   // put all other divs behind the selected one
            }
            
            function onMouseMove(e) {
                e.preventDefault();
                if (the_moving_div == "") return;
                var d = document.getElementById(the_moving_div);
                d.style.left = d.offsetLeft + e.clientX - the_last_mouse_position.x + "px";     // move the div by however much the mouse moved
                d.style.top  = d.offsetTop  + e.clientY - the_last_mouse_position.y + "px";
                the_last_mouse_position.x = e.clientX;                                          // remember where the mouse is now
                the_last_mouse_position.y = e.clientY;
            }
            
            function onMouseUp(e) {
                e.preventDefault();
                if (the_moving_div == "") return;
                the_moving_div = "";
            }
}

// RESPONSIBLE FOR FETCHING ARTICLES FROM THE NEW YORK TIMES API WITH @param article name
async function findSuggested(name) {
    let currentNodeName = name;
    // !IMPORTANT!!! I am a bit intimidated with figuring out how to hide api-keys in Github reps so please don't use it :( 
    let url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${currentNodeName}&api-key=xAskm0aJnTaEfA22HWvzeIEfg6WyLTaQ`;
    const response = await fetch(url);
    const data = await response.json();
    suggestedLinks = [
        data.response.docs[0]["web_url"],
        data.response.docs[1]["web_url"],
        data.response.docs[2]["web_url"]
    ]
    suggestedTitles =  [
        data.response.docs[0].headline.main,
        data.response.docs[1].headline.main,
        data.response.docs[2].headline.main
    ]
    return;
}
const showWarning = () => {
    let startingDiv = document.querySelector(".warning");
    startingDiv.classList.add("show");
    setTimeout(() => {
        startingDiv.classList.remove("show");
        startingDiv.classList.add("hide");
        startingDiv.addEventListener("animationend", e => {
            document.body.removeChild(startingDiv);
        });
    }, 3500)
}

d3.csv("nodesDescs.csv", parseNodesCSVToGraphNodes);
d3.csv("edges.csv", parseEdgesCSVToGraphEdges);
showWarning();
