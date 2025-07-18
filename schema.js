const schema = {
  title: "User Registration",
  fields: [
    { type: "text", label: "Name", name: "name", required: true },
    { type: "email", label: "Email", name: "email", required: true },
    { type: "number", label: "Age", name: "age", min: 18, max: 60, required: true },
    {
      type: "select",
      label: "Country",
      name: "country",
      options: ["India", "USA", "Canada"],
      required: true
    },
    {
      type: "multiselect",
      label: "Skills",
      name: "skills",
      options: ["JavaScript", "Python", "C++", "Java"],
      required: true
    },
    {
      type: "typeahead",
      label: "Favorite Fruit",
      name: "fruit",
      suggestions: ["Apple", "Banana", "Mango", "Orange"],
      required: true
    },
    {
      type: "file",
      label: "Profile Picture",
      name: "profile",
      endpoint: "https://httpbin.org/post",
      method: "POST",
      headers: {
        "X-Custom-Header": "UploadTest"
      },
      required: true
    },
    {
      type: "card",
      label: "Address",
      name: "address",
      fields: [
        { type: "text", label: "Street", name: "street", required: true },
        { type: "text", label: "City", name: "city", required: true },
        { type: "text", label: "Zip Code", name: "zip", required: true }
      ]
    }
  ]
};