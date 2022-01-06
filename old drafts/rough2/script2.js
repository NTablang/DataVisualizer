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




var canvas = document.querySelector("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width,
    height = canvas.height,
    searchRadius = 40;

var color = d3.scaleOrdinal()
    .range(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-18))
    .force("link", d3.forceLink().iterations(4).id(function(d) { return d.id; }))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

d3.json("graph.json", function(error, graph) {
  if (error) throw error;

  var users = d3.nest()
      .key(function(d) { return d.user; })
      .entries(graph.nodes)
      .sort(function(a, b) { return b.values.length - a.values.length; });

  color.domain(users.map(function(d) { return d.key; }));

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(dataset.edges);

  d3.select(canvas)
      .on("mousemove", mousemoved)
      .call(d3.drag()
          .container(canvas)
          .subject(dragsubject)
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  function ticked() {
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);

    context.beginPath();
    dataset.edges.forEach(drawLink);
    context.strokeStyle = "#aaa";
    context.stroke();

    users.forEach(function(user) {
      context.beginPath();
      user.values.forEach(drawNode);
      context.fillStyle = color(user.key);
      context.fill();
    });

    context.restore();
  }

  function dragsubject() {
    return simulation.find(d3.event.x - width / 2, d3.event.y - height / 2, searchRadius);
  }

  function mousemoved() {
    var a = this.parentNode, m = d3.mouse(this), d = simulation.find(m[0] - width / 2, m[1] - height / 2, searchRadius);
    if (!d) return a.removeAttribute("href"), a.removeAttribute("title");
    a.setAttribute("href", "http://bl.ocks.org/" + (d.user ? d.user + "/" : "") + d.id);
    a.setAttribute("title", d.id + (d.user ? " by " + d.user : "") + (d.description ? "\n" + d.description : ""));
  }
});

function dragstarted() {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d3.event.subject.fx = d3.event.subject.x;
  d3.event.subject.fy = d3.event.subject.y;
}

function dragged() {
  d3.event.subject.fx = d3.event.x;
  d3.event.subject.fy = d3.event.y;
}

function dragended() {
  if (!d3.event.active) simulation.alphaTarget(0);
  d3.event.subject.fx = null;
  d3.event.subject.fy = null;
}

function drawLink(d) {
  context.moveTo(d.source.x, d.source.y);
  context.lineTo(d.target.x, d.target.y);
}

function drawNode(d) {
  context.moveTo(d.x + 3, d.y);
  context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
}