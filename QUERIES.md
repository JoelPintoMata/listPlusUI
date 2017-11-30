# Query

## MyLists
query QueryLists {
	myList(id:"<my_list_id>") {
	    id
        name
        items {
            id
            name
            quantity
            order
        }
	}
}

query QueryLists {
	myList(id:"<my_list_id>", sortBy:"<any_of_items_fields>", sortAsc:[true|false]) {
	    id
        name
        items {
            id
            name
            quantity
            order
        }
	}
}

query QueryLists {
    myList {
        id
        name
    }
}

## Items

### Query for an item in particular

query{
  item(id_list:"1", id_item:"2") {
    id
    name
    quantity
    order
  }
}