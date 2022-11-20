---
title: FormList
---

# FormList

## Props

| Name                    | Description                                                                         | Type                                                                                       |
| :---------------------- | :---------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| name                    | Form list's name path to sync data                                                  | [`NamePath`](/api-reference/types/form-list.html#namepath)                                 |
| label                   | Form list's label                                                                   | `string`                                                                                   |
| defaultValue            | Form list's default value                                                           | `any[]`                                                                                    |
| valuePropName           | Input's value prop name to pass data to                                             | `string`                                                                                   |
| changeEventPropName     | Input's change event prop name to listen to                                         | `string`                                                                                   |
| blurEventPropName       | Input's blur event prop name to listen to                                           | `string`                                                                                   |
| getValueFromChangeEvent | Function to get data from change event                                              | `(event:any) => any`                                                                       |
| valueTransformer        | Function to transform data received from form's data to pass to input and backwards | [`FormItemValueTransformer`](/api-reference/types/form-item.html#formitemvaluetransformer) |
| autoBinding             | Auto binding value and event to input                                               | `boolean`                                                                                  |
| inputNodeIndex          | Index of input in node list to binding data to. **Default: 0**                      | `number`                                                                                   |
| requiredMark            | Show form list's required mark                                                      | `boolean \| string`                                                                        |
| rules                   | Validation rules                                                                    | `Rule`                                                                                     |
| validateTrigger         | Config field validate trigger                                                       | [`ValidateTrigger`](/api-reference/types/validation.html#general)                          |
| validateFirst           | Validate first rule of form list only                                               | [`ValidateTrigger`](/api-reference/types/validation.html#general)                          |
| noStyle                 | Hide label and error                                                                | `boolean`                                                                                  |
| colon                   | Show label colon                                                                    | `boolean`                                                                                  |

## Events

| Name     | Description                          | Type                    |
| :------- | :----------------------------------- | :---------------------- |
| onChange | Trigger after form list data changed | `(values: any) => void` |

## Scoped slot - Default

| Name        | Description                                              | Type                                                          |
| :---------- | :------------------------------------------------------- | :------------------------------------------------------------ |
| value       | Value of form list                                       | `Array<any>`                                                  |
| length      | Length of form list's value                              | `number`                                                      |
| namePaths   | List generated name path to pass to form item            | `Array<string\|number>`                                       |
| getNamePath | Function to generate name path of form item in form list | `(index: number, namePath: string) => Array<string\|number>`  |
| errors      | List error of form list                                  | `Array`                                                       |
| getErrors   | Function to get list array of form list's item           | `(index: number) => Array`                                    |
| hasError    | Function to check if form item has error if              | `(index: number) => boolean`                                  |
| add         | Function to add item to form list                        | `(value?: any) => void`                                       |
| remove      | Function to remove item from form list by index          | `(index: number) => void`                                     |
| removeByKey | Function to remove item from list by custom key          | `(key: string, value: any) => void`                           |
| swap        | Function to swap two item by index                       | `(firstIndex: number, secondIndex: number) => void`           |
| replace     | Function to replace an item of list with other value     | `(index: number, value: any) => void`                         |
| move        | Function to move an item of list to other index          | `(fromIndex: number, toIndex: number) => void`                |
| form        | Form's utility functions and data                        | [`FormInstance`](/api-reference/types/form.html#forminstance) |
