// Data path (make sure your folder is /dataset/videogames_wide.csv)
const DATA_URL = "dataset/videogames_wide.csv";

// Common embed options
const EMBED_OPTS = { actions: false };

// Visualization 1
// Global Sales by Genre and Platform-Stacked Bar
const vis1 = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: { url: DATA_URL },

  // Stacked bar: Total Global Sales by Genre, colored by Platform
  mark: { type: "bar", tooltip: true },

  encoding: {
    y: { field: "Genre", type: "nominal", sort: "-x", title: "Genre" },
    x: {
      aggregate: "sum",
      field: "Global_Sales",
      type: "quantitative",
      title: "Total Global Sales (Millions)"
    },
    color: { field: "Platform", type: "nominal", title: "Platform" },
    tooltip: [
      { field: "Genre", type: "nominal" },
      { field: "Platform", type: "nominal" },
      { aggregate: "sum", field: "Global_Sales", type: "quantitative", title: "Total Global Sales" }
    ]
  }
};

document.getElementById("ref1").textContent =
  "Reflection: This view highlights which genres contribute most to total global sales and how platform contributions differ inside each genre. Look for dominant platforms (e.g., long-running consoles) and whether some genres rely heavily on a small set of platforms.";


// Visualization 2
// Sales Over Time by Platform-Line
const vis2={
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: {url:DATA_URL},
  transform:[
    {
      // remove data without year
      filter: "isValid(datum.Year) && datum.Year != null"
    },
    {
      // year -> change date
      calculate: "toDate(toString(datum.Year) + '-01-01')", as: "YearDate"
    },
    {
       //add total sale amount
       joinaggregate: [{ op: "sum", field: "Global_Sales", as: "PlatformTotal" }], groupby: ["Platform"]
    },
    {
      //platform lanking
      window: [{ op: "dense_rank", as: "rank" }], sort: [{ field: "PlatformTotal", order: "descending" }]
    },
    {
      // left top 8 platform
      filter:"datum.rank <= 8"
    },
  ],
  mark:{type:"line", tooltip:true},
  encoding: {
    x: { field: "YearDate", type: "temporal", title: "Year" },
    y:{
      aggregate: "sum",
      field: "Global_Sales",
      type: "quantitative",
      title: "Total Global Sales (Millions)"
    },
    color: { field: "Platform", type: "nominal", title: "Platform" },
    tooltip:[
      { timeUnit: "year", field: "YearDate", type: "temporal", title: "Year" },
      { field: "Platform", type: "nominal" },
      { aggregate: "sum", field: "Global_Sales", type: "quantitative", title: "Total Global Sales" }
    ]
  }
};

document.getElementById("ref2").textContent =
"Reflection: This line chart shows how major platforms’ global sales rise and fall across time. Peaks often reflect console-generation booms, while declines can suggest the transition to newer platforms or changing market dynamics.";
//Visualization 3
//Regional Sale VS Platform (Grouped / Stacked Bar)
const vis3={
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data:{url:DATA_URL},
  transform: [
    {
      fold: ["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"],
      as:["Region", "Sales"]
    }
  ],
  mark:{type:"bar", tooltip:true},

  encoding: {
    y: { field: "Platform", type: "nominal", sort: "-x", title: "Platform" },
    x: {
      aggregate:"sum",
      field:"Sales",
      type:"quantitative",
      title:"Total Sales (Millions)"
    },
    color:{field:"Region", type:"nominal", title:"Region"},
    tooltip:[
      {
        field:"Platform", type:"nominal"
      },
      {field: "Region", type:"nominal"},
      {aggregate:"sum", field:"Sales", type:"quantitative", title:"Total Sales"}
    ]
  }
};
document.getElementById("ref3").textContent = 
"Reflection: This comparison reveals regional preferences by platform (e.g., some consoles may be stronger in Japan while others dominate North America/Europe). Look for platforms where one region’s bar segment is disproportionately large.";

// Visualization 4
// Top 20 games by Total Global Sales-Bar
const vis4 = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: { url: DATA_URL },

  transform: [
    {
      aggregate: [{ op: "sum", field: "Global_Sales", as: "TotalSales" }],
      groupby: ["Name"]
    },
    { window: [{ op: "rank", as: "rank" }], sort: [{ field: "TotalSales", order: "descending" }] },
    { filter: "datum.rank <= 20" }
  ],

  mark: { type: "bar", tooltip: true },

  encoding: {
    y: { field: "Name", type: "nominal", sort: "-x", title: "Game (Top 20)" },
    x: { field: "TotalSales", type: "quantitative", title: "Total Global Sales (Millions)" },
    tooltip: [
      { field: "Name", type: "nominal" },
      { field: "TotalSales", type: "quantitative", title: "Total Global Sales" }
    ]
  }
};

document.getElementById("ref4").textContent =
  "Reflection: This chart tells a clear story about market concentration—only a small number of titles achieve extremely high sales. If the top bars are much larger than the rest, it supports a ‘winner-takes-most’ pattern in global game sales.";


// Embed all visualizations
vegaEmbed("#vis1", vis1, EMBED_OPTS);
vegaEmbed("#vis2", vis2, EMBED_OPTS);
vegaEmbed("#vis3", vis3, EMBED_OPTS);
vegaEmbed("#vis4", vis4, EMBED_OPTS);


