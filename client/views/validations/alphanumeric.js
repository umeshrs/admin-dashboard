$.validator.addMethod("alphanumeric", function (value, element) {
  return this.optional(element) || /^[a-zA-Z0-9.]+$/i.test(value);
}, "Letters, numbers, and dot only please");
