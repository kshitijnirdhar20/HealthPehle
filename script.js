document.addEventListener('DOMContentLoaded', function() {
  let isMetric = false;
  
  window.calculateBMI = function() {                           // Calculates BMI function
    const age = parseInt(document.getElementById("age").value);
    const weight = parseInt(document.getElementById("weight").value);
    let bmi;
    let healthyMin, healthyMax;
    
    if (isMetric) {
      const heightCm = parseInt(document.getElementById("cm").value);
      const heightM = heightCm / 100;
      bmi = weight / (heightM * heightM);
      
      // Calculate healthy weight range for metric
      healthyMin = (18.5 * heightM * heightM).toFixed(1);
      healthyMax = (25 * heightM * heightM).toFixed(1);
    } else {
      const feet = parseInt(document.getElementById("feet").value);
      const inches = parseInt(document.getElementById("inches").value);
      const heightInches = feet * 12 + inches;
      bmi = (weight / (heightInches * heightInches)) * 703;
      
      // Calculate healthy weight range for imperial
      healthyMin = ((18.5 * heightInches * heightInches) / 703).toFixed(1);
      healthyMax = ((25 * heightInches * heightInches) / 703).toFixed(1);
    }
    
    document.getElementById("bmiResult").textContent = bmi.toFixed(1);
    
    // Determine BMI category
    let category = "";
    let description = "";
    if (bmi < 18.5) {
      category = "Underweight";
      description = "Consider consulting with a healthcare provider about healthy weight gain strategies.";
    } else if (bmi < 25) {
      category = "Normal";
      description = "Your BMI falls within the healthy weight range.";
    } else if (bmi < 30) {
      category = "Overweight";
      description = "Consider moderate weight reduction for improved health outcomes.";
    } else {
      category = "Obese";
      description = "Weight reduction is recommended. Consider consulting with a healthcare provider.";
    }
    
    document.getElementById("bmiCategory").textContent = category;
    
    // Add or update description element
    let descriptionElement = document.getElementById("bmiDescription");
    if (!descriptionElement) {
      descriptionElement = document.createElement("p");
      descriptionElement.id = "bmiDescription";
      descriptionElement.className = "text-gray-400 mt-2";
      document.getElementById("bmiCategory").parentNode.appendChild(descriptionElement);
    }
    descriptionElement.textContent = description;
    
    // Update gauge using improved visualization
    updateGauge(bmi);
    
    // Update healthy weight range display
    const healthyWeightRangeDisplay = document.querySelectorAll(".space-y-4 .flex.items-center.justify-between")[1].querySelector(".font-semibold");
    if (isMetric) {
      healthyWeightRangeDisplay.textContent = `${healthyMin} - ${healthyMax} kg`;
    } else {
      healthyWeightRangeDisplay.textContent = `${healthyMin} - ${healthyMax} lbs`;
    }
    
    // Calculate BMI Prime (ratio of BMI to upper limit of normal BMI)
    const bmiPrime = (bmi / 25).toFixed(2);
    document.querySelectorAll(".space-y-4 .flex.items-center.justify-between")[2].querySelector(".font-semibold").textContent = bmiPrime;
    
    // Calculate Ponderal Index (kg/m³)
    let ponderalIndex;
    if (isMetric) {
      const heightM = parseInt(document.getElementById("cm").value) / 100;
      ponderalIndex = (weight / Math.pow(heightM, 3)).toFixed(1);
    } else {
      const feet = parseInt(document.getElementById("feet").value);
      const inches = parseInt(document.getElementById("inches").value);
      const heightInches = feet * 12 + inches;
      const heightM = heightInches * 0.0254;
      const weightKg = weight * 0.453592;
      ponderalIndex = (weightKg / Math.pow(heightM, 3)).toFixed(1);
    }
    document.querySelectorAll(".space-y-4 .flex.items-center.justify-between")[3].querySelector(".font-semibold").textContent = `${ponderalIndex} kg/m³`;
    
    // Add tooltip or info button for metrics explanation
    addMetricsExplanation();
  };
  
  // Function to add explanations for the different metrics
  const addMetricsExplanation = () => {
    const metricsInfo = {
      "Healthy BMI range": "Body Mass Index range associated with lower risk of health problems.",
      "Healthy weight range": "The weight range associated with a lower risk of weight-related health problems.",
      "BMI Prime": "A decimal number where 1.0 = the upper limit of normal BMI (25). Values less than 1.0 = underweight or normal, greater than 1.0 = overweight or obese.",
      "Ponderal Index": "A measure of leanness calculated as weight divided by height cubed."
    };
    
    // Find all metric title elements
    document.querySelectorAll(".space-y-4 .flex.items-center.justify-between").forEach((metricContainer) => {
      const metricTitleEl = metricContainer.querySelector(".text-gray-300");
      if (!metricTitleEl) return;
      
      const metricTitle = metricTitleEl.textContent.trim();
      if (metricsInfo[metricTitle]) {
        // Check if info icon already exists
        if (!metricContainer.querySelector(".info-icon")) {
          // Create info icon
          const infoIcon = document.createElement("span");
          infoIcon.className = "info-icon ml-1 text-gray-400 hover:text-primary cursor-pointer";
          infoIcon.innerHTML = "ⓘ";
          infoIcon.title = metricsInfo[metricTitle];
          
          // Add to metric title
          metricTitleEl.appendChild(infoIcon);
        }
      }
    });
  };
  
  // Improved gauge visualization function
  const updateGauge = (bmi) => {
    const gauge = document.querySelector(".gauge");
    const pointer = document.getElementById("pointer");
    
    // Define BMI ranges for gauge visualization
    const minBmi = 15;   // Start of gauge
    const maxBmi = 40;   // End of gauge
    const totalRange = maxBmi - minBmi;
    
    // Calculate normalized position (0-1) along the gauge
    let normalizedPosition = Math.min(Math.max((bmi - minBmi) / totalRange, 0), 1);
    
    // Calculate stroke dashoffset (120 is the total dash array length from the SVG)
    const dashOffset = 120 - (normalizedPosition * 120);
    gauge.style.strokeDashoffset = dashOffset;
    
    // Update pointer position using arc math
    const angle = Math.PI * normalizedPosition;
    const cx = 100; // Center x from the SVG viewBox
    const cy = 80;  // Center y from the SVG viewBox
    const r = 60;   // Radius of the arc
    
    // Calculate pointer position along the arc
    const pointerX = cx - r * Math.cos(angle);
    const pointerY = cy - r * Math.sin(angle);
    
    // Update pointer position
    pointer.setAttribute("cx", pointerX);
    pointer.setAttribute("cy", pointerY);
    
    // Apply color to the gauge based on BMI category
    let gaugeColor;
    if (bmi < 18.5) gaugeColor = "#3B82F6";       // Underweight - blue
    else if (bmi < 25) gaugeColor = "#10B981";    // Normal - green
    else if (bmi < 30) gaugeColor = "#F59E0B";    // Overweight - amber
    else gaugeColor = "#EF4444";                  // Obese - red
    
    gauge.style.stroke = gaugeColor;
    
    // Make pointer larger and match color
    pointer.setAttribute("r", "6");
    pointer.setAttribute("fill", gaugeColor);
    
    // Add shadow to pointer for better visibility
    pointer.setAttribute("filter", "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))");
    
    // Add numeric values to the gauge
    addGaugeLabels();
  };
  
  // Function to add numeric BMI values to the gauge
  const addGaugeLabels = () => {
    const svgElement = document.querySelector(".relative.h-40.mb-6 svg");
    
    // Only add labels if they don't already exist
    if (svgElement && !document.querySelector(".bmi-value-label")) {
      // BMI values to display
      const bmiValues = [
        {value: "18.5", x: 48, y: 83},
        {value: "25", x: 100, y: 83},
        {value: "30", x: 142, y: 83}
      ];
      
      // Add BMI values above category labels
      bmiValues.forEach(item => {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", item.x);
        text.setAttribute("y", item.y);
        text.setAttribute("font-size", "7");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "#6B7280");
        text.setAttribute("class", "bmi-value-label");
        text.textContent = item.value;
        svgElement.appendChild(text);
      });
    }
  };
  
  // Function to enhance SVG with visual improvements
  const enhanceSvgVisuals = () => {
    const svgElement = document.querySelector(".relative.h-40.mb-6 svg");
    
    // Only add enhancements if they don't already exist
    if (svgElement && !svgElement.querySelector("defs")) {
      // Create a gradient definition
      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
      gradient.setAttribute("id", "gaugeGradient");
      gradient.setAttribute("x1", "0%");
      gradient.setAttribute("y1", "0%");
      gradient.setAttribute("x2", "100%");
      gradient.setAttribute("y2", "0%");
      
      // Create gradient stops
      const stops = [
        {offset: "0%", color: "#3B82F6", opacity: "0.2"}, // Underweight
        {offset: "30%", color: "#10B981", opacity: "0.2"}, // Normal
        {offset: "60%", color: "#F59E0B", opacity: "0.2"}, // Overweight
        {offset: "100%", color: "#EF4444", opacity: "0.2"} // Obese
      ];
      
      stops.forEach(stop => {
        const stopElement = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stopElement.setAttribute("offset", stop.offset);
        stopElement.setAttribute("stop-color", stop.color);
        stopElement.setAttribute("stop-opacity", stop.opacity);
        gradient.appendChild(stopElement);
      });
      
      defs.appendChild(gradient);
      svgElement.prepend(defs);
      
      // Add a background rect with the gradient
      const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      background.setAttribute("width", "100%");
      background.setAttribute("height", "100%");
      background.setAttribute("fill", "url(#gaugeGradient)");
      background.setAttribute("rx", "10");
      svgElement.prepend(background);
      
      // Add category labels under the gauge
      const categories = [
        {text: "Underweight", x: 30, y: 95},
        {text: "Normal", x: 80, y: 95},
        {text: "Overweight", x: 130, y: 95},
        {text: "Obese", x: 170, y: 95}
      ];
      
      categories.forEach(category => {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", category.x);
        text.setAttribute("y", category.y);
        text.setAttribute("font-size", "8");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "#9CA3AF");
        text.textContent = category.text;
        svgElement.appendChild(text);
      });
    }
  };
  
  // Add event listener for calculate button
  document.getElementById("calculate").addEventListener("click", calculateBMI);
  
  // Reset all fields
  document.getElementById("clear").addEventListener("click", () => {
    document.getElementById("age").value = "25";
    document.getElementById("weight").value = isMetric ? "72" : "160";
    
    if (isMetric) {
      document.getElementById("cm").value = "178";
    } else {
      document.getElementById("feet").value = "5";
      document.getElementById("inches").value = "10";
    }
    
    // Reset gender selection
    document.querySelector('input[name="gender"][value="male"]').checked = true;
    
    // Reset radio button visual styles
    document.querySelectorAll('input[name="gender"] + span').forEach(span => {
      span.style.backgroundColor = "";
    });
    if (document.querySelector('input[name="gender"][value="male"]').nextElementSibling) {
      document.querySelector('input[name="gender"][value="male"]').nextElementSibling.style.backgroundColor = "#15B8A6";
    }
    
    // Reset result display
    document.getElementById("bmiResult").textContent = "23";
    document.getElementById("bmiCategory").textContent = "Normal";
    
    // Reset description element
    if (document.getElementById("bmiDescription")) {
      document.getElementById("bmiDescription").textContent = "Your BMI falls within the healthy weight range.";
    }
    
    // Reset gauge
    updateGauge(23);
  });
  
  // Unit toggle event listeners
  ["usUnits", "metricUnits", "otherUnits"].forEach((id) => {
    document.getElementById(id).addEventListener("click", function() {
      // Reset button styles
      document.querySelectorAll("#usUnits, #metricUnits, #otherUnits").forEach((btn) => {
        btn.classList.remove("bg-primary");
        btn.classList.add("bg-gray-700");
      });
      
      // Highlight selected button
      this.classList.remove("bg-gray-700");
      this.classList.add("bg-primary");
      
      if (id === "metricUnits") {
        isMetric = true;
        document.getElementById("imperialHeight").classList.add("hidden");
        document.getElementById("metricHeight").classList.remove("hidden");
        document.getElementById("weightUnit").textContent = "kg";
        
        // Convert values from imperial to metric
        const feet = parseInt(document.getElementById("feet").value) || 0;
        const inches = parseInt(document.getElementById("inches").value) || 0;
        const totalInches = feet * 12 + inches;
        const cm = Math.round(totalInches * 2.54);
        document.getElementById("cm").value = cm;
        
        const pounds = parseInt(document.getElementById("weight").value) || 0;
        const kg = Math.round(pounds * 0.453592);
        document.getElementById("weight").value = kg;
      } else if (id === "usUnits") {
        isMetric = false;
        document.getElementById("imperialHeight").classList.remove("hidden");
        document.getElementById("metricHeight").classList.add("hidden");
        document.getElementById("weightUnit").textContent = "pounds";
        
        // Convert values from metric to imperial
        const cm = parseInt(document.getElementById("cm").value) || 0;
        const totalInches = Math.round(cm / 2.54);
        const feet = Math.floor(totalInches / 12);
        const inches = totalInches % 12;
        document.getElementById("feet").value = feet;
        document.getElementById("inches").value = inches;
        
        const kg = parseInt(document.getElementById("weight").value) || 0;
        const pounds = Math.round(kg / 0.453592);
        document.getElementById("weight").value = pounds;
      } else if (id === "otherUnits") {
        // Custom unit system implementation
        alert("Other units system is not implemented yet");
        // Reset to previous selection
        if (isMetric) {
          document.getElementById("metricUnits").click();
        } else {
          document.getElementById("usUnits").click();
        }
      }
      
      // Recalculate BMI after unit change
      calculateBMI();
    });
  });
  
  // Add event listeners for radio buttons (gender)
  document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener('change', function() {
      // Reset all radio button visuals
      document.querySelectorAll('input[name="gender"] + span').forEach(span => {
        span.style.backgroundColor = "";
      });
      
      // Highlight the selected one
      if (this.checked && this.nextElementSibling) {
        this.nextElementSibling.style.backgroundColor = "#15B8A6";
      }
      
      // Recalculate BMI on gender change
      calculateBMI();
    });
  });
  
  // Highlight the selected gender initially
  document.querySelectorAll('input[name="gender"]').forEach(radio => {
    if (radio.checked && radio.nextElementSibling) {
      radio.nextElementSibling.style.backgroundColor = "#15B8A6";
    }
  });
  
  // Apply visual enhancements to SVG
  enhanceSvgVisuals();
  
  // Add responsive behavior
  window.addEventListener('resize', function() {
    // Recalculate gauge on window resize for responsive display
    calculateBMI();
  });
  
  // Initial calculation on page load
  calculateBMI();
});