import { ValidationErrors } from "@angular/forms";

export const getValidatorErrorMessage = (validatorName: string, validatorErrors: ValidationErrors): string|undefined => {

    let validatorArgs = errorMessages.get(validatorName)?.validatorErrorsKey?.map(name => {
        validatorErrors?.[name]
    });
    console.log('[getValidatorErrorMessage] check', validatorName)

    return (validatorArgs) ?
        stringFormat(errorMessages.get(validatorName)?.message, ...validatorArgs) :
        errorMessages.get(validatorName)?.message;
}

// <string, {message: string, validatorErrorsKey: string[]}>
const errorMessages = new Map([
    ['required', { message: 'This field is required' } ],
    ['minlength', {
        message: 'This text must be at least 4 characters long.',
        validatorErrorsKey: ['passwordCustomValidator']
    } ],
    ['requiredPassword', {
        message: 'Password must be a combination of lower-case, upper-case, numbers and at least eight characters long.',
        validatorErrorsKey: ['passwordCustomValidator']
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
