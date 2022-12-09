function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples1.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples1.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  // 1. Create the buildCharts function.
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples1.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
    console.log(data)
    var samples = data["samples"] 
    console.log(samples)
      // 4. Create a variable that filters the samples for the object with the desired sample number.
  var newsample = samples.filter(firstarray => firstarray["id"] == sample)
  console.log(newsample)
      //  5. Create a variable that holds the first sample in the array.
  var result = newsample[0]
  
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otu_Ids = result.otu_ids;
      console.log(otu_Ids);
      var otu_Labels = result.otu_labels;
      console.log(otu_Labels);
      var sample_Values = result.sample_values;
      console.log(sample_Values);
      
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
  
      var yticks = otu_Ids.slice(0,10).map(id => "OTUs " + id).reverse();
    console.log(yticks);
  
      // 8. Create the trace for the bar chart. 
    var barTrace = [{
      x: sample_Values.slice(0,10).reverse(),
      text: otu_Labels.slice(0,10).reverse(),
      type: "bar"
    }];
        
      //];
      // 9. Create the layout for the bar chart. 
        var barLayout = {
          title: "Top 10 Bacteria Cultures",
          yaxis: {
            tickmode: "array",
            tickvals: [0,1,2,3,4,5,6,7,8,9],
            ticktext: yticks
          },
          annotations: [{
            xref: 'paper',
            yref: 'paper',
            x: 0.5,
            xanchor: 'center',
            y: -0.25,
            yanchor: 'center',
            text: 'Top 10 Bacterial Species',
            showarrow: false
          }]
        };
      //};
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barTrace, barLayout, {responsive: true});

      //Deliverable 2
      // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_Ids,
      y: sample_Values,
      text: otu_Labels,
      mode: 'markers',
      marker: {
        size: sample_Values,
        color: otu_Ids,
        colorscale: "Earth"
      }
    }];
    console.log(bubbleData);
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Test Subject',
      showlegend: false,
      xaxis: {title: "otu IDs", automargin: true},
      yaxis: {automargin: true},
      //margin: { t: 50, r: 50, l: 50, b: 50 },
      hovermode: "closest"
    };
    console.log(bubbleLayout);

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive: true});

    //Deliverable 3
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata_SelId = data.metadata.filter(data => data.id == sample);
    console.log(metadata_SelId);  

    // 3. Create a variable that holds the washing frequency.
    var washFreq = +metadata_SelId[0].wfreq;
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: { text: "<b> Belly button Wash Frequency </b> <br>Weekly Scrubs</br>"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {
            range: [null, 10],
            tickmode: "array",
            tickvals: [0,2,4,6,8,10],
            ticktext: [0,2,4,6,8,10]
          },
          bar: {color: "black"},
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lime" },
            { range: [8, 10], color: "green" }]
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      autosize: true,
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        xanchor: 'center',
        y: 0,
        yanchor: 'center',
        text: "Weekly washing frequency",
        showarrow: false
      }]
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});
  });
}
