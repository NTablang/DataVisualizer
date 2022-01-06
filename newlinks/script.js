let graphs = {
    nodes: [
    ], 
    edges: [
    ]
}

let idCount = 0;

/*
// customization variables
let squareSideLength = 5;
let nodeWidth = squareSideLength;
let nodeHeight = squareSideLength;
let distancesBetweenLinks = 250;
let nodeColor = "#FF5F1F";
let linkStrength = 10;
let charge = 0;
let grav = 0;
let w = window.innerWidth;
let h = window.innerHeight;
*/

// the simulation graph
const drawGraph = () => {
    let nodeSideLength = 10;
    let nodeWidth = nodeSideLength;
    let nodeHeight = nodeSideLength;
    let distancesBetweenLinks = 250;
    let nodeColor = "#FF5F1F";
    let linkStrength = 1;
    let grav = 0.1;

    let w = window.innerWidth;
    let h = window.innerHeight;
   
    /*
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
    */

    // force simulation
    let force = d3.layout.force()
        .size([w, h])
        .nodes(graphs.nodes)
        .links(graphs.edges)
        .linkDistance(distancesBetweenLinks)
        .charge(function(d){
            let charge = -900;
            if (d.index === 0) charge = 10 * charge;
            return charge;
        })
        .linkStrength(linkStrength)
        .gravity(grav)
        .start();


    let svg = d3.select(".graph")
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


    let edges = svg.selectAll("line")
        .data(graphs.edges)
        .enter()
        .append("line")
        .attr("class", "link");

    let nodes = svg.selectAll(".node")
        .data(graphs.nodes)
        .enter().append("rect")
        .attr("class", "node")
        .attr("class", "twinkle")
        .attr("width", nodeWidth)
        .attr("height", nodeHeight)
        .style("fill", nodeColor)
        .call(force.drag);
    
    let label = svg.selectAll(".mytext")
        .data(graphs.nodes)
        .enter()
        .append("text")
        .text(function (d) { return d.name.toUpperCase(); })
        .style("text-anchor", "middle")
        .style("fill", nodeColor)
        .attr("class", "defaultText")
        .style("font-size", 12);

    force.on("tick", function(){
        edges.attr("x1", function(d){ return d.source.x - 1; })
            .attr("y1", function(d){ return d.source.y + 5; })
            .attr("x2", function(d){ return d.target.x - 1; })
            .attr("y2", function(d){ return d.target.y + 5; });
        nodes.attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });
        label.attr("x", function(d){ return d.x + 20; })
            .attr("y", function (d) {return d.y - 10; });        
    });

    setInterval(() => {
        let offset = Math.random() + 10;
        force.start();

        force.on("tick", function() {
        edges.attr("x1", function(d){ return d.source.x + offset - 1;})
            .attr("y1", function(d){ return d.source.y + offset - 1; })
            .attr("x2", function(d){ return d.target.x + offset - 1; })
            .attr("y2", function(d){ return d.target.y + offset - 1; });
        nodes.attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });
        label.attr("x", function(d){ return d.x + 20; })
            .attr("y", function (d) {return d.y - 10; });
        })
    }, 100)

}



const parseNodesCSVToGraphNodes = (data) => {
    console.log("parsing!");
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        let newObject = {};
        let currentNodeName = data[i]["Topic"];
        let currentDescription = data[i]["Description"];
        let newImagePath = data[i]["Image Path"];


        newObject.name = currentNodeName;
        newObject.connectedNodes = [];
        newObject.connectedEdges = [];
        newObject.important = false;
        if (currentNodeName == "Student Debt") {
            setImportanceForNode(currentNodeName, true);
        }
        newObject.description = currentDescription;
        newObject.imgPath = newImagePath
        graphs.nodes.push(newObject);
    }

}
const parseEdgesCSVToGraphEdges = (data) => {
    for (let i = 1; i < data.length; i++) {
        let currentSource = data[i]["Source"];
        let currentTarget = data[i]["Target"];
        let getImportance = data[i]["Important"];
        if (getImportance == "TRUE") {
            setImportanceForNode(currentTarget, true);
        }
        else {
            setImportanceForNode(currentTarget, false);
        }
        let newObject = {};
        newObject.source = getIndexOfNode(currentSource);
        newObject.target = getIndexOfNode(currentTarget);
        console.log("currentsource: " + currentSource);
        console.log("currentarget: " + currentTarget);
        console.log("new edge!: " + newObject.source + " " + newObject.target);
        graphs.edges.push(newObject);
    }
    showDataSet();
    storeLinksNodesToEachNode();
    drawGraph();
    addStyles();

}

const setImportanceForNode = (targetName, importance) => {
    console.log(targetName);
    let nodeSet = graphs.nodes;
    for (let i = 0; i < nodeSet.length; i++) {
        if (nodeSet[i]["name"] == targetName) {
            nodeSet[i]["important"] = importance;
        }
    }
}
const getIndexOfNode = (nodeNameToFind) => {
    let nodeSet = graphs.nodes;
    for (let i = 0; i < nodeSet.length; i++) {
        if (nodeSet[i]["name"] == nodeNameToFind) {
            return i;
        }
    }
}
d3.csv("nodesDescs.csv", parseNodesCSVToGraphNodes);
d3.csv("edges.csv", parseEdgesCSVToGraphEdges);


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

const showDataSet = () => {
    let nodeSet = graphs.nodes;
    let edgeSet = graphs.edges;

    console.log("NODES");
    console.log(nodeSet);

    console.log("EDGES");
    console.log(edgeSet);
}

// get the nodes and add an event click listener to all of them
const addStyles = () => {

    let rects = document.querySelectorAll(".twinkle");
    let textLabels = document.querySelectorAll("text");
    //let edgeSet = document.querySelectorAll(".link");
    let lastPopoutTop;
    let lastPopoutLeft;
    //let lastPopout;

    console.log("RECTS: ");
    console.log(textLabels);

    // for nodes
    rects.forEach((rect) => {

        if (rect["__data__"]["name"].toUpperCase() == "STUDENT DEBT") {
            rect.classList.add("main");
        }
        if (rect["__data__"]["important"]) {
            console.log("Test");
            rect.classList.add("important");
            let nodeName = rect["__data__"]["name"].toUpperCase();
            textLabels.forEach((text) => {
                if (text["textContent"] == nodeName) {
                    text.classList.add("importantText");
                }
            });
        }

        // event listeners: hovering over a node
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
                    text.classList.add("main-text");
                }
            });

            edgesOfRects.forEach((edge) => {
                // get all existing edges in the document

                allEdges.forEach((match) => {
                    // get source and target of those edges
                    let sourceNode = match["__data__"]["source"];
                    let targetNode = match["__data__"]["target"];
                    // if this is the edge that we are looking for then apply the link shown
                    if (sourceNode.name == edge.source.name && targetNode.name == edge.target.name) {
                        console.log("here000!!!!!");
                        match.classList.add("linkShown");
                        console.log(match["__data__"]);
                        
                        if (e["target"]["__data__"]["important"] == null || e["target"]["__data__"]["important"] == undefined) {
                            let connectedEdgesToTarget = e["target"]["__data__"]["connectedEdges"];
                            connectedEdgesToTarget.forEach((edge) => {
                                console.log("test here");
                                console.log(edge);
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
                        console.log("here222!!!!!");
                        match.classList.add("linkShown");
                        console.log(match["__data__"]);
                    }
                });
            });
        
        
        
        
        
        
        
        });
        // event listeners: clicking the node
        rect.addEventListener("click", e => {
            
            
            if(rect["__data__"].name == 'Student Debt') {
                rect["__data__"].important = true;
            }


            console.log(rect["__data__"].description);
            
        
            let popoutDiv = document.createElement("div");
            let textDiv = document.createElement("div");
            /* CLOSE BUTTON */
            let closeDiv = document.createElement("div");
            let x = document.createElement("h1");
            x.innerHTML = "x";
            if (!rect["__data__"].important) {
                x.classList.add("non-important-close-div");
                
            }
            else {
                //x.classList.add("close-div");
            }
            //x.style.bottom = `${-50}vh;`
            x.addEventListener("click", e => {
                           // popoutDiv.classList.add("hide");


                let popoutToKillID = e["path"][2].id;
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

            /* TITLE BAR */ 
            let title = document.createElement("h2");
            title.innerHTML = rect["__data__"].name.toUpperCase();
            title.classList.add("titleBar");

            /* TEXT DIV */
            console.log("try again");
            console.log(rect["__data__"].important);
            let nodeDescription = rect["__data__"].description;
            let imagepath = rect["__data__"].imgPath
            textDiv.classList.add("popout");
            if (imagepath != undefined) {
                let image = document.createElement("img");
                image.setAttribute('src', imagepath);
                image.setAttribute('width', "100%")
                image.setAttribute("height", "auto")
                textDiv.append(image);
            }
            let textdescriptionDiv = document.createElement("div");
            textdescriptionDiv.classList.add("descriptor");
            textdescriptionDiv.textContent = nodeDescription;
            if (!rect["__data__"].important) {
                textdescriptionDiv.style.color = "#FF5F1F";
            }
            textDiv.append(textdescriptionDiv);

            /* CLOSE BUTTON */
            closeDiv.classList.add("close-div");
            closeDiv.appendChild(x);

            /* POPOUT CONTAINER */
            popoutDiv.textContent = rect["__data__"].name.toUpperCase();
            popoutDiv.appendChild(textDiv);
            popoutDiv.appendChild(closeDiv);

            popoutDiv.classList.add("show");

            popoutDiv.classList.add("actual-popout");
            popoutDiv.classList.add("popout-app1");

            console.log("ifndsijfgnsfjon!");
            console.log(rect["__data__"].name);

            
            if (!rect["__data__"].important) {
                console.log("Haha");
                console.log(rect["__data__"].important);
                popoutDiv.classList.add("non-important-popout");
            }
            else {
                popoutDiv.style.border = "1px white solid;"
            }

           // popoutDiv.textContent = rect["__data__"].name;
            popoutDiv.id = `drag${idCount}`;
            
            idCount++;
            
        
            // if there's already a div
            console.log(lastPopoutTop);
            console.log(lastPopoutLeft)
            if (lastPopoutTop == undefined && lastPopoutLeft == undefined) {
                console.log("first one");
                lastPopoutTop = "5";
                lastPopoutLeft = "3";
                popoutDiv.style.top = lastPopoutTop + "vh";
                popoutDiv.style.left = lastPopoutLeft + "vw";
            }
            else {
                console.log("there's already a div")
                console.log(lastPopoutTop);
                console.log(lastPopoutLeft);
                let newTop = parseInt(lastPopoutTop) + 3;
                let newLeft = parseInt(lastPopoutLeft) + 2

                lastPopoutTop = newTop;
                lastPopoutLeft = newLeft;

                console.log("newtop: " + newTop);
                console.log("newLeft: " + newLeft);
                popoutDiv.style.top = `${newTop}vh`;
                popoutDiv.style.left = `${newLeft}vw`;
            }
            

            

            
            console.log(`"lastpopoutx: ${lastPopoutTop}"`);
            console.log(`"lastpopoutx: ${lastPopoutLeft}"`);

            
            document.body.appendChild(popoutDiv);
            draggableDivs();



            let closers = document.getElementById("closer");
            if ( (closers == undefined || closers == null)) {
                let closer = document.createElement("div");
                closer.textContent = "x destroy all";
                closer.classList.add("closer");
                closer.classList.add("show");
                closer.id = "closer";
                document.body.appendChild(closer);


                closer.addEventListener("click", () => {
                    let popouts = document.querySelectorAll(".actual-popout");

                    console.log("clicked");
                    popouts.forEach((popout) => {
                        popout.classList.add("hide");
                        popout.addEventListener("animationend", () => {
                            document.body.removeChild(popout);
                        });
                        idCount--;
                    });
                    closer.classList.add("hide");
                    closer.addEventListener("animationend", () => {
                        document.body.removeChild(closer);
                    })
                    console.log(idCount);
                    
                })
                            //let popouts = document.querySelectorAll(".actual-popout");

            }
        });

        // still part of applyStyles() function
        //draggableDivs();
    
    });

    textLabels.forEach((label) => {
        label.addEventListener("mouseover", e => {
            label.classList.add("textBoldened");
        });
        label.addEventListener("mouseleave", e => {
            label.classList.remove("textBoldened");
        })
    });
    /*
    console.log(idCount);
    if (idCount > 0) {
        let close = document.getElementById("closer");
        console.log("amount");
        console.log(close);
        close.addEventListener("click", () => {
        console.log("here");
        /*
        let popouts = document.querySelectorAll("actual-popout");
        popouts.forEach((popout) => {
            popout.classList.add("hide");
            popout.addEventListener("animationend", () => {
                document.body.removeChild(popout);
            })
        });
        
        })
    }
    */

}

const draggableDivs = () => {
    divs = document.querySelectorAll(".popout-app1");
            for (div of divs) div.onmousedown = onMouseDown;
            
            document.onmousemove = onMouseMove;
            document.onmouseup   = onMouseUp;
            
           // canvas.width = window.innerWidth - 20;
           // canvas.height = window.innerHeight - 20;
            
            let the_moving_div = ''; 
            let the_last_mouse_position = { x:0, y:0 };
            
            
            function onMouseDown(e) {
                e.preventDefault();
                the_moving_div            = e.target.id;      // remember which div has been selected 
                the_last_mouse_position.x = e.clientX;        // remember where the mouse was when it was clicked
                the_last_mouse_position.y = e.clientY;
                //e.target.style.border = "2px solid white";     // highlight the border of the div
            
                var divs = document.querySelectorAll(".popout-app1");
                
                e.target.style.zIndex = divs.length;          // put this div  on top
                //var i = 1; for (div of divs) if (div.id != the_moving_div) div.style.zIndex = i++;   // put all other divs behind the selected one
            }
            
            function onMouseMove(e) {
                e.preventDefault();
                if (the_moving_div == "") return;
                var d = document.getElementById(the_moving_div);
                d.style.left = d.offsetLeft + e.clientX - the_last_mouse_position.x + "px";     // move the div by however much the mouse moved
                d.style.top  = d.offsetTop  + e.clientY - the_last_mouse_position.y + "px";
                the_last_mouse_position.x = e.clientX;                                          // remember where the mouse is now
                the_last_mouse_position.y = e.clientY;
                //drawConnectors();
            }
            
            function onMouseUp(e) {
                e.preventDefault();
                if (the_moving_div == "") return;
                the_moving_div = "";
            }
}
/*
const draggable1 = () => {
    divs = document.querySelectorAll(".popout-app1");
    for (div of divs) div.onmousedown = onMouseDown;
    
    document.onmousemove = onMouseMove;
    document.onmouseup   = onMouseUp;
    
   // canvas.width = window.innerWidth - 20;
   // canvas.height = window.innerHeight - 20;
    
    let the_moving_div = ''; 
    let the_last_mouse_position = { x:0, y:0 };
    
    
    function onMouseDown(e) {
        e.preventDefault();
        the_moving_div            = e.target.id;      // remember which div has been selected 
        the_last_mouse_position.x = e.clientX;        // remember where the mouse was when it was clicked
        the_last_mouse_position.y = e.clientY;
        e.target.style.border = "2px solid blue";     // highlight the border of the div
    
        var divs = document.querySelectorAll(".popout-app1");
        
        e.target.style.zIndex = divs.length;          // put this div  on top
        var i = 1; for (div of divs) if (div.id != the_moving_div) div.style.zIndex = i++;   // put all other divs behind the selected one
    }
    
    function onMouseMove(e) {
        e.preventDefault();
        if (the_moving_div == "") return;
        var d = document.getElementById(the_moving_div);
        d.style.left = d.offsetLeft + e.clientX - the_last_mouse_position.x + "px";     // move the div by however much the mouse moved
        d.style.top  = d.offsetTop  + e.clientY - the_last_mouse_position.y + "px";
        the_last_mouse_position.x = e.clientX;                                          // remember where the mouse is now
        the_last_mouse_position.y = e.clientY;
        //drawConnectors();
    }
    
    function onMouseUp(e) {
        e.preventDefault();
        if (the_moving_div == "") return;
        document.getElementById(the_moving_div).style.border = "none";             // hide the border again
        the_moving_div = "";
    }
    
}

*/