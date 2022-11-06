---
title: Form
---

# Form

## Props

| Name             | Description                                  | Type                                                                                   |
| :--------------- | :------------------------------------------- | :------------------------------------------------------------------------------------- |
| form             | A FormInstance to control form from outside  | [`FormInstance`](/api-reference/types/form.html#forminstance)                          |
| initialValues    | Initial values for form data                 | `Record<string, any>`                                                                  |
| rules            | Validation rules                             | `Rules`                                                                                |
| validateTrigger  | Config field validate trigger                | [`ValidateTrigger \| ValidateTrigger[]`](/api-reference/types/validation.html#general) |
| validateMessages | Custom validation messages                   | [`ValidateMessages`](/api-reference/types/validation.html#validatemessages)            |
| classPrefix      | Custom class prefix to generate form's class | `string`                                                                               |
| preserveValues   | Keep field value even when field removed     | `boolean`                                                                              |

## Events

| Name     | Description                                                        | Type                                |
| :------- | :----------------------------------------------------------------- | :---------------------------------- |
| onSubmit | Trigger after submitting the form and validating data successfully | `(values: any) => void`             |
| onError  | Trigger after submitting the form and validating data failed       | `(errors: ValidateError[]) => void` |
| onChange | Trigger when value updated                                         | `(values: any) => void`             |
