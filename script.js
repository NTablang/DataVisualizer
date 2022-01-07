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
    let nodeSideLength = 8;
    let nodeWidth = nodeSideLength;
    let nodeHeight = nodeSideLength;
    let distancesBetweenLinks = 250;
    let nodeColor = "#FF5F1F";
    let linkStrength = 0;
    let grav = 0.3;

    let w = window.innerWidth - 50;
    let h = window.innerHeight - 60;
   
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
        /*
       
        */
       .charge([1100])
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
        textLabels.forEach((text) => {
            console.log(text["textContent"]);
            if (text["textContent"].toUpperCase() == "STUDENT DEBT") {
                text.id = "main-node";
                
            }
        })

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
            let nodeName = rect["__data__"].name;
            
            
            // TO MAKE SURE STUDENT DEBT NODE IS IMPORTANT
            if(rect["__data__"].name == 'Student Debt') {
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
                console.log(imagePath);
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
            mainPaneDiv.appendChild(image);
            mainPaneDiv.appendChild(descriptionDiv);
            mainPaneDiv.appendChild(suggestedDiv);
           
            // close button
            let x = document.createElement("h1");
            x.classList.add("exit");
           //x.id = "closer";
            x.textContent = "x";
            if (rect["__data__"].important) { // add shit here to the master popout if it is important
                x.style.color = "white";
                x.style.border = "1px solid white";
            }
            
            x.addEventListener("click", e => {
                console.log(e);
                let popoutToKillID = e["path"][1].id;
                let popoutToKill = document.getElementById(popoutToKillID)
                popoutToKill.classList.add("hide");
                popoutToKill.addEventListener("animationend", () => {
                    document.body.removeChild(popoutToKill);
                    console.log(idCount);
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

            /*
            let popoutDiv = document.createElement("div"); // main popout
            let textDiv = document.createElement("div");
            // CLOSE BUTTON 
            let closeDiv = document.createElement("div");
            let x = document.createElement("h1"); // x button
            x.innerHTML = "x";
            if (!rect["__data__"].important) {
                x.classList.add("non-important-close-div");
        
            }

            // removing the popout: CLICKING THE X BUTTON
            x.addEventListener("click", e => {
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

            // POPOUT MAKERS BEGIN HERE
            // TITLE BAR 
            let nodeName = rect["__data__"].name;
            let title = document.createElement("h2");
            title.innerHTML = nodeName.toUpperCase();
            title.classList.add("titleBar");

            // TEXT DIV 
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
            // LINKS ADDON TO TEXTDESCRIPTIONDIV /
            let suggestedDiv = document.createElement("div");
            suggestedDiv.classList.add("suggestedLinks");
            suggestedDiv.textContent = "📰 Suggested Feeds";
            if (!rect["__data__"].important) {
                suggestedDiv.classList.add("non-important-a");
            }
            
            // SUGGESTED FEEDS WITH NYT API
            findSuggested(nodeName);
            setTimeout(() => {
                console.log("chk");
                //console.log(suggested[0]);

                let lists = document.createElement("ul");
                

                for (let i = 0; i < 3; i++) {
                    let item = document.createElement("li");
                    let link = document.createElement("a")
                    link.innerHTML = suggestedTitles[i];
                    link.href = suggestedLinks[i];
                    link.id = `link${linkCount}`
                    item.appendChild(link);
                    lists.appendChild(item);
                    idCount++;

                    
                }
                
                textdescriptionDiv.appendChild(lists);

            }, 1000);
            
            
            textdescriptionDiv.appendChild(suggestedDiv);
            textDiv.append(textdescriptionDiv);

            // CLOSE BUTTON //
            closeDiv.classList.add("close-div");
            closeDiv.appendChild(x);

            // POPOUT CONTAINER //
            popoutDiv.textContent = rect["__data__"].name.toUpperCase();
            popoutDiv.appendChild(textDiv);
           // textdescriptionDiv.classList.add("popout");
           // popoutDiv.appendChild(textdescriptionDiv);
            popoutDiv.appendChild(closeDiv);

            popoutDiv.classList.add("show");

            popoutDiv.classList.add("actual-popout");
            popoutDiv.classList.add("popout-app1");

            console.log("ifndsijfgnsfjon!");
            console.log(rect["__data__"].name);

            
            // THIS IS APPARENTLY FOR SETTING UP THE BORDER?
            if (!rect["__data__"].important) {
                console.log("Haha");
                console.log(rect["__data__"].important);
                popoutDiv.classList.add("non-important-popout");
            }
            else {
                popoutDiv.style.border = "1px white solid;"
            }
            popoutDiv.id = `drag${idCount}`;
            idCount++;
            */
            
        
            // RESPONSIBLE FOR THAT CASCADING EFFECT WHEN OPENED
            // IF THIS DIV IS THE FIRST ONE
            // POPOUTDIV IS MASTER DIV
            // PREREQS: the master popout div, var lastPopoutTop, lastPopoutLeft
            if (lastPopoutTop == undefined && lastPopoutLeft == undefined) {
                console.log("first one");
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

            
            //document.body.appendChild(popoutDiv);
            draggableDivs();
            
           


            
            // RESPONSIBLE FOR THE CLOSE BUTTON DESTROY ALL BUTTON
            // ID closer IS THE "X DESTROY ALL" ID
            // MAKE SURE THERE'S ONLY ONE "X DESTROY ALL"
            // PREREQS: idCount variable, ".default-popout" class for the popouts
            let closers = document.getElementById("closer");
            if ((closers == undefined || closers == null)) {
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
            // POPOUT ENDS HERE
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




















        
        // still part of applyStyles() function
        
    
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

    let mainNode = document.getElementById("main-node");
    mainNode.classList.add("show-main");
    setTimeout(() => {
        mainNode.classList.add("hide");
        mainNode.classList.remove("show-main");
    }, 4000)

}

const draggableDivs = () => {
    divs = document.querySelectorAll(".default-popout");
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
                //drawConnectors();
            }
            
            function onMouseUp(e) {
                e.preventDefault();
                if (the_moving_div == "") return;
                the_moving_div = "";
            }
}

const gotData = (data) => {
    lastFetch = data;
    return;
}

async function findSuggested(name) {
    console.log("finding articles for")
    console.log(name);
    let currentNodeName = name;
    let url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${currentNodeName}&api-key=xAskm0aJnTaEfA22HWvzeIEfg6WyLTaQ`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data.response.docs[0].headline);
    console.log(data.response.docs[1].headline);
    console.log(data.response.docs[2].headline);
    suggestedLinks = [
        data.response.docs[0]["web_url"],
        data.response.docs[0]["web_url"],
        data.response.docs[0]["web_url"]
    ]
    suggestedTitles =  [
        data.response.docs[0].headline.main,
        data.response.docs[1].headline.main,
        data.response.docs[2].headline.main
    ]
    return;
}
function hoverdiv(e,divid){

    var left  = e.clientX  + "px";
    var top  = e.clientY  + "px";

    var div = document.getElementById(divid);

    div.style.left = left;
    div.style.top = top;

    $("#"+divid).toggle();
    return false;
}