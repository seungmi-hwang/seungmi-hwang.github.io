const growthChart = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: 700,
  height: 400,
  data: {
    url: "data/time_series.csv"
  },
  transform: [
    {
      fold: ["ChatGPT", "Gemini", "Claude"],
      as: ["Platform", "Interest"]
    }
  ],
  mark: {
    type: "line",
    point: true
  },
  encoding: {
    x: {
  field: "Time",
  type: "temporal",
  title: "Year",
  axis: {
    format: "%Y",
    values: [
      "2021-01-01",
      "2022-01-01",
      "2023-01-01",
      "2024-01-01",
      "2025-01-01",
      "2026-01-01"
    ]
  }
},
    y: {
      field: "Interest",
      type: "quantitative",
      title: "Search Interest"
    },
    color: {
      field: "Platform",
      type: "nominal",
      title: "Platform"
    },
    tooltip: [
      { field: "Time", type: "temporal", title: "Date" },
      { field: "Platform", type: "nominal", title: "Platform" },
      { field: "Interest", type: "quantitative", title: "Interest" }
    ]
  }
};

vegaEmbed("#vis1", growthChart, { actions: false })
  .catch(console.error);


  const regionalChart = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: 700,
  height: 400,
  data: {
    url: "data/regional_comparison.csv"
  },
  transform: [
    {
      fold: ["ChatGPT", "Gemini", "Claude"],
      as: ["Platform", "Interest"]
    }
  ],
  mark: "bar",
  encoding: {
    x: {
  field: "Country",
  type: "nominal",
  title: "Country",
  axis: {
    labelAngle: 0
  }
},
    xOffset: {
      field: "Platform"
    },
    y: {
      field: "Interest",
      type: "quantitative",
      title: "Search Interest"
    },
    color: {
      field: "Platform",
      type: "nominal",
      title: "Platform"
    },
    tooltip: [
      { field: "Country", type: "nominal", title: "Country" },
      { field: "Platform", type: "nominal", title: "Platform" },
      { field: "Interest", type: "quantitative", title: "Interest" }
    ]
  }
};

vegaEmbed("#vis2", regionalChart, { actions: false })
  .catch(console.error);