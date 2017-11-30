# Mutation

## Update items

mutation {
  updateItem(
    id_list:"1",
    id:"2",
    name:"test update",
    quantity:111,
    order:9
  ) {
    id_list
    id
    name
    quantity
    order
  }
}
