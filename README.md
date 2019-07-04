# Rlay Performance Tests

> Note: Only implements `write` operation atm. `read` is still to do.

## Install

```
npm i --dev
```

## Usage

with default rpc at http://127.0.0.1:8546

```
npm run test
```

with custom rpc

```
npm run test -- --rpc=http://example.com:1000
```

## Performance Results

Neo4J: Local

Rlay Server: Local

Machine: MacBook 2016; 1.1 GHz Intel Core m3

```
  rlayPerformance:write:storeLimit:1:entities:1 81ms +0ms
  rlayPerformance:write:storeLimit:1:entities:5 228ms +0ms
  rlayPerformance:write:storeLimit:1:entities:10 517ms +0ms
  rlayPerformance:write:storeLimit:1:entities:50 2955ms +0ms
  rlayPerformance:write:storeLimit:1:entities:100 5897ms +0ms
  rlayPerformance:write:storeLimit:1:entities:500 31437ms +0ms
  rlayPerformance:write:storeLimit:1:entities:1000 74318ms +0ms
  rlayPerformance:write:storeLimit:10:entities:1 31ms +0ms
  rlayPerformance:write:storeLimit:10:entities:5 233ms +0ms
  rlayPerformance:write:storeLimit:10:entities:10 451ms +0ms
  rlayPerformance:write:storeLimit:10:entities:50 2796ms +0ms
  rlayPerformance:write:storeLimit:10:entities:100 5116ms +0ms
  rlayPerformance:write:storeLimit:10:entities:500 23758ms +0ms
  rlayPerformance:write:storeLimit:10:entities:1000 48244ms +0ms
  rlayPerformance:write:storeLimit:50:entities:1 49ms +0ms
  rlayPerformance:write:storeLimit:50:entities:5 275ms +0ms
  rlayPerformance:write:storeLimit:50:entities:10 514ms +0ms
  rlayPerformance:write:storeLimit:50:entities:50 2444ms +0ms
  rlayPerformance:write:storeLimit:50:entities:100 5086ms +0ms
  rlayPerformance:write:storeLimit:50:entities:500 30193ms +0ms
  rlayPerformance:write:storeLimit:50:entities:1000 56998ms +0ms
  rlayPerformance:write:storeLimit:100:entities:1 68ms +0ms
  rlayPerformance:write:storeLimit:100:entities:5 286ms +0ms
  rlayPerformance:write:storeLimit:100:entities:10 540ms +0ms
  rlayPerformance:write:storeLimit:100:entities:50 2544ms +0ms
  rlayPerformance:write:storeLimit:100:entities:100 5388ms +0ms
  rlayPerformance:write:storeLimit:100:entities:500 32115ms +0ms
  rlayPerformance:write:storeLimit:100:entities:1000 70816ms +0ms
  rlayPerformance:write:storeLimit:500:entities:1 86ms +0ms
  rlayPerformance:write:storeLimit:500:entities:5 412ms +0ms
  rlayPerformance:write:storeLimit:500:entities:10 739ms +0ms
  rlayPerformance:write:storeLimit:500:entities:50 3929ms +0ms
  rlayPerformance:write:storeLimit:500:entities:100 8444ms +0ms
  rlayPerformance:write:storeLimit:500:entities:500 crash (too many queued requests?)
  rlayPerformance:write:storeLimit:500:entities:1000 crash (too many queued requests?)
```
