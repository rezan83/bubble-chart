const data = [
    { name: "news", parent: "" },
    { name: "tech", parent: "news" },
    { name: "sport", parent: "news" },
    { name: "music", parent: "news" },
    { name: "ai", parent: "tech", amount: 7 },
    { name: "coding", parent: "tech", amount: 5 },
    { name: "tablets", parent: "tech", amount: 4 },
    { name: "laptops", parent: "tech", amount: 6 },
    { name: "d3", parent: "tech", amount: 3 },
    { name: "gaming", parent: "tech", amount: 3 },
    { name: "football", parent: "sport", amount: 6 },
    { name: "hockey", parent: "sport", amount: 3 },
    { name: "baseball", parent: "sport", amount: 5 },
    { name: "tennis", parent: "sport", amount: 6 },
    { name: "f1", parent: "sport", amount: 1 },
    { name: "house", parent: "music", amount: 3 },
    { name: "rock", parent: "music", amount: 2 },
    { name: "punk", parent: "music", amount: 5 },
    { name: "jazz", parent: "music", amount: 2 },
    { name: "pop", parent: "music", amount: 3 },
    { name: "classical", parent: "music", amount: 5 },
];

const svg = d3
    .select(".canvas")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 800);

const tip = d3
    .select(".canvas")
    .append("div")
    .style("position", "absolute")
    .attr("width", "10vw")
    .attr("height", "3vw")
    .style("color", "cyan")
    .style("background-color", "transparent")
    .style("font-size", "6vw")
    .style("opacity", 0);

const graph = svg.append("g").attr("transform", "translate(50,50)");

const stratify = d3
    .stratify()
    .id((d) => d.name)
    .parentId((d) => d.parent);

const rootNode = stratify(data).sum((d) => d.amount);

const pack = d3.pack().size([960, 700]).padding(5);
const bubbleData = pack(rootNode).descendants();
const scheme = ["#a903fc", "#8000bf", "#3d005c"];
var bubbleColor = d3.scaleLinear().domain([0, 1, 2]).range(scheme);

const nodes = graph
    .selectAll("g")
    .data(bubbleData)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x},${d.y})`);

const circle = nodes
    .append("circle")
    .attr("r", (d) => d.r)
    .attr("stroke", "cyan")
    .attr("fill", (d) => bubbleColor(d.depth));

nodes
    .filter((node) => !node.children)
    .append("text")
    .text((d) => d.data.name)
    .attr("fill", "white")
    .attr("text-anchor", "middle")
    .attr("font-size", (d) => d.value * 2 + 15);

nodes
    .filter((node) => node.children)
    .on("mouseover", function (d, i, n) {
        var [x, y] = [d3.event.pageX, d3.event.pageY];
        let node = d3.select(this);

        node.attr("stroke-width", 5);

        tip.text(d.data.name)
            .style("top", y - 150 + "px")
            .style("left", x - 100 + "px")
            .style("opacity", 1);
    })
    .on("mouseleave", (d, i, n) => {
        let node = d3.select(n[i]);
        node.attr("stroke-width", 1);

        tip.style("opacity", 0).style("top", "0px").style("left", "0px");
    });
