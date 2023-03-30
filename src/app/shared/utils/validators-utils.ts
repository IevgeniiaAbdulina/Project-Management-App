import { ValidationErrors } from "@angular/forms";

export const getValidatorErrorMessage = (validatorName: string, validatorErrors: ValidationErrors): string|undefined => {
    let validatorArgs = errorMessages.get(validatorName)?.validatorErrorsKey?.map(name => {
        validatorErrors?.[name];
    });

    return (validatorArgs) ?
        stringFormat(errorMessages.get(validatorName)?.message, ...validatorArgs) :
        errorMessages.get(validatorName)?.message;
}

// Map<string, {message: string, validatorErrorsKey: string[]}>()
const errorMessages = new Map([
    ['required', { message: 'This field is required' } ],
    ['minlength', { message: 'This text must be at least 4 characters long.' } ],
    ['pattern', {
        message: 'Password must contain at least one number, one uppercase and a lowercase letter and at least 8 characters',
        validatorErrorsKey :['requiredPattern']
    } ],
]);

function stringFormat(template: string|undefined, ...validatorArgs: any[]) {
    if(template){
        return template.replace(/{(\d+)}/g, (match, index) => {
        return typeof validatorArgs[index] !== 'undefined'
            ? validatorArgs[index]
            : match;
        });
    }
    return undefined;
 }

 // TODO: custom validator
// export function passwordCustomValidator(control: AbstractControl): ValidationErrors | null {
//   let enteredPassword = control.value;
//   let passwordPattern =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
//   return (!passwordPattern.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
// }
