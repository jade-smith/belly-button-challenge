// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const selectedMetadata = metadata.find(obj => obj.id === parseInt(sample));

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(selectedMetadata).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const selectedSample = samples.find(obj => obj.id === sample);

    // Get the otu_ids, otu_labels, and sample_values
    const otuIds = selectedSample.otu_ids;
    const otuLabels = selectedSample.otu_labels;
    const sampleValues = selectedSample.sample_values;

    // Build a Bubble Chart
    const traceBubble = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth'
      }
    };

    const dataBubble = [traceBubble];

    const layoutBubble = {
      title: 'OTU Bubble Chart',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' }
    };

    Plotly.newPlot('bubble', dataBubble, layoutBubble);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yTicks = otuIds.map(id => `OTU ${id}`);

    // Build a Bar Chart
    const traceBar = {
      x: sampleValues.slice(0, 10).reverse(),
      y: yTicks.slice(0, 10).reverse(),
      text: otuLabels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    };

    const dataBar = [traceBar];

    const layoutBar = {
      title: 'Top 10 OTUs Bar Chart',
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU ID' }
    };

    Plotly.newPlot('bar', dataBar, layoutBar);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(sample => {
      dropdown.append("option")
        .text(sample)
        .property("value", sample);
    });

    // Get the first sample from the list
    const firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

