Server API
====

Notes:
Default result size = 10

Producer
----


{
    name       :  { type: String, required: true, index: true}
  , desc       :  { type: String }
  , referent   :  { type: String }
  , info       :  { type: String }    
  , address    :  { type: String }
  , date       :  { type: Date, default: Date.now }
}

[get]   /producer       get producer list
?size=x                 change result default size
?page=y                 get specific page
[get]   /producer/{id}  get producer
[post]  /producer       add a producer
[post]  /producer/{id}  update producer
[delete]/producer/{id}  delete producer



Product
---

{
    name        :  { type: String, required: true }
  , category    :  { type: String, required: true, index: true}
  , desc        :  { type: String}
  , unit        :  { type: String, required: true }
  , price       :  { type: Number, required: true }    
  , update_date :  { type: Date, default: Date.now }
  , producer    :  { type: db.Schema.Types.ObjectId, ref: 'Producer', required: true}
}


[get]   /product       get product list
[get]   /product/{id}  get product
[post]  /product/{id}  update product
[delete]/product/{id}  delete product


Calendar
----

{
    reference      : { type: String , required: true, index: true}
    , openDate     : { type : Date, required: true }
    , endDate      : { type : Date, required: true }
}


[get]   /calendar               get calendar list
[get]   /calendar/current       get current calendar (c.openDate < date.now < endDate)
[get]   /calendar/{id}          get calendar
[get]   /calendar/{id}/dates    get calendar's delivery dates
[post]  /calendar               add a calendar
[post]  /calendar/{id}          update calendar
[post]  /calendar/dates/{date}  add a delivery date (return delivery dates)
[delete]/calendar/{id}          delete calendar
[delete]/calendar/dates/{date}  delete a delivery date (return delivery dates)

