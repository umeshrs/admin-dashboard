$.validator.addMethod("fileValid", function (value, element) {
  let file = (element.type === "file") && (element.files.length > 0) && element.files[0];
  // "application/vnd.ms-excel" is the file type of a CSV file when it is uploaded from a Windows system
  let valid = file && (file.type === "text/csv" || file.type === "application/vnd.ms-excel");
  return valid ? true : false;
}, "Invalid file type. Only CSV file is accepted.");
