## Key steps to integrate existing react projects

Add these lines in `package.json`.

```json
"dependencies": {
  ...
  "dynamsoft-core": "3.4.21-beta-202411040411",
  "dynamsoft-capture-vision-bundle": "2.4.2200-beta-202411042345"
},
"overrides": {
  "dynamsoft-core": "$dynamsoft-core"
},
```

Install it.

```
npm i
```

If you get `no license module` error, remove `node_modules` and `package-lock.json` and reinstall.

If you want to use it with other versions of Dynamsoft products (namespace/package conflicts), please contact us.
