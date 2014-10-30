Server API
====

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
[get]   /producer/{id}  get producer
[post]  /producer       add a producer
[post]  /producer/product/{id}  add a product to a producer
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
[delete]/calendar/{id}          delete calendar



CalendarItem
---

{
    reference    :  { type: db.Schema.Types.ObjectId, ref: 'Calendar', required: true }
  , delivery_date:  { type: Date, required: true }
  , product      :  { type: db.Schema.Types.ObjectId, ref: 'Product', required: true }
  , price        :  { type: Number, required: true }
})


[get]   /item/date/products/{date}         get products item for a particular calendar date
[get]   /item/date/product/{date}/{id}     get an calendar item (for a date and a product)
[post]  /item/date/product/{date}/{id}     create a calendar item for a product and a date
[delete]/item/date/product/{date}/{id}     delete calendar a calendar item 
