# RealRest SDK

Free HTTP test backend that handles GET, POST, PUT, PATCH and DELETE against a real database

> TypeScript, Python, PHP, Golang, Ruby, Lua SDKs, a CLI, an interactive REPL, and an MCP server for AI agents — all generated from one OpenAPI spec by [@voxgig/sdkgen](https://github.com/voxgig/sdkgen).

## About Real REST API

[Real REST API](https://restful-api.dev/) is a free, fully functional REST service backed by a real database, intended for demo projects, testing, learning and tutorials. It is operated by restful-api.dev and exposed at `https://api.restful-api.dev`.

What you get from the API:

- CRUD over a generic `objects` resource using GET, POST, PUT, PATCH and DELETE.
- Each object has `id`, `name` and a free-form `data` payload (any valid JSON: nested objects, arrays or key-value pairs), plus server-managed timestamp fields in responses.
- A pool of sample objects under `/objects` that anyone can read without credentials.
- Authenticated endpoints for user-defined collections (`/collections`, `/collections/{collectionName}/objects`) reached via `/register` and `/login`.

Operational notes: public endpoints require no API key; authenticated endpoints expect an `x-api-key` header and optional JWT bearer token. The service advertises roughly 50 requests/day on the public API and 100 requests/day on the authenticated API, resetting every 24 hours. CORS is not enabled on the public endpoint, so browser clients typically need a proxy.

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

## 30-second quickstart

### TypeScript

```ts
import { RealRestSDK } from 'real-rest'

const client = new RealRestSDK({})

// List all objects
const objects = await client.Object().list()
```

See the [TypeScript README](ts/README.md) for the
full guide, or scroll down for the same example in other languages.

## What's in the box

| Surface | Use it for | Path |
| --- | --- | --- |
| **SDK** (TypeScript, Python, PHP, Golang, Ruby, Lua) | App integration | `ts/` `py/` `php/` `go/` `rb/` `lua/` |
| **CLI** | Scripts, CI, ops, one-off API calls | `go-cli/` |
| **MCP server** | AI agents (Claude, Cursor, Cline) | `go-mcp/` |

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
| **Object** | A generic stored record with `id`, `name` and a free-form JSON `data` field, exposed under `/objects` and `/objects/{id}` for full CRUD via GET, POST, PUT, PATCH and DELETE. | `/objects` |

Each entity supports the following operations where available: **load**,
**list**, **create**, **update**, and **remove**.

## Quickstart in other languages

### Python

```python
from realrest_sdk import RealRestSDK

client = RealRestSDK({})

# List all objects
objects, err = client.Object(None).list(None, None)

# Load a specific object
object, err = client.Object(None).load(
    {"id": "example_id"}, None
)
```

### PHP

```php
<?php
require_once 'realrest_sdk.php';

$client = new RealRestSDK([]);

// List all objects
[$objects, $err] = $client->Object(null)->list(null, null);

// Load a specific object
[$object, $err] = $client->Object(null)->load(
    ["id" => "example_id"], null
);
```

### Golang

```go
import sdk "github.com/voxgig-sdk/real-rest-sdk/go"

client := sdk.NewRealRestSDK(map[string]any{})

// List all objects
objects, err := client.Object(nil).List(nil, nil)
```

### Ruby

```ruby
require_relative "RealRest_sdk"

client = RealRestSDK.new({})

# List all objects
objects, err = client.Object(nil).list(nil, nil)

# Load a specific object
object, err = client.Object(nil).load(
  { "id" => "example_id" }, nil
)
```

### Lua

```lua
local sdk = require("real-rest_sdk")

local client = sdk.new({})

-- List all objects
local objects, err = client:Object(nil):list(nil, nil)

-- Load a specific object
local object, err = client:Object(nil):load(
  { id = "example_id" }, nil
)
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
client = RealRestSDK.test(None, None)
result, err = client.Object(None).load(
    {"id": "test01"}, None
)
```

### PHP

```php
$client = RealRestSDK::test(null, null);
[$result, $err] = $client->Object(null)->load(
    ["id" => "test01"], null
);
```

### Golang

```go
client := sdk.TestSDK(nil, nil)
result, err := client.Object(nil).Load(
    map[string]any{"id": "test01"}, nil,
)
```

### Ruby

```ruby
client = RealRestSDK.test(nil, nil)
result, err = client.Object(nil).load(
  { "id" => "test01" }, nil
)
```

### Lua

```lua
local client = sdk.test(nil, nil)
local result, err = client:Object(nil):load(
  { id = "test01" }, nil
)
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

## Using the Real REST API

- Upstream: [https://restful-api.dev/](https://restful-api.dev/)

- No explicit licence is published on the homepage.
- Offered free of charge for demo projects, testing, learning and education.
- Daily request quotas apply (50/day public, 100/day authenticated).
- Treat as best-effort; do not rely on stored data for production workloads.

---

Generated from the Real REST API OpenAPI spec by [@voxgig/sdkgen](https://github.com/voxgig/sdkgen).
