# Validate Generator

Generating the form for each entity or plugin according to fetched schema. Supported features:

1. Generate form items for validate rules
2. Validate form online before submit form to backend
3. Create entity or plugin implementation

## Generate form items dynamically for validate rules

### Support type of schema:

- entity
  - [services](https://docs.konghq.com/gateway/2.8.x/admin-api/#service-object)
  - [routes](https://docs.konghq.com/gateway/2.8.x/admin-api/#route-object)
  - [consumers](https://docs.konghq.com/gateway/2.8.x/admin-api/#consumer-object)
- plugin
  - [jwt](https://docs.konghq.com/hub/kong-inc/jwt/)
  - [session](https://docs.konghq.com/hub/kong-inc/session/)

### Support type of schema rule:

- Boolean type
- Foreign type
- Set type
- Array type
- Integer/Number type
- String type

### Support validate schema rule:

- required: It's a required field
- one_of: Choose the option from provided elements
- len_min: The minimum of length
- between: The minimum and maximum of number range
- match_all: The elements of field must match all regex
- match_any: The elements of field must match at least one regex
- starts_with: The content should start with the certain prefix
- match_none: The elements of field may not follow any of regex
- uuid: The format of content should follow the format of UUID

### Generate extra help info for each rule in form field

## Validate form online before submit form to backend

Users can send the content of form to backend validation services before requesting the actual creating api. If the validation fails, website will show the accurate error message and prevent the continus submit process

## Create entity or plugin in server-side service

Create corresponding entity or plugin you make in real backend api
