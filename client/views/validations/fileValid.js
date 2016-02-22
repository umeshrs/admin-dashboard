$.validator.addMethod("fileValid", function (value, element) {
  let file = (element.type === "file") && (element.files.length > 0) && element.files[0];
  let valid = file && file.type === "text/csv";
  return valid ? true : false;
}, "Invalid file type. Only CSV file is accepted.");
