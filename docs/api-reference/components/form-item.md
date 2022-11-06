---
title: FormItem
---

# FormItem

## Props

| Name                    | Description                                                                         | Type                                                                                       |
| :---------------------- | :---------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| name                    | Form item's name path to sync data                                                  | [`NamePath`](/api-reference/types/form-item.html#namepath)                                 |
| label                   | Form item's label                                                                   | `string`                                                                                   |
| defaultValue            | Form item's default value                                                           | `any`                                                                                      |
| valuePropName           | Input's value prop name to pass data to                                             | `string`                                                                                   |
| changeEventPropName     | Input's change event prop name to listen to                                         | `string`                                                                                   |
| blurEventPropName       | Input's blur event prop name to listen to                                           | `string`                                                                                   |
| getValueFromChangeEvent | Function to get data from change event                                              | `(event:any) => any`                                                                       |
| valueTransformer        | Function to transform data received from form's data to pass to input and backwards | [`FormItemValueTransformer`](/api-reference/types/form-item.html#formitemvaluetransformer) |
| autoBinding             | Auto binding value and event to input                                               | `boolean`                                                                                  |
| inputNodeIndex          | Index of input in node list to binding data to. **Default: 0**                      | `number`                                                                                   |
| requiredMark            | Show form item's required mark                                                      | `boolean \| string`                                                                        |
| rules                   | Validation rules                                                                    | `Rule`                                                                                     |
| validateTrigger         | Config field validate trigger                                                       | [`ValidateTrigger`](/api-reference/types/validation.html#general)                          |
| validateFirst           | Validate first rule of form item only                                               | [`ValidateTrigger`](/api-reference/types/validation.html#general)                          |
| noStyle                 | Hide label and error                                                                | `boolean`                                                                                  |
| colon                   | Show label colon                                                                    | `boolean`                                                                                  |

## Events

| Name     | Description                          | Type                    |
| :------- | :----------------------------------- | :---------------------- |
| onChange | Trigger after form item data changed | `(values: any) => void` |
