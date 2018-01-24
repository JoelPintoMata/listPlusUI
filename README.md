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

## Others
Close process running on port 4200
```
sudo kill `sudo lsof -t -i:4200`
```

## Further documentation
[Apollo](https://www.apollographql.com/docs/angular/index.html)
[Post Angular app to Heroku](https://medium.com/@ryanchenkie_40935/angular-cli-deployment-host-your-angular-2-app-on-heroku-3f266f13f352)
