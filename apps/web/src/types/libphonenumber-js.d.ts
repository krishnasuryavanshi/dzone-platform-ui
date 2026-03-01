// TODO: Install libphonenumber-js package and remove this declaration
declare module 'libphonenumber-js' {
  interface PhoneNumber {
    isValid(): boolean;
    country?: string;
    number: string;
  }

  export function parsePhoneNumberFromString(
    text: string,
    defaultCountry?: string,
  ): PhoneNumber | undefined;

  export function isValidPhoneNumber(
    text: string,
    defaultCountry?: string,
  ): boolean;
}
