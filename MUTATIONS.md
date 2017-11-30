# Mutation

## Update items

mutation {
  updateItem(_id:"5965ce9db194222e8b5f897e",
    id:"2",
    name:"test update",
    quantity:111,
    order:9
  ) {
    id
    name
    quantity
    order
  }
}
