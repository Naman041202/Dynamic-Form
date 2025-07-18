function createElementFromField(field, parentName = "") {
  const group = document.createElement("div");
  group.className = "form-group";
  const label = document.createElement("label");
  label.textContent = field.label;
  label.htmlFor = field.name;
  
  // Add required-field class to label if field is required
  if (field.required) {
    label.classList.add('required-field');
  }
  
  group.appendChild(label);

  const name = parentName ? `${parentName}.${field.name}` : field.name;

  let input;
  if (field.type === "select") {
    input = document.createElement("select");
    input.name = name;
    field.options.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.text = opt;
      input.appendChild(option);
    });
  } else if (field.type === "multiselect") {
    input = document.createElement("select");
    input.name = name;
    input.multiple = true;
    field.options.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.text = opt;
      input.appendChild(option);
    });
  } else if (field.type === "typeahead") {
    input = document.createElement("input");
    input.name = name;
    input.setAttribute("list", `${name}-list`);
    const datalist = document.createElement("datalist");
    datalist.id = `${name}-list`;
    field.suggestions.forEach(s => {
      const option = document.createElement("option");
      option.value = s;
      datalist.appendChild(option);
    });
    group.appendChild(datalist);
  } else if (field.type === "file") {
    input = document.createElement("input");
    input.type = "file";
    input.name = name;
    input.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(field.endpoint, {
          method: field.method || "POST",
          headers: field.headers || {},
          body: formData
        });
        console.log("Uploaded:", await res.json());
      }
    });
  } else if (field.type === "card") {
    const card = document.createElement("div");
    card.className = "card";
    field.fields.forEach(subField =>
      card.appendChild(createElementFromField(subField, name))
    );
    group.appendChild(card);
    return group;
  } else {
    input = document.createElement("input");
    input.type = field.type;
    input.name = name;
    if (field.min) input.min = field.min;
    if (field.max) input.max = field.max;
  }

  if (field.required) input.required = true;
  group.appendChild(input);
  return group;
}

function generateForm(schema) {
  const form = document.getElementById("dynamicForm");
  schema.fields.forEach(field => {
    form.appendChild(createElementFromField(field));
  });
}

function extractFormData(form) {
  const data = {};
  new FormData(form).forEach((value, key) => {
    const keys = key.split(".");
    let ref = data;
    keys.forEach((k, i) => {
      if (i === keys.length - 1) {
        if (ref[k]) {
          if (Array.isArray(ref[k])) ref[k].push(value);
          else ref[k] = [ref[k], value];
        } else {
          ref[k] = value;
        }
      } else {
        ref[k] = ref[k] || {};
        ref = ref[k];
      }
    });
  });
  return data;
}

document.addEventListener("DOMContentLoaded", () => {
  generateForm(schema);
  document.getElementById("submitBtn").addEventListener("click", () => {
    const form = document.getElementById("dynamicForm");
    
    // Add HTML5 validation trigger
    const allInputs = form.querySelectorAll('input, select');
    let isValid = true;
    
    // Check each input manually
    allInputs.forEach(input => {
      if (input.required && !input.value) {
        input.classList.add('invalid');
        isValid = false;
      } else {
        input.classList.remove('invalid');
      }
      
      // Special handling for multiselect
      if (input.multiple && input.required) {
        if (input.selectedOptions.length === 0) {
          input.classList.add('invalid');
          isValid = false;
        }
      }
    });
    
    if (!isValid) {
      alert("Please fill all required fields.");
      return;
    }
    
    const data = extractFormData(form);
    document.getElementById("output").textContent = JSON.stringify(data, null, 2);
  });
});