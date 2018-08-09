function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json("/metadata/<sample>").then( data => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var md = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    md.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      md.append()
    })
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sample_values = [];
  var otu_ids = [];
  var otu_labels = [];

  d3.json("/samples/<sample>").then( (data) => {
    data.forEach( (d) => {
      console.log(d)
      sample_values.push(d.sample_values); 
      sample_values.push(d.otu_ids);
      sample_values.push(d.otu_labels);
    });
    
  // @TODO: Build a Bubble Chart using the sample data
  var bubble_trace = {
    x: otu_ids,
    y: sample_values,
    marker_size: sample_values,
    marker_colors: otu_ids,
    text: otu_labels
  }
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var trace1 = {
      labels: otu_ids,
      values: sample_values.slice(10),
      hoveryext: otu_labels,
      type: 'pie'
    };

    var data = [trace1];

    var layout = {
      title: "'Top 10 Samples",
    };

    Plotly.newPlot("plot", data, layout);

  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
