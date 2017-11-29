[![codebeat badge](https://codebeat.co/badges/552a9896-b7a5-4cda-9359-098d4d7cd815)](https://codebeat.co/projects/github-com-joelpintomata-listplusui-master) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/fbc67c42bc7a4fc8a053bf3e7e0acb3b)](https://www.codacy.com/app/joelmatacv/listPlusUI?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=JoelPintoMata/listPlusUI&amp;utm_campaign=Badge_Grade) 

# What is

## Run
```
$ npm start
```

## Endpoints

Endpoint | Example | Description
-------- | ------- | -----------
http://<server_name>:<port>/myLists | http://localhost:4200/myLists | My lists available
http://<server_name>:<port>/myList/<my_list_id> | http://localhost:4200/myList/1 | My list details

## External components

### Sortable tables

[https://github.com/MIt9/angular-4-data-table-demo](angular-4-data-table-demo)

```
$ npm install angular-4-data-table --save
```

## Usage examples

### Query 

#### MyLists
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

#### Items

##### Query for an item in particular
query{
  item(_id:"<document id>", id_item:"<item id>") {
    id
    name
    quantity
    order
  }
}

### Mutation

#### Update items

mutation {
  updateItem(id_list:"<my_list_id>",
    id_item: "<item_id>",
    order: <item_order>,
    name: "<item_name>",
    quantity: <item_quantity>) {
    id
  }
}
