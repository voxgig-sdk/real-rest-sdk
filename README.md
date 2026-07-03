# RealRest SDK

Real REST API client, generated from the OpenAPI spec.

> TypeScript, Python, PHP, Golang, Ruby, Lua SDKs, a CLI, an interactive REPL, and an MCP server for AI agents — all generated from one OpenAPI spec by [@voxgig/sdkgen](https://github.com/voxgig/sdkgen).

## Try it

**TypeScript**
```bash
npm install real-rest
```

**Python**
```bash
pip install real-rest-sdk
```

**PHP**
```bash
composer require voxgig/real-rest-sdk
```

**Golang**
```bash
go get github.com/voxgig-sdk/real-rest-sdk/go
```

**Ruby**
```bash
gem install real-rest-sdk
```

**Lua**
```bash
luarocks install real-rest-sdk
```

## Quickstart

### TypeScript

```ts
import { RealRestSDK } from 'real-rest'

const client = new RealRestSDK({
  apikey: process.env.REAL-REST_APIKEY,
})

// List all objects
const objects = await client.Object().list()
console.log(objects.data)
```

See the [TypeScript README](ts/README.md) for the full guide.

## Surfaces

| Surface | Path |
| --- | --- |
| **SDK** (TypeScript, Python, PHP, Golang, Ruby, Lua) | `ts/` `py/` `php/` `go/` `rb/` `lua/` |
| **CLI** | `go-cli/` |
| **MCP server** | `go-mcp/` |

## Use it from an AI agent (MCP)

The generated MCP server exposes every operation in this SDK as an
[MCP](https://modelcontextprotocol.io) tool that Claude, Cursor or Cline
can call directly. Build and register it:

```bash
cd go-mcp && go build -o real-rest-mcp .
```

Then add it to your agent's MCP config (Claude Desktop, Cursor, etc.):

```json
{
  "mcpServers": {
    "real-rest": {
      "command": "/abs/path/to/real-rest-mcp"
    }
  }
}
```

## Entities

The API exposes one entity:

| Entity | Description | API path |
| --- | --- | --- |
| **Object** |  | `/objects` |

Each entity supports the following operations where available: **load**,
**list**, **create**, **update**, and **remove**.

## Quickstart in other languages

### Python

```python
import os
from realrest_sdk import RealRestSDK

client = RealRestSDK({
    "apikey": os.environ.get("REAL-REST_APIKEY"),
})

# List all objects
objects, err = client.Object().list()
print(objects)

# Load a specific object
object, err = client.Object().load({"id": "example_id"})
print(object)
```

### PHP

```php
<?php
require_once 'realrest_sdk.php';

$client = new RealRestSDK([
    "apikey" => getenv("REAL-REST_APIKEY"),
]);

// List all objects
[$objects, $err] = $client->Object()->list();
print_r($objects);

// Load a specific object
[$object, $err] = $client->Object()->load(["id" => "example_id"]);
print_r($object);
```

### Golang

```go
import sdk "github.com/voxgig-sdk/real-rest-sdk/go"

client := sdk.NewRealRestSDK(map[string]any{
    "apikey": os.Getenv("REAL-REST_APIKEY"),
})

// List all objects
objects, err := client.Object(nil).List(nil, nil)
fmt.Println(objects)
```

### Ruby

```ruby
require_relative "RealRest_sdk"

client = RealRestSDK.new({
  "apikey" => ENV["REAL-REST_APIKEY"],
})

# List all objects
objects, err = client.Object().list
puts objects

# Load a specific object
object, err = client.Object().load({ "id" => "example_id" })
puts object
```

### Lua

```lua
local sdk = require("real-rest_sdk")

local client = sdk.new({
  apikey = os.getenv("REAL-REST_APIKEY"),
})

-- List all objects
local objects, err = client:Object():list()
print(objects)

-- Load a specific object
local object, err = client:Object():load({ id = "example_id" })
print(object)
```

## Unit testing in offline mode

Every SDK ships a test mode that swaps the HTTP transport for an
in-memory mock, so unit tests run offline.

### TypeScript

```ts
const client = RealRestSDK.test()
const result = await client.Object().load({ id: 'test01' })
// result.ok === true, result.data contains mock data
```

### Python

```python
client = RealRestSDK.test()
result, err = client.Object().load({"id": "test01"})
```

### PHP

```php
$client = RealRestSDK::test();
[$result, $err] = $client->Object()->load(["id" => "test01"]);
```

### Golang

```go
client := sdk.Test()
result, err := client.Object(nil).Load(
    map[string]any{"id": "test01"}, nil,
)
```

### Ruby

```ruby
client = RealRestSDK.test
result, err = client.Object().load({ "id" => "test01" })
```

### Lua

```lua
local client = sdk.test()
local result, err = client:Object():load({ id = "test01" })
```

## How it works

Every SDK call runs the same five-stage pipeline:

1. **Point** — resolve the API endpoint from the operation definition.
2. **Spec** — build the HTTP specification (URL, method, headers, body).
3. **Request** — send the HTTP request.
4. **Response** — receive and parse the response.
5. **Result** — extract the result data for the caller.

A feature hook fires at each stage (e.g. `PrePoint`, `PreSpec`,
`PreRequest`), so features can inspect or modify the pipeline without
forking the SDK.

### Features

| Feature | Purpose |
| --- | --- |
| **TestFeature** | In-memory mock transport for testing without a live server |

Pass custom features via the `extend` option at construction time.

### Direct and Prepare

For endpoints the entity model doesn't cover, use the low-level methods:

- **`direct(fetchargs)`** — build and send an HTTP request in one step.
- **`prepare(fetchargs)`** — build the request without sending it.

Both accept a map with `path`, `method`, `params`, `query`,
`headers`, and `body`. See the [How-to guides](#how-to-guides) below.

## How-to guides

### Make a direct API call

When the entity interface does not cover an endpoint, use `direct`:

**TypeScript:**
```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example' },
})
console.log(result.data)
```

**Python:**
```python
result, err = client.direct({
    "path": "/api/resource/{id}",
    "method": "GET",
    "params": {"id": "example"},
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

**Go:**
```go
result, err := client.Direct(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "GET",
    "params": map[string]any{"id": "example"},
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

**Lua:**
```lua
local result, err = client:direct({
  path = "/api/resource/{id}",
  method = "GET",
  params = { id = "example" },
})
```

## Per-language documentation

- [TypeScript](ts/README.md)
- [Python](py/README.md)
- [PHP](php/README.md)
- [Golang](go/README.md)
- [Ruby](rb/README.md)
- [Lua](lua/README.md)

---

Generated from the Real REST API OpenAPI spec by [@voxgig/sdkgen](https://github.com/voxgig/sdkgen).
