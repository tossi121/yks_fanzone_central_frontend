const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const NAME_REGEX = /^[a-zA-Z ]+$/;

export function validName(name) {
  return NAME_REGEX.test(name);
}

export function validEmail(email) {
  return EMAIL_REGEX.test(email.trim());
}
