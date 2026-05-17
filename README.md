# RealRest SDK



Available for [Golang](go/) and [Go CLI](go-cli/) and [Lua](lua/) and [PHP](php/) and [Python](py/) and [Ruby](rb/) and [TypeScript](ts/).


## Entities

The API exposes one entity:

| Entity | Description | API path |
| --- | --- | --- |
| **Object** |  | `/objects` |

Each entity supports the following operations where available: **load**, **list**, **create**,
**update**, and **remove**.


## Architecture

### Entity-operation model

Every SDK call follows the same pipeline:

1. **Point** — resolve the API endpoint from the operation definition.
2. **Spec** — build the HTTP specification (URL, method, headers, body).
3. **Request** — send the HTTP request.
4. **Response** — receive and parse the response.
5. **Result** — extract the result data for the caller.

At each stage a feature hook fires (e.g. `PrePoint`, `PreSpec`,
`PreRequest`), allowing features to inspect or modify the pipeline.

### Features

Features are hook-based middleware that extend SDK behaviour.

| Feature | Purpose |
| --- | --- |
| **TestFeature** | In-memory mock transport for testing without a live server |

You can add custom features by passing them in the `extend` option at
construction time.

### Direct and Prepare

For endpoints not covered by the entity model, use the low-level methods:

- **`direct(fetchargs)`** — build and send an HTTP request in one step.
- **`prepare(fetchargs)`** — build the request without sending it.

Both accept a map with `path`, `method`, `params`, `query`, `headers`,
and `body`.


## Quick start

### Golang

```go
import sdk "github.com/voxgig-sdk/real-rest-sdk/go"

client := sdk.NewRealRestSDK(map[string]any{
    "apikey": os.Getenv("REAL-REST_APIKEY"),
})

// List all objects
objects, err := client.Object(nil).List(nil, nil)
```

### Lua

```lua
local sdk = require("real-rest_sdk")

local client = sdk.new({
  apikey = os.getenv("REAL-REST_APIKEY"),
})

-- List all objects
local objects, err = client:Object(nil):list(nil, nil)

-- Load a specific object
local object, err = client:Object(nil):load(
  { id = "example_id" }, nil
)
```

### PHP

```php
<?php
require_once 'realrest_sdk.php';

$client = new RealRestSDK([
    "apikey" => getenv("REAL-REST_APIKEY"),
]);

// List all objects
[$objects, $err] = $client->Object(null)->list(null, null);

// Load a specific object
[$object, $err] = $client->Object(null)->load(
    ["id" => "example_id"], null
);
```

### Python

```python
import os
from realrest_sdk import RealRestSDK

client = RealRestSDK({
    "apikey": os.environ.get("REAL-REST_APIKEY"),
})

# List all objects
objects, err = client.Object(None).list(None, None)

# Load a specific object
object, err = client.Object(None).load(
    {"id": "example_id"}, None
)
```

### Ruby

```ruby
require_relative "RealRest_sdk"

client = RealRestSDK.new({
  "apikey" => ENV["REAL-REST_APIKEY"],
})

# List all objects
objects, err = client.Object(nil).list(nil, nil)

# Load a specific object
object, err = client.Object(nil).load(
  { "id" => "example_id" }, nil
)
```

### TypeScript

```ts
import { RealRestSDK } from 'real-rest'

const client = new RealRestSDK({
  apikey: process.env.REAL-REST_APIKEY,
})

// List all objects
const objects = await client.Object().list()
```


## Testing

Both SDKs provide a test mode that replaces the HTTP transport with an
in-memory mock, so tests run without a network connection.

### Golang

```go
client := sdk.TestSDK(nil, nil)
result, err := client.Object(nil).Load(
    map[string]any{"id": "test01"}, nil,
)
```

### Lua

```lua
local client = sdk.test(nil, nil)
local result, err = client:Object(nil):load(
  { id = "test01" }, nil
)
```

### PHP

```php
$client = RealRestSDK::test(null, null);
[$result, $err] = $client->Object(null)->load(
    ["id" => "test01"], null
);
```

### Python

```python
client = RealRestSDK.test(None, None)
result, err = client.Object(None).load(
    {"id": "test01"}, None
)
```

### Ruby

```ruby
client = RealRestSDK.test(nil, nil)
result, err = client.Object(nil).load(
  { "id" => "test01" }, nil
)
```

### TypeScript

```ts
const client = RealRestSDK.test()
const result = await client.Object().load({ id: 'test01' })
// result.ok === true, result.data contains mock data
```


## How-to guides

### Make a direct API call

When the entity interface does not cover an endpoint, use `direct`:

**Go:**
```go
result, err := client.Direct(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "GET",
    "params": map[string]any{"id": "example"},
})
```

**Lua:**
```lua
local result, err = client:direct({
  path = "/api/resource/{id}",
  method = "GET",
  params = { id = "example" },
})
```

**PHP:**
```php
[$result, $err] = $client->direct([
    "path" => "/api/resource/{id}",
    "method" => "GET",
    "params" => ["id" => "example"],
]);
```

**Python:**
```python
result, err = client.direct({
    "path": "/api/resource/{id}",
    "method": "GET",
    "params": {"id": "example"},
})
```

**Ruby:**
```ruby
result, err = client.direct({
  "path" => "/api/resource/{id}",
  "method" => "GET",
  "params" => { "id" => "example" },
})
```

**TypeScript:**
```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example' },
})
console.log(result.data)
```


## Language-specific documentation

- [Golang SDK](go/README.md)
- [Go CLI SDK](go-cli/README.md)
- [Lua SDK](lua/README.md)
- [PHP SDK](php/README.md)
- [Python SDK](py/README.md)
- [Ruby SDK](rb/README.md)
- [TypeScript SDK](ts/README.md)

