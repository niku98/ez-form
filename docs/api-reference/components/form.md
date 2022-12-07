---
title: EzForm Component API
---

# EzForm Component API

## Props

| Name             | Description                                  | Type                                                                                   |
| :--------------- | :------------------------------------------- | :------------------------------------------------------------------------------------- |
| name             | Form's name                                  | `string`                                                                               |
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

## Scoped slot - Default

| Name          | Description                                | Type                                                                      |
| :------------ | :----------------------------------------- | :------------------------------------------------------------------------ |
| values        | Form's values                              | `any`                                                                     |
| errors        | Form's errors                              | [`ValidateError[]`](/api-reference/types/validation.html#general)         |
| dirty         | Determine if form is dirty                 | `boolean`                                                                 |
| submit        | Function to submit form                    | [`FormInstance['submit']`](/api-reference/types/form#forminstance)        |
| reset         | Function to reset form's data and state    | [`FormInstance['reset']`](/api-reference/types/form#forminstance)         |
| validate      | Function to reset validate form's data     | [`FormInstance['validate']`](/api-reference/types/form#forminstance)      |
| getFieldValue | Function to get form's field data          | [`FormInstance['getFieldValue']`](/api-reference/types/form#forminstance) |
| setFieldValue | Function to set form's field data          | [`FormInstance['setFieldValue']`](/api-reference/types/form#forminstance) |
| isDirty       | Function to check if form's field is dirty | [`FormInstance['isDirty']`](/api-reference/types/form#forminstance)       |
